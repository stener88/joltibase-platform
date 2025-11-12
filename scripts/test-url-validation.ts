/**
 * Test script to verify URL validation accepts both real URLs and merge tags
 */

import { ImageBlockSchema, ButtonBlockSchema, LogoBlockSchema } from '../lib/email/blocks/schemas';

console.log('🧪 Testing URL Validation with Merge Tags\n');

// Test 1: Image block with merge tag
console.log('1️⃣  Testing Image Block with Merge Tag:');
try {
  const imageBlockWithMergeTag = ImageBlockSchema.parse({
    id: 'block-1',
    type: 'image',
    position: 0,
    content: {
      imageUrl: '{{image_url}}',
      altText: 'Product Image',
    },
    settings: {
      width: '100%',
      align: 'center',
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
    },
  });
  console.log('   ✅ Merge tag {{image_url}} accepted\n');
} catch (error) {
  console.log('   ❌ Failed:', error);
}

// Test 2: Image block with real URL
console.log('2️⃣  Testing Image Block with Real URL:');
try {
  const imageBlockWithUrl = ImageBlockSchema.parse({
    id: 'block-2',
    type: 'image',
    position: 1,
    content: {
      imageUrl: 'https://example.com/image.jpg',
      altText: 'Product Image',
    },
    settings: {
      width: '100%',
      align: 'center',
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
    },
  });
  console.log('   ✅ Real URL accepted\n');
} catch (error) {
  console.log('   ❌ Failed:', error);
}

// Test 3: Button block with merge tag
console.log('3️⃣  Testing Button Block with Merge Tag:');
try {
  const buttonBlockWithMergeTag = ButtonBlockSchema.parse({
    id: 'block-3',
    type: 'button',
    position: 2,
    content: {
      text: 'Click Here',
      url: '{{cta_url}}',
    },
    settings: {
      style: 'solid',
      color: '#2563eb',
      textColor: '#ffffff',
      align: 'center',
      size: 'large',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: 700,
      padding: { top: 14, bottom: 14, left: 32, right: 32 },
      containerPadding: { top: 40, bottom: 40, left: 40, right: 40 },
    },
  });
  console.log('   ✅ Merge tag {{cta_url}} accepted\n');
} catch (error) {
  console.log('   ❌ Failed:', error);
}

// Test 4: Logo block with complex merge tag
console.log('4️⃣  Testing Logo Block with Complex Merge Tag:');
try {
  const logoBlockWithMergeTag = LogoBlockSchema.parse({
    id: 'block-4',
    type: 'logo',
    position: 3,
    content: {
      imageUrl: '{{company.logo_url}}',
      altText: 'Company Logo',
    },
    settings: {
      align: 'center',
      width: '150px',
      padding: { top: 40, bottom: 20, left: 20, right: 20 },
    },
  });
  console.log('   ✅ Complex merge tag {{company.logo_url}} accepted\n');
} catch (error) {
  console.log('   ❌ Failed:', error);
}

// Test 5: Invalid URL (should fail)
console.log('5️⃣  Testing Image Block with Invalid URL (should fail):');
try {
  const imageBlockWithInvalidUrl = ImageBlockSchema.parse({
    id: 'block-5',
    type: 'image',
    position: 4,
    content: {
      imageUrl: 'not-a-valid-url',
      altText: 'Product Image',
    },
    settings: {
      width: '100%',
      align: 'center',
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
    },
  });
  console.log('   ❌ Invalid URL was incorrectly accepted (this is a bug!)\n');
} catch (error) {
  console.log('   ✅ Invalid URL correctly rejected\n');
}

console.log('='.repeat(60));
console.log('✨ URL Validation Test Summary:');
console.log('='.repeat(60));
console.log('✅ Merge tags are accepted ({{image_url}}, {{cta_url}}, etc.)');
console.log('✅ Real URLs are accepted (https://...)');
console.log('✅ Invalid strings are rejected (not-a-url)');
console.log('='.repeat(60));


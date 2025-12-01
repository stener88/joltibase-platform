/**
 * Test the new multi-layer email validator
 */

import fs from 'fs';
import path from 'path';
import { validateEmail, getValidationSummary } from '../emails/lib/email-validator';

// Test patterns
const patternsDir = path.join(process.cwd(), 'emails/components');
const patternFiles = [
  'TravelDestinationExample.tsx',
  'WelcomeSimpleExample.tsx',
  'PromotionalDiscountExample.tsx',
];

console.log('🧪 Testing Email Validator\n');
console.log('='.repeat(70));

for (const filename of patternFiles) {
  const filepath = path.join(patternsDir, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`\n❌ File not found: ${filename}`);
    continue;
  }
  
  const code = fs.readFileSync(filepath, 'utf-8');
  const result = validateEmail(code);
  const summary = getValidationSummary(result);
  
  console.log(`\n📄 ${filename}`);
  console.log(`   ${summary}`);
  
  if (result.issues.length > 0) {
    console.log(`\n   Issues:`);
    result.issues.forEach((issue, i) => {
      const emoji = issue.severity === 'error' ? '❌' : '⚠️';
      console.log(`   ${i + 1}. ${emoji} [${issue.type}] ${issue.message}`);
      if (issue.suggestion) {
        console.log(`      → ${issue.suggestion}`);
      }
    });
  }
}

console.log('\n' + '='.repeat(70));

// Test a deliberately broken email
console.log('\n\n🧪 Testing Deliberately Broken Email\n');
console.log('='.repeat(70));

const brokenEmail = `
import { Html, Head, Body, Container, Section, Text, Button, Img } from '@react-email/components';

export default function BrokenEmail() {
  return (
    <Html>
      <Head />
      <Body className="bg-gray-100">
        <Container>
          <Section>
            <Img src="/logo.png" />
            <Text style={{ fontSize: '10px' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
            <Button href="#">Click Here</Button>
            <Button href="#">Learn More</Button>
            <Button href="#">Sign Up</Button>
            <Button href="#">Get Started</Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
`;

const brokenResult = validateEmail(brokenEmail);
const brokenSummary = getValidationSummary(brokenResult);

console.log(`\n📄 Broken Email Test`);
console.log(`   ${brokenSummary}`);

if (brokenResult.issues.length > 0) {
  console.log(`\n   Issues Found:`);
  brokenResult.issues.forEach((issue, i) => {
    const emoji = issue.severity === 'error' ? '❌' : '⚠️';
    console.log(`   ${i + 1}. ${emoji} [${issue.type}] ${issue.message}`);
  });
}

console.log('\n' + '='.repeat(70));
console.log('\n✅ Validator test complete\n');


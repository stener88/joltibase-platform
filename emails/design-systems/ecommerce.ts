/**
 * E-COMMERCE CONVERSION EMAIL DESIGN SYSTEM
 * 
 * Complete specification for generating high-converting product emails.
 * Optimized for: Sales, promotions, product launches, abandoned carts, recommendations
 * 
 * Target Audience: Online shoppers, DTC brand customers, e-commerce consumers
 * Goal: Drive purchases, maximize conversion rate, create urgency
 */

export const EcommerceDesignSystem = {
  // ============================================================================
  // METADATA
  // ============================================================================
  
  id: 'ecommerce-conversion',
  name: 'E-commerce Conversion',
  description: 'Product-focused, conversion-optimized design for online retail',
  
  /**
   * Detection triggers - keywords that indicate this design system should be used
   */
  triggers: [
    // Sales & promotions
    'sale', 'discount', 'promo', 'promotion', 'offer', 'deal', 'coupon',
    'Black Friday', 'Cyber Monday', 'clearance', 'limited time', 'flash sale',
    
    // E-commerce actions
    'shop', 'buy', 'purchase', 'cart', 'checkout', 'abandoned cart',
    'product', 'collection', 'new arrival', 'bestseller', 'trending',
    
    // Product types
    'clothing', 'fashion', 'apparel', 'accessories', 'jewelry', 'shoes',
    'furniture', 'home decor', 'beauty', 'cosmetics', 'gadgets', 'electronics',
    
    // Brand types
    'store', 'shop', 'boutique', 'retail', 'DTC', 'brand', 'Shopify',
    'e-commerce', 'ecommerce', 'online store', 'marketplace',
    
    // Campaign types
    'launch', 'drop', 'release', 'restock', 'pre-order', 'exclusive',
    'recommendation', 'personalized', 'you might like'
  ],
  
  /**
   * Image keywords for this design system
   * Used to fetch contextually appropriate, aesthetically consistent images
   */
  imageKeywords: {
    hero: ['shopping bags colorful retail', 'ecommerce lifestyle shopping', 'retail store display colorful'],
    feature: ['product showcase display', 'shopping online ecommerce', 'retail product photography'],
    product: ['product photography white background', 'ecommerce product display', 'product showcase isolated'],
    background: ['shopping celebration colorful', 'retail pattern vibrant', 'sale celebration'],
  },
  
  // ============================================================================
  // COMPLETE DESIGN SYSTEM SPECIFICATION
  // ============================================================================
  
  system: `
# E-COMMERCE CONVERSION EMAIL DESIGN SYSTEM

## 🎯 DESIGN PHILOSOPHY

**Core Principle**: Every element should drive toward purchase. Remove friction, create desire, establish urgency.

This design system prioritizes:
- **Visual Product Display**: Large, high-quality product imagery
- **Clear Value Proposition**: Price, discount, benefit immediately visible
- **Conversion Psychology**: Urgency, scarcity, social proof
- **Frictionless CTAs**: One-click to product page, minimal steps to checkout

**Target Audience**: Online shoppers ready to buy, price-conscious consumers, impulse buyers

**Goal**: Maximize click-through to product pages and conversion to purchase

---

## 📐 TYPOGRAPHY & PRICING

### Price Display (MOST IMPORTANT)

\`\`\`
Sale Price (PRIMARY)
├─ Size: 32-36px (LARGE, impossible to miss)
├─ Weight: 700
├─ Color: #dc2626 (RED - universal sale indicator)
├─ Margin: 0 16px 0 0 (space for comparison)
└─ Usage: Current sale price

Original Price (Comparison)
├─ Size: 20-24px
├─ Weight: 400
├─ Color: #9ca3af (muted gray)
├─ Text Decoration: line-through
├─ Margin: 0 12px 0 0
└─ Usage: Show the savings

Savings Callout
├─ Size: 16-18px
├─ Weight: 600-700
├─ Color: #059669 (GREEN - positive)
├─ Background: #d1fae5 (light green)
├─ Padding: 6px 12px
├─ Border Radius: 6px
└─ Usage: "Save $150!" or "(50% off)"
\`\`\`

### Headlines

\`\`\`
H1 (Sale Headers - URGENT)
├─ Size: 40-48px
├─ Weight: 700-800
├─ Line Height: 1.1
├─ Color: #111827 OR brand primary
├─ Text Transform: UPPERCASE for urgency
└─ Usage: "FLASH SALE", "50% OFF"

H2 (Product Names)
├─ Size: 24-28px
├─ Weight: 600-700
├─ Color: #111827
└─ Usage: Product titles
\`\`\`

### Body Text

\`\`\`
Product Description
├─ Size: 16px
├─ Weight: 400
├─ Line Height: 1.6
├─ Color: #4b5563
├─ Length: 1-2 sentences MAX
└─ Usage: Brief product benefits
\`\`\`

---

## 🎨 COLOR SYSTEM

### Conversion Colors (CRITICAL)

\`\`\`
Sale Red (Urgency & Discounts)
├─ Sale Price: #dc2626
├─ Urgency: #ea580c
├─ Badges: #dc2626
└─ Usage: Prices, "LIMITED TIME", sale badges

Success Green (Savings & Positive)
├─ Savings: #059669
├─ In Stock: #10b981
├─ Free Shipping: #059669
└─ Usage: "Save $XX", availability, benefits

Brand Primary (CTAs)
├─ Primary: #2563eb (or brand color)
├─ Hover: #1d4ed8
└─ Usage: "SHOP NOW", "BUY NOW" buttons

Neutral (Foundation)
├─ Text: #111827 (headlines), #4b5563 (body)
├─ Borders: #e5e7eb
├─ Background: #ffffff, #f9fafb
└─ Usage: Text, cards, backgrounds
\`\`\`

### Color Rules

1. **Sale prices ALWAYS red** (#dc2626)
2. **Savings ALWAYS green** (#059669)
3. **High contrast CTAs** (white on bold color)
4. **Neutral backgrounds** (don't compete with products)
5. **Maximum 4 colors** (red + green + brand + neutral)

---

## 📏 SPACING & LAYOUT

### Product Grid Spacing (Tight for Density)

\`\`\`
Product Cards
├─ Card padding: 16px
├─ Between cards: 16px
├─ Image to text: 12px
├─ Text to price: 8px
├─ Price to CTA: 16px
└─ Goal: Show more products

Section Spacing
├─ Hero: 32px vertical
├─ Product grid: 24px padding
├─ Between sections: 32px
└─ Footer: 32px
\`\`\`

### Layout Patterns

**Product Grid (2 Columns)**:
- Each column: 50% width (280px)
- Gap: 16px
- Stack on mobile
- Consistent card heights

**Hero Product**:
- Full width image
- Centered content
- Price prominent
- Large CTA

---

## 🔘 CTA DESIGN (CONVERSION-OPTIMIZED)

### Primary CTA (Maximum Impact)

\`\`\`css
background-color: #2563eb;
color: #ffffff;
font-size: 18px;
font-weight: 700;
text-transform: UPPERCASE;
letter-spacing: 1px;
padding: 16px 48px;
border-radius: 8px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
text-decoration: none;
display: inline-block;
\`\`\`

### CTA Text (Action-Oriented)

**Product CTAs**: "SHOP NOW", "BUY NOW", "ADD TO CART"
**Sale CTAs**: "SHOP THE SALE", "GET 50% OFF"
**Urgency CTAs**: "SHOP BEFORE IT'S GONE", "GET IT NOW"

### CTA Rules

1. **One CTA per product** - clear action
2. **Action verbs** - "Shop", "Buy", "Get"
3. **High contrast** - impossible to miss
4. **Large touch targets** - 44px+ height
5. **Repeat CTAs** - one per product is OK

---

## 🖼️ IMAGE GUIDELINES

### Product Images (CRITICAL)

**Specifications**:
- **Aspect Ratio**: 1:1 (square) for grid consistency
- **Dimensions**: 600×600px minimum (1200×1200px for retina)
- **Background**: Pure white (#ffffff) for products
- **Format**: JPG or PNG
- **Quality**: Professional, high-resolution

**Content**:
- Clean product shots on white
- Consistent lighting
- Same framing across all products
- Lifestyle images for context

### Sale Badges (Overlay on Images)

\`\`\`tsx
// SALE badge (top-left of product image)
<div style={{
  position: 'absolute',
  top: '12px',
  left: '12px',
  backgroundColor: '#dc2626',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '700',
  padding: '4px 8px',
  borderRadius: '4px',
  textTransform: 'uppercase'
}}>
  SALE
</div>
\`\`\`

### Alt Text for Products

- Include: Product name, color, key features
- Example: "Navy blue wireless headphones with carrying case"
- Example: "Women's leather crossbody bag in cognac brown"

---

## 🏆 CONVERSION OPTIMIZATION

### Urgency & Scarcity

**Low Stock**:
\`\`\`tsx
<Text style={{ fontSize: '14px', color: '#ea580c', fontWeight: '600' }}>
  ⚠️ Only 3 left in stock!
</Text>
\`\`\`

**Countdown Timer**:
\`\`\`tsx
<Text style={{ fontSize: '16px', color: '#dc2626', fontWeight: '700' }}>
  Sale ends in: 23h 45m
</Text>
\`\`\`

### Social Proof

**Bestseller Badge**:
\`\`\`tsx
<div style={{ backgroundColor: '#f59e0b', color: '#ffffff', padding: '4px 8px' }}>
  ⭐ BESTSELLER
</div>
\`\`\`

**Reviews**:
\`\`\`tsx
<Text style={{ fontSize: '14px', color: '#4b5563' }}>
  ⭐⭐⭐⭐⭐ 4.8/5 (2,347 reviews)
</Text>
\`\`\`

### Value Reinforcement

**Savings Display**:
\`\`\`tsx
<div style={{
  backgroundColor: '#d1fae5',
  padding: '8px 16px',
  borderRadius: '6px',
  display: 'inline-block'
}}>
  <Text style={{ fontSize: '18px', fontWeight: '700', color: '#059669', margin: 0 }}>
    You Save $150!
  </Text>
</div>
\`\`\`

---

## 🎁 COMPONENT TEMPLATES

### Hero Product Component

\`\`\`tsx
<Section style={{ padding: '32px 24px', textAlign: 'center' }}>
  {/* Sale Badge */}
  <div style={{
    display: 'inline-block',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    padding: '6px 12px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    marginBottom: '16px'
  }}>
    50% OFF - LIMITED TIME
  </div>
  
  {/* Product Image */}
  <Img 
    src="..."
    alt="Product description with color and features"
    style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto 24px',
      display: 'block'
    }}
  />
  
  {/* Product Name */}
  <Heading style={{
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 12px 0'
  }}>
    Product Name
  </Heading>
  
  {/* Description */}
  <Text style={{
    fontSize: '16px',
    color: '#4b5563',
    lineHeight: '1.6',
    margin: '0 0 16px 0'
  }}>
    Brief benefit-focused description (1-2 sentences).
  </Text>
  
  {/* Price */}
  <div style={{ marginBottom: '24px' }}>
    <span style={{
      fontSize: '32px',
      fontWeight: '700',
      color: '#dc2626',
      marginRight: '12px'
    }}>
      $149
    </span>
    <span style={{
      fontSize: '20px',
      color: '#9ca3af',
      textDecoration: 'line-through'
    }}>
      $299
    </span>
  </div>
  
  {/* CTA */}
  <Button
    href="https://shop.example.com/product"
    style={{
      backgroundColor: '#2563eb',
      color: '#ffffff',
      fontSize: '18px',
      fontWeight: '700',
      textTransform: 'uppercase',
      padding: '16px 48px',
      borderRadius: '8px',
      textDecoration: 'none',
      display: 'inline-block'
    }}
  >
    SHOP NOW
  </Button>
</Section>
\`\`\`

### Product Grid Card

\`\`\`tsx
<div style={{
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px',
  textAlign: 'center'
}}>
  <Img src="..." alt="..." style={{ width: '100%', marginBottom: '12px' }} />
  <Text style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
    Product Name
  </Text>
  <div style={{ marginBottom: '12px' }}>
    <span style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>$49</span>
    {' '}
    <span style={{ fontSize: '16px', color: '#9ca3af', textDecoration: 'line-through' }}>$99</span>
  </div>
  <Button
    href="..."
    style={{
      backgroundColor: '#111827',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '600',
      padding: '10px 20px',
      borderRadius: '6px',
      width: '100%',
      textAlign: 'center'
    }}
  >
    Add to Cart
  </Button>
</div>
\`\`\`

### Urgency Banner

\`\`\`tsx
<Section style={{
  backgroundColor: '#dc2626',
  padding: '20px 24px',
  textAlign: 'center'
}}>
  <Text style={{
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    margin: '0 0 8px 0'
  }}>
    ⚡ FLASH SALE - 50% OFF EVERYTHING ⚡
  </Text>
  <Text style={{
    fontSize: '16px',
    color: '#ffffff',
    margin: '0 0 4px 0'
  }}>
    Use code: <strong>FLASH50</strong> at checkout
  </Text>
  <Text style={{
    fontSize: '14px',
    color: '#fecaca',
    margin: 0
  }}>
    Ends in: 23 hours 45 minutes
  </Text>
</Section>
\`\`\`

---

## ⚠️ COMMON E-COMMERCE MISTAKES

❌ **Too many products** - Limit to 2-6 per email
❌ **Hiding the price** - Make it prominent, above fold
❌ **Vague CTAs** - "Shop Now" > "Learn More"
❌ **Missing urgency** - Show when sale ends
❌ **Poor mobile** - Products must stack, CTAs tappable
❌ **Inconsistent images** - Same aspect ratio, background
❌ **No value proposition** - Why buy NOW?

---

## 📝 EMAIL TYPES

### Flash Sale Email
- Urgency banner at top
- Hero product with large discount
- 2-4 additional products in grid
- Countdown timer
- Multiple "Shop Now" CTAs

### Product Launch Email
- Hero image of new product
- Product name + key benefit
- Price + availability
- Large "Shop Now" CTA
- 3 key features
- Repeat CTA

### Abandoned Cart Email
- Personal header ("You left something...")
- Cart items with images
- Total price
- Large "Complete Checkout" CTA
- Urgency OR incentive

### Product Recommendations
- Personalized header
- 4-6 product grid
- Quick details + CTA each
- "View All" link

---

## ✅ GENERATION CHECKLIST

- [ ] Price displayed prominently (sale price in red)
- [ ] Clear CTAs ("Shop Now", "Buy Now", "Add to Cart")
- [ ] Product images high-quality, consistent
- [ ] Urgency/scarcity if applicable
- [ ] Social proof when available (reviews, bestseller)
- [ ] Mobile-friendly grid (stacks properly)
- [ ] Value proposition clear
- [ ] Free shipping mentioned if applicable
- [ ] Inline styles only (no className)
- [ ] All images have descriptive alt text
`,

  // ============================================================================
  // COMPLETE REFERENCE EXAMPLE
  // ============================================================================

  exampleEmail: `import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Heading,
  Text,
  Button
} from '@react-email/components';

/**
 * E-commerce Flash Sale Email
 * Use Case: Limited-time product promotion with urgency
 */
export default function FlashSaleEmail() {
  return (
    <Html lang="en">
      <Head>
        <title>Flash Sale - 50% Off Wireless Headphones</title>
      </Head>
      <Body style={{
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: 0,
        padding: 0
      }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          {/* Urgency Banner */}
          <Section style={{
            backgroundColor: '#dc2626',
            padding: '20px 24px',
            textAlign: 'center'
          }}>
            <Text style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              textTransform: 'uppercase',
              margin: '0 0 8px 0'
            }}>
              ⚡ FLASH SALE - 50% OFF EVERYTHING ⚡
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#ffffff',
              margin: '0 0 4px 0'
            }}>
              Use code: <strong>FLASH50</strong> at checkout
            </Text>
            <Text style={{
              fontSize: '14px',
              color: '#fecaca',
              margin: 0
            }}>
              Ends in: 23 hours 45 minutes
            </Text>
          </Section>

          {/* Free Shipping Banner */}
          <Section style={{
            backgroundColor: '#059669',
            padding: '12px 24px',
            textAlign: 'center'
          }}>
            <Text style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffffff',
              margin: 0
            }}>
              ✓ FREE SHIPPING on all orders • ✓ 30-Day Returns
            </Text>
          </Section>

          {/* Hero Product */}
          <Section style={{ padding: '40px 24px', textAlign: 'center' }}>
            {/* Sale Badge */}
            <div style={{
              display: 'inline-block',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
              padding: '6px 12px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              50% OFF - TODAY ONLY
            </div>

            {/* Product Image */}
            <Img 
              src="https://example.com/headphones.jpg"
              alt="Navy blue wireless headphones with active noise cancellation and carrying case"
              style={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                display: 'block',
                margin: '0 auto 24px'
              }}
            />
            
            {/* Bestseller Badge */}
            <div style={{
              display: 'inline-block',
              backgroundColor: '#f59e0b',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '700',
              padding: '4px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              ⭐ BESTSELLER
            </div>

            <Heading style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 12px 0',
              lineHeight: '1.2'
            }}>
              Premium Wireless Headphones
            </Heading>
            
            <Text style={{
              fontSize: '16px',
              color: '#4b5563',
              lineHeight: '1.6',
              margin: '0 0 8px 0'
            }}>
              Studio-quality sound with 30-hour battery life and premium comfort.
            </Text>

            <Text style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 20px 0'
            }}>
              ⭐⭐⭐⭐⭐ 4.9/5 (3,247 reviews)
            </Text>
            
            {/* Price Display */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#dc2626',
                marginRight: '16px'
              }}>
                $149
              </span>
              <span style={{
                fontSize: '24px',
                color: '#9ca3af',
                textDecoration: 'line-through',
                marginRight: '12px'
              }}>
                $299
              </span>
            </div>

            <div style={{
              display: 'inline-block',
              backgroundColor: '#d1fae5',
              padding: '8px 16px',
              borderRadius: '6px',
              marginBottom: '24px'
            }}>
              <Text style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#059669',
                margin: 0
              }}>
                You Save $150! 💰
              </Text>
            </div>
            
            {/* Primary CTA */}
            <Button
              href="https://shop.example.com/headphones"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '18px 56px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                marginBottom: '16px'
              }}
            >
              SHOP NOW
            </Button>

            <Text style={{
              fontSize: '14px',
              color: '#ea580c',
              fontWeight: '600',
              margin: 0
            }}>
              ⚠️ Only 12 left in stock!
            </Text>
          </Section>

          {/* Product Grid */}
          <Section style={{ padding: '24px' }}>
            <Heading style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827',
              textAlign: 'center',
              margin: '0 0 24px 0'
            }}>
              More Deals You'll Love
            </Heading>

            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                {/* Product 1 */}
                <td width="50%" valign="top" style={{ padding: '8px' }}>
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <Img 
                      src="https://example.com/watch.jpg"
                      alt="Silver smartwatch with black sport band"
                      style={{
                        width: '100%',
                        maxWidth: '260px',
                        height: 'auto',
                        display: 'block',
                        margin: '0 auto 12px'
                      }}
                    />
                    <Text style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0 0 8px 0'
                    }}>
                      Smart Watch Pro
                    </Text>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#dc2626',
                        marginRight: '8px'
                      }}>
                        $199
                      </span>
                      <span style={{
                        fontSize: '16px',
                        color: '#9ca3af',
                        textDecoration: 'line-through'
                      }}>
                        $399
                      </span>
                    </div>
                    <Button
                      href="https://shop.example.com/watch"
                      style={{
                        backgroundColor: '#111827',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '600',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        display: 'block',
                        textAlign: 'center',
                        width: '100%'
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </td>
                
                {/* Product 2 */}
                <td width="50%" valign="top" style={{ padding: '8px' }}>
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <Img 
                      src="https://example.com/speaker.jpg"
                      alt="Portable Bluetooth speaker in black"
                      style={{
                        width: '100%',
                        maxWidth: '260px',
                        height: 'auto',
                        display: 'block',
                        margin: '0 auto 12px'
                      }}
                    />
                    <Text style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0 0 8px 0'
                    }}>
                      Portable Speaker
                    </Text>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#dc2626',
                        marginRight: '8px'
                      }}>
                        $79
                      </span>
                      <span style={{
                        fontSize: '16px',
                        color: '#9ca3af',
                        textDecoration: 'line-through'
                      }}>
                        $159
                      </span>
                    </div>
                    <Button
                      href="https://shop.example.com/speaker"
                      style={{
                        backgroundColor: '#111827',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '600',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        display: 'block',
                        textAlign: 'center',
                        width: '100%'
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </td>
              </tr>
            </table>
          </Section>

          {/* Footer */}
          <Section style={{
            padding: '24px',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <Text style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 8px 0'
            }}>
              © 2025 Shop Name. All rights reserved.
            </Text>
            <Text style={{
              fontSize: '12px',
              color: '#9ca3af',
              margin: 0
            }}>
              Questions? Contact us at support@shop.com
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}`
};


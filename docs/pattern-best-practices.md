# Email Pattern Best Practices

## 📚 Overview

Email patterns are **complete, production-ready examples** that the AI learns from to generate new campaigns. They are NOT reusable templates with variable data - they are **standalone, fully-written emails** that demonstrate structure, styling, and content approach.

---

## 🎯 Core Principles

### **1. Patterns are Final Emails, Not Templates**

**Think of patterns as:**
- Examples of what the final email should look like
- Complete with all content written out
- Representative of actual use cases
- Directly copy-paste-able with minor tweaks

**NOT as:**
- Reusable templates with slots
- Data-driven components
- Abstract structures waiting for content

---

## ✅ Content Guidelines

### **ALWAYS: Write Static Content**

```tsx
// ✅ CORRECT - Full, rich content
<Section className="p-8">
  <Heading className="text-2xl font-bold text-gray-900">
    5 Tips for Better Productivity
  </Heading>
  <Text className="text-gray-700 mb-4">
    Boost your efficiency with these proven strategies that successful teams use every day.
  </Text>
  <Text className="text-gray-700 mb-4">
    First, establish a clear morning routine. Start your day by reviewing your top 3 priorities and blocking time for deep work.
  </Text>
  <Text className="text-gray-700 mb-4">
    Second, use the Pomodoro Technique. Work in focused 25-minute sessions with 5-minute breaks to maintain peak concentration.
  </Text>
  <Text className="text-gray-700 mb-4">
    Third, minimize context switching. Group similar tasks together and dedicate specific time blocks to email, meetings, and creative work.
  </Text>
</Section>
```

```tsx
// ❌ WRONG - Dynamic variables and loops
<Section className="p-8">
  <Heading>{title}</Heading>
  <Text>{description}</Text>
  {tips.map(tip => (
    <Text key={tip.id}>{tip.description}</Text>
  ))}
</Section>
```

---

### **Props: URLs and Names Only**

**Allowed Props:**
- User names: `userName = 'Sarah'`
- URLs: `ctaUrl = 'https://example.com/get-started'`
- Company names: `companyName = 'Acme Corp'`
- Image URLs: `logoUrl = 'https://...'`

**NOT Allowed:**
- Content arrays: `tips = [...]`, `articles = [...]`
- Body text: `description = '...'`, `content = '...'`
- Any data that would go in the email body

**Example:**
```tsx
interface WelcomeEmailProps {
  userName?: string;          // ✅ OK - personalization
  companyName?: string;       // ✅ OK - branding
  ctaUrl?: string;           // ✅ OK - link destination
  articles?: Article[];      // ❌ NO - body content
  description?: string;      // ❌ NO - body content
}
```

---

### **Repeated Sections: Write Them Out**

If the pattern has multiple similar sections (articles, tips, features):

```tsx
// ✅ CORRECT - Write all 3 articles individually
<Section className="px-6 py-4">
  {/* Article 1 */}
  <Section className="mb-6">
    <Img src="https://images.unsplash.com/photo-1..." alt="AI News" className="rounded-md mb-2" width="100%"/>
    <Heading className="text-xl font-semibold text-gray-700 mb-2">
      The Future of AI in 2025
    </Heading>
    <Text className="text-gray-600 text-sm leading-relaxed mb-3">
      Artificial intelligence continues to transform how we work and live. From advanced language models to autonomous systems, discover the top trends shaping the AI landscape this year.
    </Text>
    <Link href="https://example.com/ai-2025" className="text-blue-600 text-sm font-semibold">
      Read More →
    </Link>
  </Section>

  {/* Article 2 */}
  <Section className="mb-6">
    <Img src="https://images.unsplash.com/photo-2..." alt="Remote Work" className="rounded-md mb-2" width="100%"/>
    <Heading className="text-xl font-semibold text-gray-700 mb-2">
      Remote Work Best Practices
    </Heading>
    <Text className="text-gray-600 text-sm leading-relaxed mb-3">
      Master the art of working from home with these essential strategies. Learn how to maintain productivity, stay connected with your team, and achieve work-life balance.
    </Text>
    <Link href="https://example.com/remote-work" className="text-blue-600 text-sm font-semibold">
      Read More →
    </Link>
  </Section>

  {/* Article 3 */}
  <Section className="mb-6">
    <Img src="https://images.unsplash.com/photo-3..." alt="Productivity" className="rounded-md mb-2" width="100%"/>
    <Heading className="text-xl font-semibold text-gray-700 mb-2">
      10x Your Productivity
    </Heading>
    <Text className="text-gray-600 text-sm leading-relaxed mb-3">
      Unlock your full potential with time-tested productivity techniques. From deep work sessions to effective task prioritization, transform how you accomplish your goals.
    </Text>
    <Link href="https://example.com/productivity" className="text-blue-600 text-sm font-semibold">
      Read More →
    </Link>
  </Section>
</Section>
```

```tsx
// ❌ WRONG - Array mapping
{articles.map(article => (
  <Section key={article.id}>
    <Heading>{article.title}</Heading>
    <Text>{article.description}</Text>
  </Section>
))}
```

---

## 🎨 Styling Guidelines

### **Tailwind Classes - Email Safe Only**

**✅ ALWAYS USE:**
- Size: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`
- Colors: `text-gray-700`, `bg-blue-600`, `border-gray-300`
- Spacing: `p-4`, `px-6`, `py-3`, `m-0`, `mt-4`, `mb-8`
- Layout: `flex`, `flex-col`, `items-center`, `justify-between`
- Typography: `font-bold`, `font-semibold`, `leading-relaxed`
- Borders: `rounded-lg`, `border`, `border-t`

**❌ NEVER USE:**
- `hover:` - Cannot be inlined in emails
- `focus:` - Not supported in email clients
- `active:` - Not supported in email clients
- `dark:` - Not supported in email clients
- `group-hover:` - Not supported in email clients
- Any pseudo-class or state-based selectors

**Why?** Email clients don't support `<style>` tags with pseudo-classes. React Email can only inline static styles.

---

## 🏗️ Structure Guidelines

### **Required Structure:**

Every pattern MUST include:

```tsx
import { Html, Head, Body, Container, Tailwind, ... } from '@react-email/components';
import tailwindConfig from '../tailwind.config';

export default function PatternName({ ... }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-gray-100 font-sans">
          <Preview>Preview text for email clients</Preview>
          <Container className="max-w-xl mx-auto bg-white">
            {/* Your content here */}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
```

### **Component Hierarchy:**
1. `<Html>` - Root wrapper
2. `<Head />` - Required for email metadata
3. `<Tailwind>` - Enables Tailwind class conversion
4. `<Body>` - Email body container
5. `<Container>` - Content width constraint (max 600px)
6. `<Section>` - Content blocks
7. Text components: `<Text>`, `<Heading>`, `<Button>`, `<Link>`

---

## 📝 Pattern Metadata

### **JSDoc Comment:**

```tsx
/**
 * PATTERN: [Clear, descriptive name]
 * USE CASE: [When should this pattern be used? What problem does it solve?]
 * TAGS: [comma, separated, tags, for, semantic, search]
 */
```

**Good Examples:**
```tsx
/**
 * PATTERN: Product Launch Newsletter
 * USE CASE: Announce new product with features, benefits, and call-to-action
 * TAGS: product, launch, announcement, features, newsletter, marketing
 */
```

```tsx
/**
 * PATTERN: Weekly Tips Digest
 * USE CASE: Educational content with 3-5 actionable tips and clear structure
 * TAGS: tips, education, weekly, digest, learning, tutorial, how-to
 */
```

---

## 🎨 Content Quality Standards

### **Write Production-Ready Content:**

**✅ Good:**
- "Discover the latest trends in artificial intelligence and how they're transforming industries worldwide. From healthcare to finance, AI is creating new possibilities every day."

**❌ Bad:**
- "Lorem ipsum dolor sit amet"
- "{article.description}"
- "Put your content here"
- "Example text"

### **Use Realistic Examples:**
- Real company names in defaults: `companyName = 'Acme Corp'`
- Real user names: `userName = 'Sarah'`
- Real URLs: `ctaUrl = 'https://example.com/get-started'`
- Meaningful image alt text: `alt="Product Dashboard Screenshot"`

---

## 📏 Pattern Size Guidelines

### **Ideal Pattern Length:**
- **Welcome emails:** 100-150 lines
- **Newsletters:** 150-250 lines (3-4 articles written out)
- **Announcements:** 80-120 lines
- **Transactional:** 60-100 lines

### **Content Depth:**
- Each section should have 2-3 sentences minimum
- Headlines should be specific and compelling
- CTAs should be clear and actionable
- Include footer with unsubscribe (email compliance)

---

## 🧪 Pattern Testing Checklist

Before adding a pattern to the library:

- [ ] No `.map()`, `.forEach()`, or array iterations
- [ ] No dynamic variables in body content (`{tip.text}`)
- [ ] No `hover:`, `focus:`, `dark:`, or pseudo-class selectors
- [ ] Renders without errors (`npm run email:test`)
- [ ] All text content is static and meaningful
- [ ] Props interface is minimal (URLs/names only)
- [ ] Has proper JSDoc comment with USE CASE and TAGS
- [ ] Follows Tailwind email-safe guidelines
- [ ] Includes required structure (Html, Head, Tailwind, Body, Container)
- [ ] Visual editor can select and edit all text elements

---

## 🎯 Pattern Categories

### **1. Welcome Emails**
- Simple welcome with CTA
- Multi-step onboarding
- Feature showcase

### **2. Newsletters**
- Article digest (3-4 articles)
- Tips and tricks (5-7 tips)
- Company updates

### **3. Announcements**
- Product launches
- Feature updates
- Company news

### **4. Re-engagement**
- Win-back campaigns
- Feedback requests
- Special offers

### **5. Transactional**
- Order confirmations
- Password resets
- Account notifications

---

## 💡 Common Patterns

### **Newsletter with Articles:**
```tsx
// Write 3-4 articles individually, not in a loop
<Section className="p-6">
  <Heading className="text-2xl font-bold mb-6">This Week's Highlights</Heading>
  
  {/* Article 1 - Fully written */}
  <Section className="mb-8">
    <Img src="..." alt="..." className="w-full rounded mb-3"/>
    <Heading className="text-xl font-semibold mb-2">
      Breaking: New AI Model Achieves Human-Level Performance
    </Heading>
    <Text className="text-gray-600 leading-relaxed mb-3">
      Researchers at Stanford have unveiled a groundbreaking AI system that matches human performance across multiple benchmarks. This development marks a significant milestone in the field of artificial intelligence.
    </Text>
    <Link href="https://example.com/ai-breakthrough" className="text-blue-600 font-semibold">
      Read Full Story →
    </Link>
  </Section>
  
  {/* Article 2 - Fully written */}
  <Section className="mb-8">
    {/* Complete content here... */}
  </Section>
  
  {/* Article 3 - Fully written */}
  <Section className="mb-8">
    {/* Complete content here... */}
  </Section>
</Section>
```

### **Tips List:**
```tsx
// Write each tip individually
<Section className="p-6">
  <Heading className="text-2xl font-bold mb-4">5 Productivity Tips</Heading>
  
  <Text className="text-gray-700 mb-4">
    <strong>1. Start with your MIT (Most Important Task)</strong><br/>
    Tackle your biggest priority first thing in the morning when your energy is highest.
  </Text>
  
  <Text className="text-gray-700 mb-4">
    <strong>2. Use time blocking</strong><br/>
    Schedule specific blocks for different types of work to minimize context switching.
  </Text>
  
  {/* Continue for all 5 tips... */}
</Section>
```

---

## 🚫 Common Mistakes

### **1. Using Array Props**
```tsx
// ❌ WRONG
interface Props {
  articles?: Article[];
}

// ✅ CORRECT
interface Props {
  userName?: string;
  companyName?: string;
}
```

### **2. Dynamic Content**
```tsx
// ❌ WRONG
<Text>{article.description}</Text>

// ✅ CORRECT
<Text>
  Complete paragraph of actual content written here with full sentences and details.
</Text>
```

### **3. Hover Classes**
```tsx
// ❌ WRONG
<Link className="text-blue-600 hover:text-blue-800">

// ✅ CORRECT
<Link className="text-blue-600">
```

### **4. Using Loops**
```tsx
// ❌ WRONG
{items.map(item => <Text>{item.text}</Text>)}

// ✅ CORRECT
<Text>First item with complete content...</Text>
<Text>Second item with complete content...</Text>
<Text>Third item with complete content...</Text>
```

---

## 📋 Pattern Checklist Template

When creating a new pattern, verify:

```
Pattern Name: ___________________________
Category: ________________________________

✅ Content
- [ ] All text is static (no {variables})
- [ ] No .map() or array iterations
- [ ] Meaningful, production-ready content
- [ ] 2-3 complete sections/articles written out
- [ ] Realistic example data

✅ Styling
- [ ] No hover:, focus:, dark: classes
- [ ] Uses Tailwind email-safe classes only
- [ ] Has tailwindConfig import
- [ ] Proper color contrast (WCAG compliant)

✅ Structure
- [ ] Has Html, Head, Tailwind, Body, Container
- [ ] Has Preview text
- [ ] Proper component hierarchy
- [ ] Mobile-responsive utilities

✅ Props
- [ ] Minimal props (URLs/names only)
- [ ] All props have meaningful defaults
- [ ] No array or object props for content
- [ ] Props interface clearly documented

✅ Metadata
- [ ] JSDoc comment with PATTERN, USE CASE, TAGS
- [ ] Tags are descriptive and searchable
- [ ] Use case is clear and specific

✅ Testing
- [ ] Renders without errors
- [ ] Visual editor can select all elements
- [ ] All text is editable
- [ ] No console warnings
```

---

## 🎨 Visual Editor Compatibility

### **Why Static Content Matters:**

The visual editor allows users to click and edit elements directly. For this to work:

1. **Text must be static** - Editor extracts actual text from TSX
2. **No variables** - Can't edit `{variable}`, only `"actual text"`
3. **No loops** - Each element needs a unique location in TSX
4. **Direct mapping** - Click on element → Find exact TSX code → Edit it

### **Testing Visual Editability:**

After creating a pattern:
1. Generate a campaign using it
2. Open in visual editor
3. Click on text elements
4. Verify text appears in properties panel
5. Verify edits apply instantly

If you see `{variable}` in the edit box → Pattern needs to be fixed.

---

## 🌟 Example: Perfect Pattern

```tsx
/**
 * PATTERN: Product Launch Newsletter
 * USE CASE: Announce new product with rich description, features, and compelling CTA
 * TAGS: product, launch, announcement, features, benefits, newsletter, marketing
 */

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Img,
  Link,
  Preview,
  Tailwind,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface ProductLaunchProps {
  productName?: string;
  companyName?: string;
  ctaUrl?: string;
}

export default function ProductLaunchNewsletter({
  productName = 'SuperApp Pro',
  companyName = 'Acme Corp',
  ctaUrl = 'https://example.com/superapp-pro',
}: ProductLaunchProps) {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-gray-50 font-sans">
          <Preview>Introducing {productName} - Transform your workflow today</Preview>
          
          <Container className="max-w-xl mx-auto my-8 bg-white rounded-lg shadow">
            {/* Header */}
            <Section className="bg-blue-600 text-white p-8 text-center rounded-t-lg">
              <Heading className="text-3xl font-bold mb-3">
                Introducing {productName}
              </Heading>
              <Text className="text-lg text-blue-100">
                The productivity tool you've been waiting for
              </Text>
            </Section>

            {/* Hero Image */}
            <Section className="p-0">
              <Img 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600" 
                alt="Product Dashboard"
                className="w-full"
              />
            </Section>

            {/* Main Content */}
            <Section className="p-8">
              <Text className="text-gray-700 text-base leading-relaxed mb-4">
                After months of development and feedback from thousands of users, we're thrilled to announce {productName} - a revolutionary approach to managing your daily workflow.
              </Text>
              <Text className="text-gray-700 text-base leading-relaxed mb-6">
                Whether you're a solo entrepreneur or part of a large team, {productName} adapts to your needs with intelligent automation, seamless integrations, and a beautiful interface you'll love using every day.
              </Text>
            </Section>

            {/* Features */}
            <Section className="px-8 pb-8">
              <Heading className="text-2xl font-bold text-gray-900 mb-4">
                What's New
              </Heading>
              
              <Section className="mb-4">
                <Heading className="text-lg font-semibold text-gray-800 mb-2">
                  ⚡ Lightning-Fast Performance
                </Heading>
                <Text className="text-gray-600 text-sm leading-relaxed">
                  Experience blazing speeds with our optimized engine. Complete tasks in half the time and never wait for loading screens again.
                </Text>
              </Section>
              
              <Section className="mb-4">
                <Heading className="text-lg font-semibold text-gray-800 mb-2">
                  🎨 Beautiful New Interface
                </Heading>
                <Text className="text-gray-600 text-sm leading-relaxed">
                  A completely redesigned interface that's both powerful and intuitive. Every pixel crafted for productivity and delight.
                </Text>
              </Section>
              
              <Section className="mb-4">
                <Heading className="text-lg font-semibold text-gray-800 mb-2">
                  🔗 Seamless Integrations
                </Heading>
                <Text className="text-gray-600 text-sm leading-relaxed">
                  Connect with your favorite tools and services. From Slack to Google Drive, everything works together perfectly.
                </Text>
              </Section>
            </Section>

            {/* CTA */}
            <Section className="px-8 pb-8 text-center">
              <Button 
                href={ctaUrl}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold"
              >
                Try {productName} Free
              </Button>
              <Text className="text-sm text-gray-500 mt-3">
                No credit card required • 14-day free trial
              </Text>
            </Section>

            {/* Footer */}
            <Section className="px-8 py-6 bg-gray-50 border-t border-gray-200 text-center rounded-b-lg">
              <Text className="text-xs text-gray-600 mb-2">
                © 2025 {companyName}. All rights reserved.
              </Text>
              <Text className="text-xs text-gray-500">
                <Link href="#" className="text-gray-500 underline">Unsubscribe</Link>
                {' • '}
                <Link href="#" className="text-gray-500 underline">Preferences</Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
```

**Why this is perfect:**
- ✅ Complete, meaningful content (not lorem ipsum)
- ✅ 3 features written out individually (not in a loop)
- ✅ Only 3 props (productName, companyName, ctaUrl)
- ✅ No `hover:` classes
- ✅ Proper structure and hierarchy
- ✅ Ready to use as-is or as AI inspiration

---

## 🔄 Pattern Lifecycle

### **1. Creation**
- Write based on common use case
- Follow all guidelines above
- Test rendering

### **2. Validation**
- Run through checklist
- Test in visual editor
- Verify RAG embedding generation

### **3. Maintenance**
- Update if Tailwind classes change
- Improve content based on user feedback
- Remove if not being used by AI

---

## 📚 Resources

- [React Email Components](https://react.email/docs/components/html)
- [Tailwind CSS Email-Safe Classes](https://tailwindcss.com/docs)
- [Email Client CSS Support](https://www.caniemail.com/)

---

## ✨ Remember

**Good patterns = Good AI output**

The AI learns directly from your patterns. High-quality, static, complete patterns result in high-quality, editable, production-ready generated emails.

**Think:** "Would I send this email as-is to my users?"

If yes → It's a good pattern! 🎯


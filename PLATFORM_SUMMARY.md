# Joltibase Platform - Comprehensive Summary

## Overview

**Joltibase** is an AI-powered email campaign builder that enables users to create professional email campaigns through natural language prompts. The platform uses a semantic block-based architecture with real-time visual editing capabilities, powered by Google's Gemini 2.5 Flash AI model (33x cheaper than GPT-4o).

---

## Core Architecture

### Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **AI Provider:** Gemini 2.5 Flash (primary), GPT-4o (fallback)
- **Caching:** Redis (Upstash) for rate limiting
- **Email Rendering:** React Email (`@react-email/render`)
- **UI Components:** Radix UI, Tailwind CSS
- **State Management:** React Query, Zustand

### System Layers

```
┌─────────────────────────────────────────────────────────┐
│              Next.js App Router (Frontend)              │
│  • Campaign Editor  • Email Preview  • Visual Editor   │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────────┐
│                    API Layer                              │
│  • /api/ai/generate-campaign  • /api/campaigns/*         │
│  • /api/ai/refine-campaign    • /api/contacts/*          │
│  • /api/ai/refine-component   • /api/analytics/*         │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────────┐
│                  Core Systems                             │
│  • Email V2 System (lib/email-v2/)                      │
│  • AI Generation (lib/ai/)                               │
│  • Visual Edits (lib/email/visual-edits/)                │
│  • Composition Engine (lib/email/composition/)           │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────────┐
│              External Services                            │
│  • Supabase (Auth + Database)                            │
│  • Gemini AI (Email Generation)                          │
│  • Redis (Rate Limiting)                                │
│  • Unsplash (Image Fetching)                            │
│  • Resend (Email Sending)                               │
└──────────────────────────────────────────────────────────┘
```

---

## Email Generation System (V2)

### Two-Pass Generation Process

The platform uses a sophisticated two-pass AI generation system:

#### **Pass 1: Structure Generation**
- **Purpose:** Generate email structure (block types and order)
- **Model:** Gemini 2.5 Flash
- **Output:** Array of block structures with:
  - Block type (hero, features, cta, etc.)
  - Purpose/description (max 150 chars)
  - Position in email
- **Token Budget:** ~1,200 tokens
- **Time:** ~2-3 seconds

#### **Pass 2: Content Generation**
- **Purpose:** Generate detailed content for each block
- **Model:** Gemini 2.5 Flash
- **Process:** Blocks generated **in parallel** for speed
- **Output:** Complete semantic blocks with:
  - Headlines, subheadlines, descriptions
  - Image keywords (for Unsplash fetching)
  - CTA text and URLs
  - Styling preferences
- **Token Budget:** ~1,200 tokens per block
- **Time:** ~5-8 seconds total (parallel)

### Semantic Block Types

The platform supports **11 base block types**:

1. **hero** - Hero sections with headline, image, CTA
2. **features** - Feature lists/grids (5 variants)
3. **cta** - Call-to-action sections
4. **list** - Bulleted/numbered lists
5. **heading** - Standalone headings
6. **text** - Paragraph blocks
7. **testimonial** - Customer testimonials
8. **gallery** - Image galleries (4 variants)
9. **stats** - Statistics displays
10. **pricing** - Pricing tables
11. **footer** - Email footers (legal, unsubscribe)

### Generation Workflow

```
User Prompt
    ↓
Prompt Intelligence Analysis
    • Detect email type (marketing/transactional/newsletter)
    • Extract color preferences
    • Detect tone (formal/casual)
    • Parse structure hints
    ↓
Two-Pass AI Generation
    ↓
Image Fetching (Unsplash)
    • Extract image keywords from blocks
    • Fetch matching images
    • Replace keywords with URLs
    ↓
Transform to React Email Components
    • Convert semantic blocks → EmailComponent tree
    • Apply global settings (colors, fonts)
    • Inject data-component-id for visual editing
    ↓
Render to HTML
    • Use @react-email/render
    • Add viewport meta tag
    • Inject mobile-responsive CSS
    ↓
Save to Database
    • Store semantic blocks (JSON)
    • Store root_component (JSON)
    • Store html_content (string)
```

---

## Visual Editing System

### Component-Based Architecture

The visual editor uses a **React Email component tree** structure:

```typescript
EmailComponent {
  id: string;              // Unique identifier
  component: ComponentType; // 'Heading', 'Text', 'Button', etc.
  props: Record<string, any>; // Styling props
  content?: string;        // Text content
  children?: EmailComponent[]; // Nested components
}
```

### Visual Edit Mode Flow

1. **Enter Visual Edit Mode**
   - Load `rootComponent` from database (or generate from `semanticBlocks`)
   - Render component tree in iframe
   - Inject `data-component-id` attributes for matching

2. **Component Selection**
   - User clicks element in iframe
   - JavaScript finds element via `data-component-id`
   - Sends component ID and bounds to parent
   - Parent looks up component in registry (O(1) lookup)

3. **Editing**
   - Floating toolbar appears with:
     - AI input field
     - Content edit button
     - Styles edit button
     - Spacing edit button
     - Delete button
   - Panels appear below toolbar for manual edits
   - Changes tracked in `rootComponent` state

4. **Exit Visual Edit Mode**
   - Components cleared from memory
   - Changes lost (no auto-save)

### Component Registry

For performance, components are stored in a `Map<string, EmailComponent>`:
- **O(1) lookups** instead of tree traversal
- Rebuilt whenever `rootComponent` changes
- Used for finding components by ID

---

## AI System

### Provider Strategy

**Primary: Gemini 2.5 Flash**
- **Cost:** $0.075/$0.40 per 1M tokens (input/output)
- **Speed:** 2-4x faster than GPT-4o
- **Native Zod Support:** Direct schema validation
- **Optimized:** For email generation tasks

**Fallback: GPT-4o**
- **Cost:** $2.50/$10.00 per 1M tokens
- **Quality:** Higher reasoning capability
- **Usage:** Only if Gemini fails

### Prompt Engineering

**System Prompts:**
- **Structure Generation:** ~400 tokens (minimal, focused)
- **Content Generation:** ~1,400 tokens (detailed design system)

**Key Features:**
- Design system rules (spacing, typography, colors)
- Composition standards (contrast, touch targets)
- Block-specific requirements (e.g., "headline: 8-15 words")
- Token optimization (condensed prompts)

### Token Optimization

Recent optimizations reduced token usage from ~17,000 to ~12,000:
- Condensed system prompts
- Removed redundant context
- Dynamic token budgets per pass
- Stricter retry logic (don't increase tokens, enforce constraints)

---

## Data Models

### Campaign

```typescript
Campaign {
  id: UUID;
  user_id: UUID;
  name: string;
  campaign_type: 'one-time' | 'sequence' | 'newsletter';
  
  // Email Content (V2)
  semantic_blocks: JSON;        // Array of SemanticBlock
  root_component: JSON;         // EmailComponent tree
  html_content: TEXT;            // Rendered HTML
  
  // Metadata
  subject_line: string;
  preview_text: string;
  primary_color: string;
  font_family: string;
  background_color: string;
  
  // Status
  status: 'draft' | 'scheduled' | 'sent';
  created_at: timestamp;
  updated_at: timestamp;
}
```

### Contact

```typescript
Contact {
  id: UUID;
  user_id: UUID;
  email: string;
  first_name?: string;
  last_name?: string;
  metadata: JSON;              // Custom fields
  tags: string[];
  status: 'active' | 'unsubscribed' | 'bounced';
  created_at: timestamp;
}
```

---

## API Endpoints

### Campaign Generation

**POST `/api/ai/generate-campaign`**
- Generates complete email campaign from prompt
- Returns: `semantic_blocks`, `root_component`, `html_content`
- Rate limited per user

**POST `/api/ai/refine-campaign`**
- Refines entire campaign based on user feedback
- Updates all blocks in parallel
- Returns: Updated `semantic_blocks`

**POST `/api/ai/refine-component`**
- Refines single component (e.g., hero headline)
- Uses component-specific prompts
- Returns: Updated `root_component`

### Campaign Management

**GET `/api/campaigns`** - List user's campaigns
**GET `/api/campaigns/[id]`** - Get campaign details
**PUT `/api/campaigns/[id]`** - Update campaign
**POST `/api/campaigns/[id]/send`** - Send campaign
**POST `/api/campaigns/[id]/queue`** - Queue for sending

### Contacts

**GET `/api/contacts`** - List contacts
**POST `/api/contacts`** - Create contact
**POST `/api/contacts/import`** - Bulk import (CSV)
**PUT `/api/contacts/[id]`** - Update contact

### Analytics

**GET `/api/analytics/overview`** - Dashboard metrics
**GET `/api/analytics/campaigns`** - Campaign performance
**GET `/api/analytics/contacts`** - Contact analytics
**GET `/api/analytics/realtime`** - Real-time activity

---

## User Workflows

### 1. Create Campaign

```
1. User navigates to /dashboard/campaigns/generate
2. Enters prompt: "Create a welcome email for new SaaS users"
3. Clicks "Generate"
4. System:
   - Analyzes prompt (detects email type, tone, colors)
   - Generates semantic blocks (two-pass)
   - Fetches images from Unsplash
   - Transforms to React Email components
   - Renders to HTML
   - Saves to database
5. User sees preview with chat interface
```

### 2. Edit Campaign (Visual Mode)

```
1. User clicks "Visual Edit" button
2. System loads rootComponent into iframe
3. User clicks element (e.g., headline)
4. Floating toolbar appears:
   - AI input: "Make it more exciting"
   - Content button: Edit text directly
   - Styles button: Change color, font size
   - Spacing button: Adjust padding/margin
5. User makes changes
6. Changes reflected immediately in preview
7. User exits visual edit mode
8. Changes cleared (no auto-save currently)
```

### 3. Refine Campaign (Chat)

```
1. User types in chat: "Make the CTA more urgent"
2. System:
   - Identifies CTA blocks
   - Calls /api/ai/refine-campaign
   - Updates semantic blocks
   - Re-renders HTML
3. User sees updated preview
```

### 4. Send Campaign

```
1. User clicks "Send" button
2. System:
   - Validates campaign (subject, content)
   - Gets contact list
   - Queues emails via Resend API
   - Updates campaign status to "sent"
3. Emails sent asynchronously
4. Analytics tracked in real-time
```

---

## Key Features

### 1. Prompt Intelligence

The system analyzes user prompts to extract:
- **Email Type:** Marketing, transactional, newsletter
- **Tone:** Formal, casual, friendly
- **Color Preferences:** Extracted from prompt
- **Structure Hints:** Detects desired layout
- **Content Type:** Press release, product launch, etc.

### 2. Image Fetching

- Extracts image keywords from semantic blocks
- Fetches matching images from Unsplash
- Replaces keywords with actual image URLs
- Adds Unsplash credits to footer

### 3. Color Consistency

- Enforces brand colors across email
- Ensures contrast ratios
- Applies primary color to CTAs/buttons
- Preserves neutral backgrounds

### 4. Mobile Responsiveness

- Fixed 600px width (email standard)
- Viewport meta tag: `width=600`
- CSS prevents text scaling on mobile
- Uses "shrink" approach (viewport scaling)

### 5. Rate Limiting

- Redis-based rate limiting
- Per-user limits
- Prevents abuse
- Returns 429 status when exceeded

---

## Performance Optimizations

### 1. Component Registry
- O(1) component lookups instead of tree traversal
- Built once per `rootComponent` change

### 2. Parallel Block Generation
- Pass 2 generates blocks in parallel
- Reduces total generation time

### 3. Lazy Loading
- Components loaded on-demand
- Transform functions imported dynamically

### 4. Memoization
- React `useMemo` for expensive computations
- Prevents unnecessary re-renders

### 5. Token Optimization
- Condensed prompts
- Dynamic token budgets
- Stricter retry logic

---

## Security

### Authentication
- Supabase Auth (JWT tokens)
- Server-side session validation
- Row-level security (RLS) in database

### Authorization
- Campaign ownership verification
- User-scoped queries
- API route authentication checks

### Rate Limiting
- Redis-based rate limiting
- Per-user limits
- Prevents API abuse

---

## Database Schema

### Core Tables

**campaigns**
- Stores email campaigns
- JSON columns for `semantic_blocks`, `root_component`
- TEXT column for `html_content`

**contacts**
- Email contacts
- JSON `metadata` for custom fields
- Array `tags` for categorization

**lists**
- Contact lists
- Many-to-many with contacts

**ai_generations** (usage tracking)
- Tracks AI usage per user
- Token counts, costs
- Model used

---

## Development Workflow

### Adding New Block Type

1. **Define Schema** (`lib/email-v2/ai/blocks.ts`)
   - Add to `SemanticBlock` union type
   - Create Zod schema

2. **Create Transform Function** (`lib/email-v2/ai/transforms.tsx`)
   - `createXSection()` function
   - Converts semantic block → EmailComponent

3. **Add to Prompts** (`lib/email-v2/ai/prompts-v2.ts`)
   - Update system prompt
   - Add block-specific requirements

4. **Test**
   - Generate email with new block type
   - Verify rendering
   - Test visual editing

### Adding New Layout Variation

1. **Create Config** (`lib/email/blocks/configs/[layout].ts`)
   - Define structure (elements)
   - Define settings controls
   - Set defaults

2. **Factory Generates**
   - Renderer function
   - Settings component

3. **Register** (`lib/email/blocks/renderers/layout-factory.ts`)
   - Add to config imports
   - Factory handles rest

---

## Current Limitations

1. **No Auto-Save in Visual Edit**
   - Changes lost when exiting visual edit mode
   - No discard/save buttons (recently removed)

2. **No Undo/Redo**
   - No history tracking
   - Changes are immediate

3. **Limited Collaboration**
   - Single-user editing
   - No real-time collaboration

4. **No Template System**
   - Can't save custom templates
   - No template marketplace

---

## Future Enhancements

### Planned Features

1. **Auto-Save**
   - Save changes automatically
   - Discard/save buttons on exit

2. **History System**
   - Undo/redo support
   - Version history

3. **Templates**
   - Save custom layouts
   - Template marketplace

4. **Collaboration**
   - Real-time editing
   - Comments on elements

5. **AI Improvements**
   - A/B test variations
   - Style transfer
   - Prompt playground

---

## File Structure

```
joltibase-platform/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── ai/                   # AI endpoints
│   │   ├── campaigns/            # Campaign CRUD
│   │   ├── contacts/             # Contact management
│   │   └── analytics/            # Analytics endpoints
│   ├── dashboard/                # Dashboard pages
│   └── campaigns/                # Campaign pages
├── components/                   # React components
│   ├── campaigns/                # Campaign UI
│   ├── email-editor/             # Email editor
│   └── analytics/                # Analytics charts
├── lib/                          # Core libraries
│   ├── email-v2/                 # V2 email system
│   │   ├── ai/                   # AI generation
│   │   ├── patterns/             # Block patterns
│   │   └── templates/            # HTML templates
│   ├── ai/                       # AI client/utilities
│   └── email/                    # Legacy email system
├── hooks/                        # React hooks
├── docs/                         # Documentation
└── migrations/                   # Database migrations
```

---

## Key Metrics

- **Generation Time:** 7-12 seconds (two-pass)
- **Token Usage:** ~12,000 tokens per campaign
- **Cost per Campaign:** ~$0.001-0.002 (Gemini 2.5 Flash)
- **Visual Edit Performance:** <100ms component lookups
- **Block Types:** 11 base types, 50+ layout variations

---

## Conclusion

Joltibase is a sophisticated AI-powered email campaign builder that combines:
- **Semantic block-based generation** for structured emails
- **Visual editing** for intuitive modifications
- **AI refinement** for iterative improvements
- **Cost-effective AI** (Gemini 2.5 Flash)
- **Modern tech stack** (Next.js, React Email, TypeScript)

The platform is designed for scalability, performance, and developer productivity, with a clear architecture that makes it easy to extend and maintain.

---

**Last Updated:** December 2024  
**Platform Version:** 2.0



/**
 * EVENT & CONFERENCE EMAIL DESIGN SYSTEM
 * 
 * Complete specification for generating high-impact event emails.
 * Optimized for: Event promotions, conference invitations, webinars, ticket sales
 * 
 * Target Audience: Event attendees, conference goers, webinar participants
 * Goal: Drive registrations, ticket sales, event attendance
 */

export const EventDesignSystem = {
  // ============================================================================
  // METADATA
  // ============================================================================
  
  id: 'event-conference',
  name: 'Event & Conference',
  description: 'Bold, visual design for event promotions and conference invitations',
  
  /**
   * Detection triggers - keywords that indicate this design system should be used
   */
  triggers: [
    // Event types
    'event', 'conference', 'summit', 'webinar', 'workshop', 'meetup',
    'seminar', 'symposium', 'forum', 'convention', 'expo', 'festival',
    
    // Event actions
    'register', 'RSVP', 'tickets', 'attend', 'join us', 'save the date',
    'registration', 'attendance', 'participant', 'attendee',
    
    // Event timing
    'upcoming', 'happening soon', 'this week', 'next month',
    'live event', 'virtual event', 'hybrid event', 'in-person',
    
    // Event specifics
    'speaker', 'session', 'agenda', 'schedule', 'keynote', 'talk',
    'panel', 'presentation', 'networking', 'venue', 'location',
    
    // Ticket types
    'early bird', 'ticket price', 'admission', 'free event', 'VIP pass',
    'general admission', 'student ticket', 'group discount',
    
    // Event formats
    'online event', 'zoom', 'livestream', 'broadcast', 'virtual conference',
    'in-person event', 'hybrid format'
  ],
  
  /**
   * Image keywords for this design system
   * Used to fetch contextually appropriate, aesthetically consistent images
   */
  imageKeywords: {
    hero: ['conference', 'event', 'networking'],
    feature: ['speaker', 'presentation', 'seminar'],
    product: ['venue', 'stage', 'audience'],
    background: ['abstract', 'celebration', 'gathering'],
  },
  
  // ============================================================================
  // COMPLETE DESIGN SYSTEM SPECIFICATION
  // ============================================================================
  
  system: `
# EVENT & CONFERENCE EMAIL DESIGN SYSTEM

## 🎯 DESIGN PHILOSOPHY

**Core Principle**: Create excitement and urgency. Make date/time impossible to miss. Showcase value through speakers and agenda.

This design system prioritizes:
- **Visual Impact**: Bold headers, large event branding, eye-catching imagery
- **Critical Info Prominence**: Date, time, location front and center
- **Social Proof**: Speaker photos, attendee count, past event success
- **Clear Path to Action**: Register/RSVP/Buy Tickets buttons unmissable

**Target Audience**: Busy professionals, event attendees, conference-goers

**Goal**: Maximize registrations, drive ticket sales, fill seats

---

## 📐 TYPOGRAPHY SYSTEM

### Hierarchy & Sizing

\`\`\`
H1 (Event Name - MAXIMUM IMPACT)
├─ Size: 44-52px (LARGE!)
├─ Weight: 800 (extra bold)
├─ Line Height: 1.1 (tight)
├─ Color: #111827 OR event brand color
├─ Text Transform: Optional UPPERCASE for impact
├─ Margin: 0 0 16px 0
└─ Usage: Event title, conference name

Event Date/Time (CRITICAL VISIBILITY)
├─ Size: 32-36px
├─ Weight: 700
├─ Line Height: 1.2
├─ Color: Event accent color (often red, purple, blue)
├─ Background: Optional highlight box
├─ Margin: 0 0 24px 0
└─ Usage: "March 15-17, 2025" or "Tuesday, Jan 10 at 2PM EST"

H2 (Section Headers - Speakers, Agenda, Tickets)
├─ Size: 28-32px
├─ Weight: 700
├─ Line Height: 1.3
├─ Color: #1f2937
├─ Margin: 32px 0 16px 0
└─ Usage: "Featured Speakers", "Event Schedule", "Ticket Options"

H3 (Speaker Names, Session Titles)
├─ Size: 20-22px
├─ Weight: 600
├─ Line Height: 1.4
├─ Color: #374151
├─ Margin: 12px 0 8px 0
└─ Usage: Speaker names, session titles, venue details

Body Large (Event Description)
├─ Size: 18px
├─ Weight: 400
├─ Line Height: 1.6
├─ Color: #4b5563
├─ Margin: 0 0 16px 0
└─ Usage: Event overview, what to expect

Body Regular
├─ Size: 16px
├─ Weight: 400
├─ Line Height: 1.7
├─ Color: #6b7280
├─ Margin: 0 0 16px 0
└─ Usage: Descriptions, details, logistics

Caption (Time, Location Details)
├─ Size: 14px
├─ Weight: 500
├─ Color: #6b7280
└─ Usage: Speaker titles, session durations, room numbers
\`\`\`

### Font Stack

**Primary**: 
\`\`\`css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
\`\`\`

**For Impact Headlines** (Optional):
\`\`\`css
font-family: 'Arial Black', 'Helvetica Bold', sans-serif;
font-weight: 900;
\`\`\`

### Typography Rules

1. **Event name HUGE**: Biggest text element in email
2. **Date/time PROMINENT**: Second-largest, often in color box
3. **Location clear**: Always visible with date/time
4. **Speaker names bold**: 600+ weight, easily scannable
5. **Time formats consistent**: "2:00 PM EST" or "14:00 CET"
6. **Uppercase sparingly**: Event name or section headers only

---

## 🎨 COLOR SYSTEM

### Primary Palette

\`\`\`
Event Brand Colors (Bold & Energetic)
├─ Primary: Customizable per event (e.g., #e11d48 for TechConf)
├─ Primary Dark: Darker shade for hover/emphasis
├─ Primary Light: Lighter tint for backgrounds
└─ Usage: Event name, CTAs, date/time highlights, accents

Secondary/Accent
├─ Accent: Complementary color (e.g., #7c3aed purple with red primary)
├─ Gold/Premium: #f59e0b (for VIP, premium tickets)
└─ Usage: Secondary CTAs, badges, special callouts

Neutral Foundation
├─ Text Dark: #111827 (headlines)
├─ Text Medium: #4b5563 (body)
├─ Text Light: #6b7280 (captions)
├─ Border: #e5e7eb (dividers, cards)
├─ Background: #ffffff (main)
├─ Background Alt: #f9fafb (sections)
├─ Background Dark: #1f2937 (optional dark header)
\`\`\`

### Event-Specific Color Applications

**Date/Time Highlight Box**:
\`\`\`css
background-color: #e11d48; /* Event primary */
color: #ffffff;
padding: 16px 24px;
border-radius: 8px;
font-weight: 700;
\`\`\`

**Early Bird / Limited Tickets**:
\`\`\`css
/* Urgency orange/red */
background-color: #ea580c;
color: #ffffff;
\`\`\`

**VIP / Premium Tier**:
\`\`\`css
/* Gold accent */
background-color: #f59e0b;
color: #1f2937;
\`\`\`

### Color Rules

1. **Bold event brand color**: Used liberally (CTAs, headers, accents)
2. **High contrast essential**: Event details must stand out
3. **Color coding**: Different ticket tiers, session tracks
4. **Dark backgrounds OK**: For header sections with white text
5. **Consistent throughout**: Same brand color in all CTAs

---

## 📏 SPACING SYSTEM

**Base Unit**: 8px

### Spacing Scale

\`\`\`
Event Header Spacing
├─ Header section: 48px vertical padding
├─ Event name to date: 24px
├─ Date to location: 16px
├─ Location to CTA: 32px

Speaker Section Spacing
├─ Section title to first speaker: 24px
├─ Between speakers: 32px
├─ Speaker image to name: 12px
├─ Name to title: 4px

Agenda Spacing
├─ Between time slots: 24px
├─ Time to session title: 8px
├─ Session to speaker: 8px

Ticket Tier Spacing
├─ Between tiers: 16px
├─ Tier padding: 24px internal
├─ Price to features: 16px
\`\`\`

### Event-Specific Spacing

**Hero Section**:
- Large top/bottom padding (64px+)
- Dramatic spacing around event name
- Ample whitespace for impact

**Speaker Grid**:
- Consistent gaps (16px between columns)
- Uniform padding in speaker cards

---

## 🔘 CTA (CALL-TO-ACTION) DESIGN

### Primary CTA - Registration/Tickets

**Visual Specifications**:
\`\`\`css
/* MAXIMUM PROMINENCE */
background-color: #e11d48; /* Event brand color */
color: #ffffff;
font-size: 20px; /* LARGE for events */
font-weight: 700;
text-transform: uppercase;
letter-spacing: 1px;
padding: 18px 56px; /* Extra generous */
border-radius: 8px;
box-shadow: 0 6px 12px rgba(225, 29, 72, 0.3); /* Brand color shadow */
text-decoration: none;
display: inline-block;
\`\`\`

**CTA Text Examples**:
- **Registration**: "REGISTER NOW", "RESERVE YOUR SPOT", "SIGN UP TODAY"
- **Tickets**: "BUY TICKETS", "GET YOUR PASS", "SECURE YOUR SEAT"
- **Webinar**: "REGISTER FOR WEBINAR", "SAVE MY SPOT"
- **Early Bird**: "GET EARLY BIRD PRICING", "CLAIM DISCOUNT"
- **RSVP**: "RSVP NOW", "CONFIRM ATTENDANCE"

### Secondary CTA (Learn More / Agenda)

\`\`\`css
background-color: transparent;
color: #e11d48; /* Event brand */
font-size: 16px;
font-weight: 600;
padding: 14px 32px;
border: 2px solid #e11d48;
border-radius: 8px;
text-decoration: none;
\`\`\`

**CTA Text**: "View Full Agenda", "See All Speakers", "Learn More"

### CTA RULES

1. **One huge primary CTA**: After event details
2. **Repeat CTA**: After speakers, after agenda
3. **Ticket CTAs on each tier**: "Buy Now" buttons
4. **Color matches event brand**: Consistent throughout
5. **Urgency when relevant**: "Early bird ends in 3 days"
6. **Action-oriented text**: "Register" > "Learn more"

---

## 🖼️ IMAGE GUIDELINES

### Event Hero Images

**Specifications**:
- **Aspect Ratio**: 16:9 or 2:1 (wide, cinematic)
- **Dimensions**: 1200×675px (16:9) or 1200×600px (2:1)
- **Content**: Event branding, venue photos, past event energy
- **Style**: Bold, high-energy, professional

**Content Guidelines**:
- Event logo/branding prominent
- Venue photos (if in-person)
- Past event crowd shots (shows scale)
- Speaker montage
- Abstract brand graphics

### Speaker Photos

**Specifications**:
- **Shape**: Circular (most common) or square
- **Dimensions**: 200×200px minimum (400×400px for retina)
- **Background**: Consistent (all white, all transparent, all colored)
- **Style**: Professional headshots

**Requirements**:
- All same size and shape
- High quality, well-lit
- Consistent framing
- Diverse representation

### Image Accessibility

**Alt Text for Event Images**:
- Describe venue + event name
- Example: "Grand Ballroom at NYC Convention Center, TechConf 2025 venue"
- Example: "Sarah Johnson, CEO of InnovateCo, keynote speaker"

**Alt Text for Speaker Photos**:
- Include name + title + company
- Example: "Dr. Michael Chen, Director of AI Research at Stanford University"

---

## ♿ ACCESSIBILITY REQUIREMENTS

**Standard WCAG AA compliance** plus event-specific considerations:

### Speaker Photo Alt Text

Must include:
- Full name
- Title/role
- Company/organization
- Example: "Dr. Michael Rodriguez, Director of Innovation at Tesla, keynote speaker at TechConf 2025"

### Date/Time Clarity

\`\`\`tsx
// Include timezone, be explicit
<Text>March 15, 2025 at 2:00 PM EST</Text>

// Not ambiguous
<Text>3/15 at 2PM</Text> ❌
\`\`\`

### Virtual Event Links

\`\`\`tsx
// Clear link purpose
<Link href="/join-webinar">Join Webinar on Zoom</Link>

// Not vague
<Link href="/join">Click to join</Link> ❌
\`\`\`

---

## 📝 GENERATION GUIDELINES

### Email Types & Structure

**1. Event Announcement**:
\`\`\`
Event name (huge, bold)
↓
Date/Time/Location (highlighted box)
↓
Brief description (what to expect)
↓
Featured speakers (photos + names)
↓
"Register now" CTA
↓
Early bird deadline (if applicable)
\`\`\`

**2. Speaker Lineup Email**:
\`\`\`
"Meet our speakers" headline
↓
Speaker grid (3-4 featured)
  - Photo
  - Name
  - Title/Company
  - Session topic
↓
"View full lineup" link
↓
"Get tickets" CTA
\`\`\`

**3. Agenda Announcement**:
\`\`\`
"Full schedule released" headline
↓
Day-by-day agenda
  - Time slots
  - Session titles
  - Speakers
  - Locations
↓
"Download PDF schedule" link
↓
"Register" CTA
\`\`\`

**4. Last Chance / Urgency**:
\`\`\`
Urgency header (red banner)
↓
"Registration closes in 48 hours"
↓
Event highlights recap
↓
Ticket tiers (with prices)
↓
"Register before it's too late" CTA
\`\`\`

### Generation Checklist

- [ ] Event name is largest text element
- [ ] Date/time/location in highlighted box
- [ ] Speaker photos are consistent size/shape
- [ ] All times include timezone
- [ ] Venue/location address provided
- [ ] Primary CTA appears 2-3 times
- [ ] Urgency indicators if applicable
- [ ] Social proof (attendee count, past success)
- [ ] Mobile-friendly (stacks properly)

---

## 🔧 REACT EMAIL REQUIREMENTS

### CRITICAL RULES

1. **NEVER use className** - All styling MUST be inline via style prop
2. **NO Tailwind utility classes** - Use inline styles only
3. **Email-safe properties only** - Avoid flexbox, grid, CSS variables
4. **Table-based layouts** - Use Section, Row, Column for structure

### Required Imports

\`\`\`tsx
import {
  Section,
  Img,
  Heading,
  Text,
  Button,
  Link,
  Row,
  Column
} from '@react-email/components';
\`\`\`

### Complete Template

See example email below for full implementation.
`,

  // ============================================================================
  // COMPLETE REFERENCE EXAMPLE
  // ============================================================================

  exampleEmail: `import {
  Section,
  Img,
  Heading,
  Text,
  Button,
  Link
} from '@react-email/components';

/**
 * Event Conference Email
 * Use Case: Tech conference announcement with speaker lineup and ticket sales
 */
export default function TechConferenceEmail() {
  return (
    <>
      {/* Hero Section - Dark Background */}
      <Section style={{
        padding: '64px 24px',
        textAlign: 'center',
        backgroundColor: '#1f2937',
        color: '#ffffff'
      }}>
        {/* Event Logo */}
        <Img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120&h=60&fit=crop"
          alt="TechConf 2025 Logo"
          style={{
            height: '60px',
            marginBottom: '32px'
          }}
        />
        
        {/* Event Name */}
        <Heading style={{
          fontSize: '52px',
          fontWeight: '800',
          color: '#ffffff',
          lineHeight: '1.1',
          margin: '0 0 16px 0',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          TechConf 2025
        </Heading>
        
        {/* Tagline */}
        <Text style={{
          fontSize: '22px',
          color: '#d1d5db',
          fontWeight: '500',
          margin: '0 0 40px 0'
        }}>
          The Future of Technology, Today
        </Text>
        
        {/* Date/Time/Location Highlight Box */}
        <div style={{
          backgroundColor: '#e11d48',
          color: '#ffffff',
          padding: '28px 32px',
          borderRadius: '12px',
          marginBottom: '32px',
          display: 'inline-block',
          boxShadow: '0 8px 16px rgba(225, 29, 72, 0.3)'
        }}>
          <Text style={{
            fontSize: '36px',
            fontWeight: '700',
            margin: '0 0 12px 0',
            lineHeight: '1.2'
          }}>
            📅 March 15-17, 2025
          </Text>
          <Text style={{
            fontSize: '20px',
            fontWeight: '500',
            margin: '0 0 8px 0'
          }}>
            ⏰ 9:00 AM - 6:00 PM EST Daily
          </Text>
          <Text style={{
            fontSize: '20px',
            fontWeight: '500',
            margin: 0
          }}>
            📍 Jacob Javits Center, New York City
          </Text>
        </div>
        
        {/* Event Description */}
        <Text style={{
          fontSize: '18px',
          color: '#e5e7eb',
          lineHeight: '1.6',
          margin: '0 0 32px 0',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Join 2,500+ tech leaders, innovators, and developers for three days of
          groundbreaking talks, hands-on workshops, and unparalleled networking.
        </Text>
        
        {/* Primary CTA */}
        <Button
          href="https://example.com/register"
          style={{
            backgroundColor: '#e11d48',
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            padding: '20px 60px',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 6px 12px rgba(225, 29, 72, 0.5)',
            marginBottom: '20px'
          }}
        >
          REGISTER NOW
        </Button>
        
        {/* Social Proof */}
        <Text style={{
          fontSize: '16px',
          color: '#9ca3af',
          margin: 0
        }}>
          ✓ 2,500+ attendees • ✓ 100+ speakers • ✓ 50+ sessions
        </Text>
      </Section>

      {/* Early Bird Banner */}
      <Section style={{
        backgroundColor: '#ea580c',
        padding: '24px',
        textAlign: 'center'
      }}>
        <Text style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#ffffff',
          textTransform: 'uppercase',
          margin: '0 0 8px 0'
        }}>
          ⚡ EARLY BIRD PRICING - SAVE $200
        </Text>
        <Text style={{
          fontSize: '16px',
          color: '#ffffff',
          margin: 0
        }}>
          Register by January 31 • Limited to first 500 tickets
        </Text>
      </Section>

      {/* Featured Speakers Section */}
      <Section style={{ padding: '56px 24px 40px' }}>
        <Heading style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#111827',
          textAlign: 'center',
          margin: '0 0 40px 0'
        }}>
          Featured Speakers
        </Heading>
        
        {/* Speaker Grid - Using table for email compatibility */}
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
          <tr>
            {/* Speaker 1 */}
            <td width="33%" valign="top" style={{ padding: '0 12px 24px', textAlign: 'center' }}>
              <Img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=280&h=280&fit=crop"
                alt="Dr. Sarah Chen, Chief AI Officer at OpenAI, keynote speaker"
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  border: '4px solid #e5e7eb',
                  display: 'block',
                  margin: '0 auto 16px'
                }}
              />
              <Text style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 4px 0'
              }}>
                Dr. Sarah Chen
              </Text>
              <Text style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#e11d48',
                margin: '0 0 4px 0'
              }}>
                Chief AI Officer
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                OpenAI
              </Text>
            </td>
            
            {/* Speaker 2 */}
            <td width="33%" valign="top" style={{ padding: '0 12px 24px', textAlign: 'center' }}>
              <Img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=280&h=280&fit=crop"
                alt="Marcus Johnson, VP of Engineering at Meta, presenting on scalable systems"
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  border: '4px solid #e5e7eb',
                  display: 'block',
                  margin: '0 auto 16px'
                }}
              />
              <Text style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 4px 0'
              }}>
                Marcus Johnson
              </Text>
              <Text style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#e11d48',
                margin: '0 0 4px 0'
              }}>
                VP of Engineering
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Meta
              </Text>
            </td>
            
            {/* Speaker 3 */}
            <td width="33%" valign="top" style={{ padding: '0 12px 24px', textAlign: 'center' }}>
              <Img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=280&h=280&fit=crop"
                alt="Lisa Park, Founder & CEO of InnovateLab, discussing startup innovation"
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  border: '4px solid #e5e7eb',
                  display: 'block',
                  margin: '0 auto 16px'
                }}
              />
              <Text style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 4px 0'
              }}>
                Lisa Park
              </Text>
              <Text style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#e11d48',
                margin: '0 0 4px 0'
              }}>
                Founder & CEO
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                InnovateLab
              </Text>
            </td>
          </tr>
        </table>
        
        <div style={{ textAlign: 'center' }}>
          <Link
            href="https://example.com/speakers"
            style={{
              color: '#e11d48',
              fontSize: '18px',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            View All 100+ Speakers →
          </Link>
        </div>
      </Section>

      {/* Event Highlights */}
      <Section style={{
        padding: '48px 24px',
        backgroundColor: '#f9fafb'
      }}>
        <Heading style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#111827',
          textAlign: 'center',
          margin: '0 0 32px 0'
        }}>
          What to Expect
        </Heading>
        
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td width="50%" valign="top" style={{ padding: '0 16px 24px 0' }}>
              <Text style={{
                fontSize: '40px',
                margin: '0 0 8px 0'
              }}>
                🎤
              </Text>
              <Heading style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                50+ Sessions
              </Heading>
              <Text style={{
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                Keynotes, panels, and workshops covering AI, cloud, security, and more
              </Text>
            </td>
            
            <td width="50%" valign="top" style={{ padding: '0 0 24px 16px' }}>
              <Text style={{
                fontSize: '40px',
                margin: '0 0 8px 0'
              }}>
                🤝
              </Text>
              <Heading style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                Networking Events
              </Heading>
              <Text style={{
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                Connect with industry leaders at exclusive mixers and dinners
              </Text>
            </td>
          </tr>
          
          <tr>
            <td width="50%" valign="top" style={{ padding: '0 16px 0 0' }}>
              <Text style={{
                fontSize: '40px',
                margin: '0 0 8px 0'
              }}>
                💻
              </Text>
              <Heading style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                Hands-On Labs
              </Heading>
              <Text style={{
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                Build real projects with cutting-edge tools and frameworks
              </Text>
            </td>
            
            <td width="50%" valign="top" style={{ padding: '0 0 0 16px' }}>
              <Text style={{
                fontSize: '40px',
                margin: '0 0 8px 0'
              }}>
                🎁
              </Text>
              <Heading style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                Expo Hall
              </Heading>
              <Text style={{
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                Discover the latest tech from 50+ innovative companies
              </Text>
            </td>
          </tr>
        </table>
      </Section>

      {/* Ticket Tiers */}
      <Section style={{ padding: '56px 24px' }}>
        <Heading style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#111827',
          textAlign: 'center',
          margin: '0 0 16px 0'
        }}>
          Choose Your Pass
        </Heading>
        
        <Text style={{
          fontSize: '16px',
          color: '#6b7280',
          textAlign: 'center',
          margin: '0 0 40px 0'
        }}>
          Early Bird pricing ends January 31
        </Text>
        
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            {/* General Admission */}
            <td width="50%" valign="top" style={{ padding: '0 8px 16px' }}>
              <div style={{
                backgroundColor: '#ffffff',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '28px',
                textAlign: 'center'
              }}>
                <Text style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#111827',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  margin: '0 0 16px 0'
                }}>
                  General Pass
                </Text>
                
                <div style={{ marginBottom: '20px' }}>
                  <span style={{
                    fontSize: '20px',
                    color: '#9ca3af',
                    textDecoration: 'line-through',
                    marginRight: '8px'
                  }}>
                    $499
                  </span>
                  <span style={{
                    fontSize: '44px',
                    fontWeight: '700',
                    color: '#e11d48'
                  }}>
                    $299
                  </span>
                </div>
                
                <Text style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.8',
                  margin: '0 0 24px 0',
                  textAlign: 'left'
                }}>
                  ✓ Access to all sessions<br />
                  ✓ Conference materials<br />
                  ✓ Lunch & refreshments<br />
                  ✓ Expo hall access<br />
                  ✓ Networking events
                </Text>
                
                <Button
                  href="https://example.com/tickets/general"
                  style={{
                    backgroundColor: '#e11d48',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    padding: '14px 32px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                  }}
                >
                  Buy General
                </Button>
              </div>
            </td>
            
            {/* VIP Pass */}
            <td width="50%" valign="top" style={{ padding: '0 8px 16px' }}>
              <div style={{
                backgroundColor: '#fffbeb',
                border: '3px solid #f59e0b',
                borderRadius: '12px',
                padding: '28px',
                textAlign: 'center'
              }}>
                <div style={{
                  backgroundColor: '#f59e0b',
                  color: '#1f2937',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  padding: '6px 16px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginBottom: '12px'
                }}>
                  🌟 BEST VALUE
                </div>
                
                <Text style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#111827',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  margin: '0 0 16px 0'
                }}>
                  VIP Pass
                </Text>
                
                <div style={{ marginBottom: '20px' }}>
                  <span style={{
                    fontSize: '20px',
                    color: '#9ca3af',
                    textDecoration: 'line-through',
                    marginRight: '8px'
                  }}>
                    $899
                  </span>
                  <span style={{
                    fontSize: '44px',
                    fontWeight: '700',
                    color: '#e11d48'
                  }}>
                    $699
                  </span>
                </div>
                
                <Text style={{
                  fontSize: '14px',
                  color: '#78350f',
                  lineHeight: '1.8',
                  margin: '0 0 24px 0',
                  textAlign: 'left'
                }}>
                  ✓ All General benefits<br />
                  ✓ <strong>VIP lounge access</strong><br />
                  ✓ <strong>Premium seating</strong><br />
                  ✓ <strong>Speaker meet & greets</strong><br />
                  ✓ <strong>Exclusive VIP dinner</strong><br />
                  ✓ <strong>Gift bag ($200 value)</strong>
                </Text>
                
                <Button
                  href="https://example.com/tickets/vip"
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#1f2937',
                    fontSize: '16px',
                    fontWeight: '700',
                    padding: '14px 32px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                  }}
                >
                  Buy VIP
                </Button>
              </div>
            </td>
          </tr>
        </table>
        
        <Text style={{
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'center',
          margin: '24px 0 0 0'
        }}>
          Group discounts available for 5+ tickets
        </Text>
      </Section>

      {/* Final CTA */}
      <Section style={{
        padding: '48px 24px',
        backgroundColor: '#1f2937',
        textAlign: 'center'
      }}>
        <Heading style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#ffffff',
          margin: '0 0 16px 0'
        }}>
          Don't Miss Out
        </Heading>
        
        <Text style={{
          fontSize: '18px',
          color: '#d1d5db',
          margin: '0 0 32px 0'
        }}>
          Join the biggest tech event of 2025
        </Text>
        
        <Button
          href="https://example.com/register"
          style={{
            backgroundColor: '#e11d48',
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            padding: '20px 60px',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 6px 12px rgba(225, 29, 72, 0.5)'
          }}
        >
          REGISTER NOW
        </Button>
      </Section>

      {/* Footer */}
      <Section style={{
        padding: '32px 24px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb'
      }}>
        <Text style={{
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'center',
          margin: '0 0 8px 0'
        }}>
          Questions? <Link href="mailto:info@techconf.com" style={{ color: '#e11d48' }}>
            Contact us
          </Link> or visit our <Link href="https://techconf.com/faq" style={{ color: '#e11d48' }}>
            FAQ
          </Link>
        </Text>
        
        <Text style={{
          fontSize: '14px',
          color: '#9ca3af',
          textAlign: 'center',
          margin: 0
        }}>
          © 2025 TechConf. All rights reserved.
        </Text>
      </Section>
    </>
  );
}`
};


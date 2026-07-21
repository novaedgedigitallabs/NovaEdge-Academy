# NovaEdge Academy — Landing Page Design Spec
**Route:** `/`
**Version:** v1.0
**Theme:** Dark Premium EdTech
**Stack:** Next.js 15 (App Router) · Tailwind CSS · Framer Motion · GSAP

---

## Global Layout Rules

```
Max Content Width  : 1280px (centered, auto horizontal margin)
Section Padding    : 96px top/bottom (desktop) → 56px (tablet) → 40px (mobile)
Horizontal Gutter  : 24px (mobile) → 48px (tablet) → 80px (desktop)
Base Grid          : 12-column, 24px gap
Border Radius      : Cards 16px · Buttons 10px · Badges 99px · Inputs 10px
```

**Background:** `#08080E` on `<html>` and `<body>` — set once, do not repeat per section.

**Section dividers:** No `<hr>` lines. Spacing alone separates sections. Use subtle gradient bleeds
(`radial-gradient` from `--bg-surface` center) on alternating sections to create depth variation.

---

## Design Token Reference

```css
/* Backgrounds */
--bg-base:     #08080E   /* root */
--bg-surface:  #0E0E18   /* cards */
--bg-elevated: #141420   /* raised elements */
--bg-overlay:  #1C1C2E   /* modals */

/* Brand */
--primary-300: #C084FC
--primary-400: #A855F7
--primary-500: #9333EA   /* main CTA color */
--primary-600: #7C3AED

/* Learning */
--cyan-400:    #22D3EE
--cyan-500:    #06B6D4   /* progress, info */

/* Gamification */
--gold-400:    #FBBF24   /* achievements */
--gold-500:    #F59E0B

/* Text */
--text-1:  #F2F2FF   /* primary */
--text-2:  #9494AF   /* secondary */
--text-3:  #5A5A74   /* muted */
--text-4:  #35354A   /* disabled */

/* System */
--success: #10B981
--error:   #F43F5E
--info:    #06B6D4

/* Borders */
--border-subtle:  rgba(255,255,255,0.05)
--border-default: rgba(255,255,255,0.09)
--border-strong:  rgba(255,255,255,0.16)

/* Gradients */
--grad-primary:  linear-gradient(135deg, #9333EA 0%, #4F46E5 100%)
--grad-learn:    linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%)
--grad-gold:     linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)
--grad-card:     linear-gradient(145deg, #141420 0%, #0E0E18 100%)
--grad-hero-mesh: radial-gradient(ellipse at 15% 20%, rgba(147,51,234,0.45) 0%, transparent 50%),
                  radial-gradient(ellipse at 85% 80%, rgba(6,182,212,0.25) 0%, transparent 50%)
```

---

## Typography Map

| Role        | Font           | Weight | Size (desktop) | Line Height |
|-------------|----------------|--------|----------------|-------------|
| Display     | Syne           | 800    | 72px           | 1.05        |
| H1          | Syne           | 700    | 48px           | 1.15        |
| H2          | Syne           | 700    | 36px           | 1.2         |
| H3          | Outfit         | 600    | 24px           | 1.3         |
| H4          | Outfit         | 600    | 20px           | 1.35        |
| Body L      | Figtree        | 400    | 18px           | 1.7         |
| Body M      | Figtree        | 400    | 16px           | 1.65        |
| Body S      | Figtree        | 400    | 14px           | 1.6         |
| Label/Badge | Outfit         | 500    | 12px           | 1.4         |
| Caption     | Figtree        | 400    | 12px           | 1.5         |
| Code        | JetBrains Mono | 400    | 13px           | 1.7         |

Load via Google Fonts — `Syne:wght@700;800`, `Outfit:wght@400;500;600;700`,
`Figtree:wght@300;400;500;600`, `JetBrains+Mono:wght@400`.

---

---

## Section 01 — Navbar

**Purpose:** Persistent navigation. Transparent on load, gains a blur+surface-tinted backdrop on scroll.

### Layout
```
[Logo]                    [Nav Links (centered)]           [Auth CTAs]
Left-aligned              Hidden on mobile → Hamburger      Button group
```

Full-width. `position: sticky; top: 0; z-index: 50`.

### Elements

**Logo**
- Text mark: `NovaEdge` in Syne 700, 20px, `--text-1`
- Followed by: `Academy` in Outfit 500, 14px, `--primary-400` with a `•` separator in `--text-3`
- OR import SVG logo from `/public/logo.svg` if available

**Nav Links** (Outfit 500, 14px, `--text-2` → hover `--text-1`)
- Courses
- Learning Paths
- Mentors
- Community
- Blog

**Right CTAs**
- `Sign In` — ghost button: transparent bg, `--border-default` border, `--text-1` text, 36px height
- `Get Started` — filled: `--grad-primary` background, white text, 36px height, 10px radius

### Scroll Behavior
```
On scroll > 40px:
  background: rgba(8, 8, 14, 0.85)
  backdrop-filter: blur(20px) saturate(180%)
  border-bottom: 1px solid --border-subtle
  transition: all 200ms ease
```

### Mobile (< 768px)
- Logo stays left
- Hamburger icon (`☰`) replaces nav links — opens a slide-in drawer from right
- Drawer: full-height, `--bg-overlay` background, all links stacked vertically
- Both CTA buttons visible in drawer footer

---

## Section 02 — Hero

**Purpose:** First impression. Convert visitor into a curious learner. Establish premium feel immediately.

### Layout
```
┌──────────────────────────────────────────────────────────────┐
│  [Badge: "India's #1 EdTech Platform"]                       │
│                                                              │
│  [Display: "Learn Skills That          [Floating UI Card]   │
│   Actually Get You                     [Dashboard Mockup]   │
│   Hired."]                             [Floating Stat Pills]│
│                                                              │
│  [Body: Subtext paragraph]                                   │
│  [CTA Row: Primary Button + Ghost]                           │
│  [Social Proof: Avatars + count]                             │
└──────────────────────────────────────────────────────────────┘
```

Split: left column `col-span-7`, right column `col-span-5`.
Full viewport height: `min-height: 100vh`. Content centered vertically.

### Background
```css
background: var(--grad-hero-mesh), var(--bg-base);
/* Add a subtle grid pattern overlay: */
background-image: var(--grad-hero-mesh),
  linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
background-size: cover, 60px 60px, 60px 60px;
```

### Left Column

**Announcement Badge** (at top, before headline)
```
Background: rgba(147, 51, 234, 0.12)
Border: 1px solid rgba(147, 51, 234, 0.30)
Text: "🎓 India's #1 EdTech Platform for Developers" — Outfit 500, 13px, --primary-300
Border-radius: 99px
Padding: 6px 16px
```

**Headline** — Syne 800, 68px (desktop), line-height 1.05, `--text-1`
```
"Learn Skills That
Actually Get You
Hired."
```
Span `"Hired."` with `--grad-primary` as `background-clip: text` for gradient treatment.

**Subtext** — Figtree 400, 18px, `--text-2`, max-width 520px
```
"Expert-led courses, AI-powered learning paths, and a thriving community
of 50,000+ developers. From beginner to job-ready — all in one place."
```

**CTA Row**
- Primary: `Explore Courses →` — `--grad-primary` bg, white, Outfit 600, 15px, 48px height, 10px radius
- Ghost: `Watch Demo` with a ▶ play icon — transparent, `--border-strong` border, `--text-1`, same height

**Social Proof Row** (below CTAs, `margin-top: 24px`)
```
[5 overlapping student avatars] + "Join 50,000+ learners"
Font: Figtree 400, 14px, --text-2
Avatars: 36px circles, -8px left margin overlap, --border-default ring
```

### Right Column

**Floating Dashboard Card** — main visual element
- A stylized UI mockup card showing a course player or dashboard
- Background: `--grad-card`, border: `--border-default`, border-radius: 20px
- Contains: a mini progress ring, course thumbnail, title, and a progress bar
- Subtle `box-shadow: 0 32px 64px rgba(0,0,0,0.5)`
- Add 2–3 floating mini-pills around it (absolute positioned):
  - `"⭐ 4.9 Rating"` pill (top-right)
  - `"🔥 1,240 enrolled today"` pill (bottom-left)
  - `"✅ Certificate Included"` pill (left-center)
- Each pill: `--bg-elevated` bg, `--border-default` border, Outfit 500, 12px, 99px radius

### Animations (Framer Motion)
```
Left column → Stagger in from left (x: -30, opacity: 0 → x: 0, opacity: 1)
  Badge    → delay: 0ms
  Headline → delay: 100ms  (each line staggers +80ms)
  Subtext  → delay: 350ms
  CTAs     → delay: 500ms
  Proof    → delay: 650ms

Right card → fade+scale in (scale: 0.9 → 1, opacity: 0 → 1), delay: 300ms
Floating pills → individual float animation (keyframe: y: 0 → -8px → 0, 3s ease-in-out infinite)
  Each pill has a different animation-delay (0ms, 800ms, 1600ms)
```

### Mobile (< 768px)
- Single column layout, right card hidden (or shown below CTA, scaled down)
- Headline: 40px
- Floating pills: hide all except one

---

## Section 03 — Stats Bar

**Purpose:** Instant credibility through numbers.

### Layout
Full-width horizontal strip. `--bg-surface` background. `border-top` and `border-bottom` of `--border-subtle`.

4 stats in a row, separated by vertical `--border-subtle` dividers.

### Each Stat Item
```
[Large Number]     e.g. "50,000+"
[Label]            e.g. "Active Learners"
```
- Number: Syne 700, 40px, `--text-1` (animated count-up on scroll enter)
- Label: Outfit 400, 14px, `--text-3`
- Centered, padding `32px 0`

### Stats Content
| Number | Label |
|--------|-------|
| 50,000+ | Active Learners |
| 200+ | Expert-Led Courses |
| 80+ | Industry Mentors |
| 4.9 ★ | Average Rating |

### Animation
Count-up with `requestAnimationFrame` triggered by Intersection Observer.
Duration: 1800ms. Easing: easeOutCubic.

### Mobile
2×2 grid instead of 4-in-a-row. Remove vertical dividers.

---

## Section 04 — Featured Courses

**Purpose:** Show the product. Let courses sell themselves.

### Layout
```
[Section Header Row: "Featured Courses"  +  "Browse All →" link]
[Filter Pills Row: All | Web Dev | Mobile | AI/ML | Design | Data]
[Course Card Grid: 3 columns on desktop, 2 on tablet, 1 on mobile]
```

### Section Header
- `H2` — Syne 700, 36px, `--text-1`
- `"Browse All →"` — Outfit 500, 14px, `--primary-400`, right-aligned

### Filter Pills
```
Background (active):  --primary-500 with rgba(147,51,234,0.15) bg tint
Background (default): transparent, --border-default border
Text: Outfit 500, 13px
Border-radius: 99px
Padding: 8px 20px
Gap: 8px
```

### Course Card
```
Width: auto (grid fills)
Background: --bg-surface
Border: 1px solid --border-default
Border-radius: 16px
Overflow: hidden
Hover: border-color → --primary-500 (30% alpha), translateY(-4px), transition 200ms
```

**Card Anatomy (top to bottom):**

1. **Thumbnail** — `aspect-ratio: 16/9`, `object-fit: cover`
   - Overlay on hover: semi-transparent dark scrim + `▶ Preview` button (centered)

2. **Card Body** — padding `16px`

3. **Category Badge** — `--cyan-500` text, `rgba(6,182,212,0.1)` bg, Outfit 500, 11px, 99px radius

4. **Course Title** — Outfit 600, 16px, `--text-1`, 2-line clamp

5. **Mentor Row** — `margin-top: 10px`
   - Avatar: 24px circle
   - Name: Figtree 400, 13px, `--text-2`

6. **Stats Row** — `margin-top: 10px`, flex, space-between
   - `⭐ 4.8 (1.2k)` — Figtree 400, 13px, `--gold-400` star + `--text-2` text
   - `12.5 hrs · 47 lectures` — Figtree 400, 13px, `--text-3`

7. **Footer Row** — `border-top: 1px solid --border-subtle`, `padding-top: 12px`, `margin-top: 12px`
   - Price: Outfit 700, 18px, `--text-1` (`₹999` or `Free`)
   - Original price: Figtree 400, 14px, `--text-3`, `text-decoration: line-through`
   - Enroll Button: `--grad-primary` bg, white, Outfit 600, 13px, full-width, 38px height

### Show 6 cards (2 rows × 3 columns). Remaining hidden behind "Browse All" CTA.

### Animation
Cards stagger-fade in on scroll (Framer Motion `staggerChildren: 0.08`).

---

## Section 05 — Learning Paths

**Purpose:** Show structured, goal-oriented journeys (not just individual courses).

### Layout
```
[Section Label: "STRUCTURED PATHS"]
[H2: "Your Learning Journey, Mapped Out."]
[Subtext]
[Path Cards: 4-column grid]
```

### Path Card
```
Background: --bg-surface
Border: 1px solid --border-default
Border-radius: 16px
Padding: 24px
Hover: border → --grad-primary gradient border (use ::before pseudo + clip-path trick)
```

**Card Anatomy:**
1. **Icon Block** — 48px × 48px, rounded-12, gradient bg matching path color, white icon (SVG)
2. **Path Name** — Outfit 600, 18px, `--text-1`, `margin-top: 16px`
3. **Description** — Figtree 400, 14px, `--text-2`, 2-line clamp, `margin-top: 6px`
4. **Course Count** — Outfit 500, 12px, `--text-3` (`8 Courses · ~40 hrs`)
5. **Skills Chips** — small pill chips (React, Node.js, MongoDB...), `--bg-elevated` bg, `--text-3` text, 12px
6. **CTA** — `"Start Path →"` Outfit 500, 13px, `--primary-400`, arrow slides right on hover

### Path Examples
| Icon Color | Path Name | Courses |
|------------|-----------|---------|
| `--grad-primary` | Full-Stack Web Developer | 8 courses |
| `--grad-learn` | AI & Machine Learning | 6 courses |
| `--grad-gold` | Mobile App Developer | 5 courses |
| Custom teal | UI/UX Design | 4 courses |

---

## Section 06 — How It Works

**Purpose:** Remove friction by making the process feel effortless.

### Layout
```
[Section Label: "THE PROCESS"]
[H2: "From Zero to Job-Ready in 3 Steps."]
[3-Step Row with connecting dashed line]
```

### Step Item
Each step: centered, width ~280px.

```
[Step Number Circle] — 48px, --grad-primary bg, Syne 800, 22px, white
        |
[Connecting Dashed Line] — horizontal, --border-default, between step circles
        |
[Step Icon] — 64px × 64px, --bg-elevated, centered SVG icon
[Step Title] — Outfit 600, 20px, --text-1, centered
[Step Body] — Figtree 400, 15px, --text-2, centered, max-width 240px
```

### Step Content
1. **Browse & Choose** — "Pick from 200+ expert-led courses or follow a structured learning path tailored to your goals."
2. **Enroll & Learn** — "Watch video lectures, complete assignments, and take AI-powered quizzes at your own pace."
3. **Earn & Grow** — "Get certified, build your portfolio, connect with mentors, and land your dream role."

### Animation
Steps animate in sequentially with a line-drawing animation between them (GSAP `DrawSVG`).

---

## Section 07 — AI Superpowers

**Purpose:** Key differentiator — highlight the AI features that Udemy doesn't have.

### Layout
Alternate section background: `radial-gradient(ellipse at center, rgba(147,51,234,0.08) 0%, transparent 70%), --bg-base`

```
[Left: Text content]          [Right: Feature Cards Stack]
col-span-5                     col-span-7
```

### Left Content
- Section Label: `"AI-POWERED"`
- H2: `"Not Just Courses. An AI Learning Partner."` — Syne 700, 36px
- Body: Figtree 400, 17px, `--text-2`, max-width 420px
- CTA: `"See AI Features →"` — ghost button, `--primary-400`

### Right: Feature Cards (3 cards, stacked with slight offset/overlap)
Each card: `--bg-surface`, `--border-default`, 16px radius, padding 20px

| Feature | Description | Icon Color |
|---------|-------------|------------|
| AI Notes Generator | Auto-generates structured lecture notes and summaries from any video | `--primary-400` |
| Smart Quiz Engine | Creates personalized assessments based on what you've learned | `--cyan-500` |
| Learning Velocity | Tracks your pace, predicts completion, suggests optimal study times | `--gold-400` |

**Card Structure:**
- Icon row: 40px icon block (gradient bg) + feature name (Outfit 600, 16px, `--text-1`)
- Description: Figtree 400, 14px, `--text-2`, `margin-top: 8px`
- Bottom tag: small badge with "Powered by AI" in `--primary-300` text

### Animation
Right cards animate in with `y: 40px → 0` stagger. Cards have a subtle floating animation on idle.

---

## Section 08 — Featured Mentors

**Purpose:** Build trust through human faces and credentials.

### Layout
```
[Section Header: "Learn from the Best"]
[Mentor Card Grid: 4 columns desktop, 2 tablet, 1 mobile]
[CTA: "Meet All Mentors →"]
```

### Mentor Card
```
Background: --bg-surface
Border: 1px solid --border-default
Border-radius: 16px
Padding: 24px
Text-align: center
Hover: translateY(-4px), border → --border-strong
```

**Card Anatomy:**
1. **Avatar** — 72px circle, `object-fit: cover`, `border: 2px solid --border-strong`
   - Online badge: 12px green dot, `--success` color, `bottom-right` of avatar
2. **Name** — Outfit 600, 17px, `--text-1`
3. **Expertise** — Figtree 400, 13px, `--text-2` (e.g., "React · Node.js · AWS")
4. **Company/Role** — Outfit 400, 12px, `--primary-300` (e.g., "Sr. Engineer @ Google")
5. **Stats Row** — centered, flex gap-12
   - `[Course Count] Courses` — Outfit 500, 13px
   - `⭐ [Rating]` — `--gold-400`
   - `[Students] Students`
6. **Button** — `"View Profile"` outlined, full-width, 36px, `--border-strong`, `--text-1`

---

## Section 09 — Community Preview

**Purpose:** Show the social/network dimension — differentiate from solo-learning platforms.

### Layout
Split: left `col-span-6` text + right `col-span-6` community feed mockup.

### Left Content
- Section Label: `"COMMUNITY"`
- H2: `"Learning is Better Together."` — Syne 700, 36px
- Body: Figtree 400, 17px, `--text-2`
  - "Connect with 50,000+ developers, join course discussions, share your wins, and find accountability partners."
- Feature list (3 items):
  - `🔗` Connect with peers & mentors
  - `💬` Course discussion forums
  - `🏆` Celebrate wins publicly
- CTA: `"Join the Community"` — `--grad-primary` button

### Right: Feed Mockup Card
A styled UI mockup showing the community feed. Use actual-looking data:
- 2–3 post cards (avatar, name, post text, like/comment counts)
- One "Join Discussion" prompt
- Background: `--bg-surface`, border: `--border-default`, 16px radius
- This is a decorative UI illustration, not functional

---

## Section 10 — Testimonials

**Purpose:** Social proof from real student outcomes.

### Layout
```
[Section Header]
[3-column testimonial card grid]
```

Background variation: `--bg-surface` overlay strip to visually separate from adjacent sections.

### Testimonial Card
```
Background: --bg-elevated
Border: 1px solid --border-default
Border-radius: 16px
Padding: 28px
```

**Card Anatomy:**
1. **Stars** — 5 gold stars, `--gold-400`, 16px each, `margin-bottom: 16px`
2. **Quote** — Figtree 400 italic, 16px, `--text-1`, line-height 1.7
   - Wrap in `"…"` typographic quotes
   - Max 3 lines
3. **Divider** — `border-top: 1px solid --border-subtle`, `margin: 20px 0`
4. **Student Row** — flex, gap 12px
   - Avatar: 44px circle
   - Name: Outfit 600, 14px, `--text-1`
   - Role: Figtree 400, 13px, `--text-2` (e.g., "Frontend Developer @ Razorpay")

### Sample Quotes
```
"I went from knowing basic HTML to landing a ₹12 LPA job in 8 months.
The AI notes feature alone saved me hours every week."
— Priya Sharma, Frontend Dev @ Razorpay

"The mentor sessions changed everything. Real industry feedback,
not just video content. Worth every rupee."
— Arjun Mehta, Full-Stack Engineer @ Swiggy

"The community here is insane. Found my co-founder through a
course discussion. Can't make this up."
— Sneha Patel, Startup Founder
```

---

## Section 11 — Pricing Preview

**Purpose:** Soft-introduce pricing. Drive users toward the `/pricing` page rather than hard-closing here.

### Layout
```
[Section Label: "PRICING"]
[H2: "Flexible Plans for Every Learner."]
[3 Plan Cards: Free · Pro · Business]
[CTA: "Compare All Plans →"]
```

### Plan Card — General Structure
```
Background: --bg-surface
Border: 1px solid --border-default
Border-radius: 20px
Padding: 32px
```

**Pro Plan** gets special treatment:
```
Border: 1.5px solid --primary-500
Background: linear-gradient(145deg, rgba(147,51,234,0.1), --bg-surface)
Badge at top: "MOST POPULAR" — --grad-primary bg, white, Outfit 600, 11px, 99px radius
Scale: 1.02 (slightly larger than siblings)
```

### Each Plan Card Anatomy
1. **Plan Name** — Outfit 700, 20px, `--text-1`
2. **Price** — Syne 800, 40px, `--text-1` + Outfit 400, 16px, `--text-3` (`/month`)
3. **Description** — Figtree 400, 14px, `--text-2`
4. **Feature List** — 5–6 items with ✓ checkmarks (`--success`) or ✗ (`--text-4`)
   - Figtree 400, 14px, `--text-2`
5. **CTA Button** — Full-width
   - Free: `"Get Started Free"` outlined
   - Pro: `"Start Pro Trial"` `--grad-primary`
   - Business: `"Contact Sales"` outlined

### Plan Data
| Plan | Price | Key Features |
|------|-------|------|
| Free | ₹0 | 5 free courses, community access, basic quizzes |
| Pro | ₹499/mo | All courses, AI features, certificates, mentor chat |
| Business | Custom | Team seats, custom paths, analytics, priority support |

---

## Section 12 — Final CTA Banner

**Purpose:** Last-chance conversion before footer. Urgency + emotion.

### Layout
Full-width banner. Background: `--grad-primary`. Center-aligned content. Padding: `80px 0`.

### Content
- **Headline** — Syne 800, 48px, white
  `"Your Next Level Starts Today."`
- **Subtext** — Figtree 400, 18px, `rgba(255,255,255,0.75)`
  `"Join 50,000+ learners. No credit card needed."`
- **CTA** — White background, `--primary-600` text, Outfit 600, 15px, 52px height, 12px radius
  `"Start Learning for Free →"`
- Below CTA: `"✓ 7-day free trial  ✓ Cancel anytime  ✓ Certificate included"` — Outfit 400, 13px, `rgba(255,255,255,0.6)`

---

## Section 13 — Footer

**Purpose:** Navigation, trust signals, and legal.

### Layout
4-column grid (desktop), 2-column (tablet), stacked (mobile). Top border: `--border-subtle`. `--bg-base` background. Padding: `64px 0 32px`.

### Columns

**Column 1 — Brand**
- Logo + tagline: `"Learn. Build. Grow."`
- 2-line description: Figtree 400, 14px, `--text-3`
- Social icons row: LinkedIn, GitHub, Twitter, Instagram — 20px each, `--text-3` → hover `--text-1`
- Google Play + App Store badges (small)

**Column 2 — Learn**
- Heading: Outfit 600, 13px, `--text-3`, uppercase, letter-spacing
- Links: Courses, Learning Paths, Mentors, Live Classes, Blog
- Figtree 400, 14px, `--text-2` → hover `--primary-300`

**Column 3 — Company**
- About Us, Careers, Press, Partners, Contact

**Column 4 — Support**
- Help Center, Documentation, Status, Privacy Policy, Terms of Service

### Newsletter Strip (above column area)
```
Background: --bg-surface
Border: 1px solid --border-subtle
Border-radius: 12px
Padding: 24px 32px
Layout: flex space-between

Left: "Get weekly learning tips" (Outfit 600, 16px) + subtext
Right: Input + Subscribe button
  Input: --bg-elevated, --border-default, Figtree 400, 14px, 44px height
  Button: --grad-primary, white, Outfit 600, 14px, 44px height
```

### Bottom Bar
```
border-top: 1px solid --border-subtle
padding: 24px 0 0
flex space-between

Left:  "© 2025 NovaEdge Digital Labs. All rights reserved." — Figtree 400, 13px, --text-3
Right: "Privacy · Terms · Cookies" — Figtree 400, 13px, --text-3, divider-separated
```

---

## Animation Playbook

### Philosophy
- **Scroll-triggered reveals** via Framer Motion `whileInView` + `viewport: { once: true, margin: "-80px" }`
- **No animation on first contentful paint** — only hero section animates on load
- **Duration budget:** Enter 400ms, micro-interactions 150ms, page transitions 250ms
- **Easing standard:** `[0.22, 1, 0.36, 1]` (custom ease-out) for reveals; `ease` for hovers

### Standard Reveal Variants
```javascript
// Fade up — default for most sections
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

// Stagger container
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
}

// Scale in — for cards
const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
}
```

### Section-specific Notes
| Section | Animation Type | Notes |
|---------|---------------|-------|
| Hero | Load-time stagger | Left col items stagger by 100ms |
| Stats | Count-up on scroll | `requestAnimationFrame` counter, 1800ms |
| Courses | Stagger scaleIn | Cards delay +80ms each |
| How It Works | Sequential + line draw | GSAP SVG line draws left→right |
| Mentors | Stagger fadeUp | 4 cards, +60ms each |
| CTA Banner | FadeUp | Simple, no stagger needed |

### Hover Micro-interactions
- Cards: `translateY(-4px)` + `border-color` brighten, `200ms ease`
- Buttons (primary): `scale(1.02)` + brightness up, `150ms ease`
- Buttons (ghost): `background → --bg-elevated`, `150ms ease`
- Nav links: `color → --text-1`, underline slide in from left via `::after`, `200ms`
- Mentor avatars: `scale(1.05)`, `200ms`

---

## Responsive Breakpoints

```
xs:  < 480px   (small mobile)
sm:  480–767px (mobile)
md:  768–1023px (tablet)
lg:  1024–1279px (small desktop)
xl:  ≥ 1280px  (desktop)
```

### Key Responsive Changes

| Section | Desktop | Tablet (md) | Mobile (sm) |
|---------|---------|-------------|-------------|
| Navbar | Inline nav | Hamburger menu | Hamburger menu |
| Hero | Split 7/5 cols | Stack (text top, visual bottom) | Stack, card hidden |
| Stats | 4-in-row | 2×2 grid | 2×2 grid |
| Courses | 3-col grid | 2-col grid | 1-col |
| Paths | 4-col grid | 2-col grid | 1-col |
| How It Works | 3-col row | 3-col row | Stacked vertical |
| AI Features | Split 5/7 | Stacked | Stacked |
| Mentors | 4-col | 2-col | 1-col |
| Community | Split 6/6 | Stacked | Stacked, mockup hidden |
| Testimonials | 3-col | 1-col (scroll) | 1-col |
| Pricing | 3-col | 1-col (scroll) | 1-col |
| Footer | 4-col | 2-col | Stacked |

### Typography Scaling
```
Display: 72px → 48px (md) → 36px (sm)
H1:      48px → 36px (md) → 28px (sm)
H2:      36px → 28px (md) → 24px (sm)
H3:      24px → 20px (md) → 18px (sm)
Body L:  18px → 16px (sm)
```

---

## Component Reuse Index

These components from this page will be used across the entire app — build them as reusable atoms/molecules from day one:

| Component | Reused In |
|-----------|-----------|
| `<CourseCard />` | `/courses`, `/search`, `/user/dashboard`, `/enrollments` |
| `<MentorCard />` | `/mentors`, `/mentor/[id]`, admin dashboard |
| `<PlanCard />` | `/pricing`, `/subscription`, checkout upsell |
| `<TestimonialCard />` | `/about`, `/testimonials` page |
| `<Badge />` | Everywhere — categories, status, levels |
| `<Avatar />` | Navbar, cards, feed, chat |
| `<StatCounter />` | `/about`, admin dashboard |
| `<Navbar />` | All public pages |
| `<Footer />` | All public pages |
| `<CTABanner />` | `/courses`, `/learning-paths`, `/about` |
| `<FilterPills />` | `/courses`, `/search`, `/blog` |

---

## File Structure for This Page

```
app/
  page.tsx                   ← Landing page route

components/
  layout/
    Navbar.tsx
    Footer.tsx
  sections/
    HeroSection.tsx
    StatsBar.tsx
    FeaturedCourses.tsx
    LearningPaths.tsx
    HowItWorks.tsx
    AIFeatures.tsx
    FeaturedMentors.tsx
    CommunityPreview.tsx
    TestimonialsSection.tsx
    PricingPreview.tsx
    CTABanner.tsx
  ui/
    CourseCard.tsx
    MentorCard.tsx
    PlanCard.tsx
    TestimonialCard.tsx
    Badge.tsx
    Avatar.tsx
    Button.tsx
    FilterPills.tsx
    StatCounter.tsx

lib/
  animations.ts              ← Shared Framer Motion variants
  fonts.ts                   ← Google Fonts config (next/font)

styles/
  globals.css                ← CSS custom properties (all tokens above)
```

---

*End of Landing Page Design Spec — v1.0*
*Next: Design specs for `/courses` catalog page and LMS Player.*
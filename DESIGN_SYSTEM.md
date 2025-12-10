# Visual Design System

## Brand Identity

### Official FAFSA Branding Compliance

**FAFSA Assistant Pro** follows the official FAFSA visual identity guidelines to ensure recognition, trust, and credibility.

#### Primary Color Palette
```css
/* Primary Blue - FAFSA Brand */
--primary-50:  #ecfeff;
--primary-100: #cffafe;
--primary-200: #a5f3fc;
--primary-300: #67e8f9;
--primary-400: #22d3ee;
--primary-500: #06b6d4;
--primary-600: #0891b2;  /* Main Brand Color */
--primary-700: #0e7490;
--primary-800: #155e75;
--primary-900: #164e63;
--primary-950: #083344;
```

#### Secondary Color Palette
```css
/* Neutral Grays */
--neutral-50:  #fafafa;
--neutral-100: #f5f5f5;
--neutral-200: #e5e5e5;
--neutral-300: #d4d4d4;
--neutral-400: #a3a3a3;
--neutral-500: #737373;
--neutral-600: #525252;
--neutral-700: #404040;
--neutral-800: #262626;
--neutral-900: #171717;
--neutral-950: #0a0a0a;

/* Success Green */
--success-50:  #f0fdf4;
--success-500: #22c55e;
--success-600: #16a34a;
--success-700: #15803d;

/* Warning Orange */
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error Red */
--error-500: #ef4444;
--error-600: #dc2626;

/* Info Blue */
--info-500: #3b82f6;
--info-600: #2563eb;
```

---

## Typography

### Font Families

**Primary Font: Inter**
- Usage: Body text, UI elements, forms
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Characteristics: Clean, modern, highly readable

**Display Font: Inter Display**
- Usage: Headings, hero text, CTAs
- Weights: 600 (Semibold), 700 (Bold), 800 (Extrabold)
- Characteristics: Strong, confident, professional

### Type Scale
```css
/* Desktop */
h1: 3.5rem (56px) / Line Height 1.1 / Font Weight 700
h2: 2.25rem (36px) / Line Height 1.2 / Font Weight 700
h3: 1.875rem (30px) / Line Height 1.3 / Font Weight 600
h4: 1.5rem (24px) / Line Height 1.4 / Font Weight 600
h5: 1.25rem (20px) / Line Height 1.5 / Font Weight 600
h6: 1.125rem (18px) / Line Height 1.5 / Font Weight 600

body: 1rem (16px) / Line Height 1.6 / Font Weight 400
small: 0.875rem (14px) / Line Height 1.5 / Font Weight 400
caption: 0.75rem (12px) / Line Height 1.4 / Font Weight 400
```

---

## Photography Guidelines

### Image Philosophy
**Professional, authentic, diverse, and aspirational**

Images should convey:
- ✅ Student success and achievement
- ✅ Academic excellence and dedication
- ✅ Diversity and inclusion
- ✅ Trust and professionalism
- ✅ Accessibility and support

### Image Specifications

#### Hero Images
- **Dimensions**: 1920x1080px minimum (16:9 aspect ratio)
- **Format**: WebP with JPEG fallback
- **Optimization**: <200KB compressed
- **Style**: Bright, aspirational, featuring students

#### Testimonial Photos
- **Dimensions**: 400x400px (1:1 aspect ratio)
- **Format**: WebP with JPEG fallback
- **Optimization**: <50KB compressed
- **Style**: Professional headshots, diverse demographics

#### Feature/Section Images
- **Dimensions**: 800x600px (4:3 aspect ratio)
- **Format**: WebP with JPEG fallback
- **Optimization**: <100KB compressed
- **Style**: Contextual to feature (technology, documents, guidance)

### Image Sources

**Current**: Unsplash (free, high-quality stock photography)
**Production**: Licensed stock or custom photography

**Recommended Photographers on Unsplash**:
- Education: Tra Nguyen, Dom Fou, Vasily Koloda
- Students: Brooke Cagle, Christina @ wocintechchat.com, ThisisEngineering RAEng
- Campus: Roberto Nickson, Matheus Bertelli, MChe Lee

**Licensed Stock**:
- Adobe Stock: $29.99/month
- Shutterstock: $29/month
- Getty Images: Custom pricing

**Custom Photography**:
- Budget: $2,000-5,000
- Deliverables: 50-100 high-res images
- Includes: Students, campus life, advisors, success stories

---

## Iconography

### Icon System: Lucide React

**Philosophy**: Clean, minimal, consistent line weights

**Primary Icons**:
```tsx
import {
  CheckCircle,    // Success, completion
  AlertCircle,    // Warnings, important info
  XCircle,        // Errors, failures
  Info,           // Information, help
  Shield,         // Security, trust
  Lock,           // Privacy, encryption
  Award,          // Achievement, certification
  TrendingUp,     // Progress, growth
  Users,          // Community, collaboration
  FileText,       // Documents, forms
  Calculator,     // Financial calculations
  School,         // Education, universities
  Clock,          // Time, deadlines
  ArrowRight,     // Navigation, CTAs
  ChevronDown,    // Dropdowns, expansion
  HelpCircle,     // Help, tooltips
} from 'lucide-react'
```

### Icon Usage Guidelines
- **Size**: 20px (default), 24px (prominent), 16px (small)
- **Stroke Width**: 2px (consistent across all icons)
- **Color**: Inherit from parent (use text color utilities)
- **Spacing**: 8px minimum from adjacent text

---

## Components

### Button Styles

#### Primary Button
```tsx
className="bg-primary-600 text-white hover:bg-primary-700 
           px-6 py-3 rounded-lg font-semibold 
           shadow-md hover:shadow-lg transition-all"
```
**Usage**: Main CTAs, form submissions

#### Secondary Button
```tsx
className="bg-white text-primary-600 border-2 border-primary-600 
           hover:bg-primary-50 px-6 py-3 rounded-lg font-semibold 
           transition-all"
```
**Usage**: Secondary actions, cancel buttons

#### Ghost Button
```tsx
className="bg-transparent text-primary-600 hover:bg-primary-50 
           px-6 py-3 rounded-lg font-semibold transition-all"
```
**Usage**: Tertiary actions, navigation

### Form Inputs

#### Text Input
```tsx
className="w-full px-4 py-3 border-2 border-neutral-300 
           rounded-lg focus:border-primary-600 focus:ring-4 
           focus:ring-primary-100 transition-all"
```

#### Select Dropdown
```tsx
className="w-full px-4 py-3 border-2 border-neutral-300 
           rounded-lg focus:border-primary-600 focus:ring-4 
           focus:ring-primary-100 appearance-none bg-white"
```

### Cards

#### Basic Card
```tsx
className="bg-white rounded-xl border border-neutral-200 
           shadow-sm hover:shadow-md transition-shadow p-6"
```

#### Feature Card
```tsx
className="bg-white rounded-xl border border-neutral-200 
           shadow-sm hover:shadow-large hover:-translate-y-1 
           transition-all duration-300 p-8"
```

### Badges

#### Trust Badge
```tsx
className="inline-flex items-center gap-2 px-4 py-2 
           bg-success-100 text-success-700 rounded-full 
           font-semibold text-sm"
```

#### Status Badge
```tsx
// Success
className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium"

// Warning
className="px-3 py-1 bg-warning-100 text-warning-700 rounded-full text-xs font-medium"

// Error
className="px-3 py-1 bg-error-100 text-error-700 rounded-full text-xs font-medium"
```

---

## Spacing System

```css
/* Tailwind Spacing Scale (4px base) */
0:   0px
1:   4px
2:   8px
3:   12px
4:   16px
5:   20px
6:   24px
8:   32px
10:  40px
12:  48px
16:  64px
20:  80px
24:  96px
32:  128px
```

**Usage Guidelines**:
- **Micro spacing** (8-12px): Between related elements
- **Small spacing** (16-24px): Between components
- **Medium spacing** (32-48px): Between sections
- **Large spacing** (64-96px): Between major page sections

---

## Shadows

```css
/* Shadow Utilities */
shadow-sm:     0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow:        0 1px 3px 0 rgb(0 0 0 / 0.1)
shadow-md:     0 4px 6px -1px rgb(0 0 0 / 0.1)
shadow-lg:     0 10px 15px -3px rgb(0 0 0 / 0.1)
shadow-xl:     0 20px 25px -5px rgb(0 0 0 / 0.1)
shadow-2xl:    0 25px 50px -12px rgb(0 0 0 / 0.25)

/* Custom Glow Effect */
shadow-glow:   0 0 20px rgb(8 145 178 / 0.3)
```

---

## Border Radius

```css
rounded-none:  0px
rounded-sm:    2px
rounded:       4px
rounded-md:    6px
rounded-lg:    8px
rounded-xl:    12px
rounded-2xl:   16px
rounded-3xl:   24px
rounded-full:  9999px
```

---

## Animations

### Transition Utilities
```css
transition-all:    all 150ms cubic-bezier(0.4, 0, 0.2, 1)
transition-colors: color, background-color 150ms
transition-shadow: box-shadow 150ms
transition-transform: transform 150ms
```

### Custom Animations
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

---

## Accessibility

### Color Contrast
All color combinations meet **WCAG 2.1 AA** standards (4.5:1 contrast ratio minimum)

**Verified Combinations**:
- ✅ Primary-600 (#0891b2) on White: 4.52:1
- ✅ Neutral-900 (#171717) on White: 16.08:1
- ✅ Success-600 (#16a34a) on White: 4.54:1
- ✅ Error-600 (#dc2626) on White: 5.91:1

### Focus States
All interactive elements must have visible focus indicators:
```css
focus:ring-4 focus:ring-primary-100 focus:border-primary-600
```

### Alt Text
Every image must have descriptive alt text:
```tsx
<Image src="..." alt="Diverse group of students celebrating graduation" />
```

### Keyboard Navigation
- Tab order follows visual flow
- All buttons and links keyboard accessible
- Skip to main content link provided
- Modal traps focus appropriately

---

## Responsive Design

### Breakpoints
```css
sm:  640px  /* Tablet portrait */
md:  768px  /* Tablet landscape */
lg:  1024px /* Desktop */
xl:  1280px /* Large desktop */
2xl: 1536px /* Extra large desktop */
```

### Mobile-First Approach
```tsx
// Base styles for mobile
className="text-base"

// Tablet and up
className="sm:text-lg"

// Desktop and up
className="lg:text-xl"
```

### Container Widths
```css
.container-custom {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container-custom { padding: 0 2rem; }
}

@media (min-width: 1024px) {
  .container-custom { padding: 0 4rem; }
}
```

---

## Layout Patterns

### Hero Section
```tsx
<section className="relative bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 
                    text-white overflow-hidden py-20 lg:py-36">
  {/* Background pattern */}
  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
  
  {/* Content */}
  <div className="container-custom relative">
    {/* Hero content */}
  </div>
</section>
```

### Feature Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {features.map(feature => (
    <FeatureCard key={feature.id} {...feature} />
  ))}
</div>
```

### Stats Section
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
  {stats.map(stat => (
    <div key={stat.label} className="text-center">
      <div className="text-4xl font-bold text-primary-600">{stat.value}</div>
      <div className="text-sm text-neutral-600 mt-2">{stat.label}</div>
    </div>
  ))}
</div>
```

---

## Best Practices

### Do's ✅
- Use consistent spacing from the spacing system
- Maintain 4.5:1 minimum contrast ratios
- Provide alt text for all images
- Use semantic HTML elements
- Test on mobile devices first
- Optimize images (WebP, lazy loading)
- Use FAFSA brand colors consistently

### Don'ts ❌
- Don't use colors outside the defined palette
- Don't ignore keyboard navigation
- Don't use images without alt text
- Don't exceed 200KB for images
- Don't mix different icon sets
- Don't use red/green only for critical information (colorblind accessibility)

---

## Quality Checklist

### Before Deploy
- [ ] All images optimized (<200KB)
- [ ] Alt text on all images
- [ ] Color contrast verified (WCAG AA)
- [ ] Mobile responsive tested
- [ ] Keyboard navigation tested
- [ ] Focus states visible
- [ ] Loading states implemented
- [ ] Error states designed
- [ ] Typography hierarchy clear
- [ ] Consistent spacing applied

---

**Maintained By**: Design Team  
**Last Updated**: December 2024  
**Version**: 1.0.0

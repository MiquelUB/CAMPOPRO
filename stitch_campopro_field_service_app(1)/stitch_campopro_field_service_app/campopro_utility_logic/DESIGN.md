---
name: CampoPro Utility Logic
colors:
  surface: '#faf9fc'
  surface-dim: '#dad9dd'
  surface-bright: '#faf9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f7'
  surface-container: '#eeedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e6'
  on-surface: '#1a1c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f4'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f87'
  primary: '#022448'
  on-primary: '#ffffff'
  primary-container: '#1e3a5f'
  on-primary-container: '#8aa4cf'
  inverse-primary: '#adc8f5'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe932c'
  on-secondary-container: '#663500'
  tertiary: '#341f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#503300'
  on-tertiary-container: '#c69b5f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#adc8f5'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#2d486d'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#ffddb2'
  tertiary-fixed-dim: '#edbf7f'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#60410c'
  background: '#faf9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e3e2e6'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  section-title:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-strong:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  data-tabular:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base-unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  sidebar-width: 240px
  sidebar-collapsed: 64px
---

## Brand & Style

The design system is engineered for high-density information management and professional field service workflows. It draws heavy inspiration from the precision of modern developer tools, prioritizing utility, speed, and clarity.

The aesthetic is **Refined Minimalism**. It utilizes a "functional-first" approach where every pixel serves a purpose. The interface remains quiet to allow complex data sets to speak clearly, using subtle depth and high-quality typography to communicate a premium, enterprise-grade feel.

**Key Principles:**
- **Information Density:** Optimized for desktop environments where users need to see maximum context without clutter.
- **Precision:** Mathematical alignment and consistent 8px rhythmic spacing.
- **Subtle Polish:** Use of semi-transparent borders and micro-interactions rather than heavy decorative elements.

## Colors

The palette is anchored by **Dark Navy (#1E3A5F)** to establish authority and trust, while **Warm Amber (#D97706)** is used sparingly for high-priority calls to action and critical status highlights.

- **Neutrals:** A range of slates (from #F8FAFC to #0F172A) provides the structural foundation for surfaces, borders, and text.
- **Semantic Colors:** Statuses follow industry standards but are slightly desaturated to fit the professional tone.
- **Application:** Use the Slate-50 background for secondary layout containers and card surfaces to create subtle contrast against the white primary background.

## Typography

This design system uses **Inter** exclusively to ensure maximum legibility across high-density data views. 

- **Data Tables:** Use the `data-tabular` style (12px) to allow for more rows and columns per viewport.
- **Hierarchy:** Use `label-caps` for table headers and sidebar categories to create clear visual separation.
- **Weights:** Use Medium (500) for interactive elements and Semibold (600) for headers. Avoid Bold (700) to maintain the minimalist aesthetic.

## Layout & Spacing

The layout is based on a strictly enforced **8px grid**. 

- **Sidebar:** The primary navigation resides in a left-aligned sidebar. It supports a collapsed state (64px) showing only icons and an expanded state (240px) for full labels.
- **Grid System:** A 12-column fluid grid is used for the main content area, with 16px gutters.
- **Container Strategy:** Content is grouped into logical "sections" or "cards" using 24px internal padding for standard views and 16px for data-heavy dashboard views.

## Elevation & Depth

To maintain the premium "Linear-like" feel, elevation is achieved through **tonal layering** and **refined borders** rather than heavy shadows.

- **Surfaces:** Level 0 is the main background (#FFFFFF). Level 1 is the Card/Container surface (#F8FAFC).
- **Shadows:** Use a single, highly diffused "Ambient Shadow" for KPI cards and Toasts.
  - *Example:* `0px 4px 12px rgba(15, 23, 42, 0.05)`.
- **Borders:** Surfaces are separated by 1px borders (#E2E8F0). In Dark Mode, these borders transition to a subtle semi-transparent white (rgba(255,255,255,0.1)).

## Shapes

The design system uses a standard **8px (0.5rem)** radius for most UI elements, striking a balance between professional geometry and modern softness.

- **Standard (8px):** Primary buttons, input fields, and cards.
- **Large (16px):** Modals and Toast notifications.
- **Pill:** Status badges and toggle switches.

## Components

### Data Tables
- **Styling:** 12px text, 1px horizontal borders only.
- **Alternating Rows:** Even rows use #F8FAFC; odd rows use #FFFFFF.
- **Headers:** Sticky headers with #F1F5F9 background, using `label-caps` typography and chevron icons for sortable states.

### KPI Cards
- **Structure:** Large numeric value (Display-lg) at the top, followed by a secondary label and a small trend indicator (e.g., +12%).
- **Visuals:** Subtle 1px border and the "Ambient Shadow" defined in Elevation.

### Sidebars
- **Active State:** A subtle background tint (Slate-100) and a 2px vertical primary-color bar on the far left edge.
- **Transitions:** Smooth 200ms width transition between collapsed and expanded states.

### Status Badges
- **Success:** Green text on light green tint (10% opacity).
- **Warning:** Amber text on light amber tint.
- **Error:** Red text on light red tint.
- **Info:** Blue text on light blue tint.

### Wizards & Progress
- **Multi-step:** Horizontal stepped indicator at the top. Completed steps show a checkmark icon; the active step uses a primary color ring; future steps are Slate-300.

### Input Fields
- **Default:** 1px border (#CBD5E1), 8px padding.
- **Focus:** 1px Primary Navy border with a 3px soft Primary Navy glow (alpha 10%).

### Toasts
- Positioned bottom-right. Dark background (#1E293B) with white text for maximum contrast against the light UI.
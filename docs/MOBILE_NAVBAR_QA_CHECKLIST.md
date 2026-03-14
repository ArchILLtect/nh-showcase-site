# Mobile Navbar QA Checklist

Use this after navbar changes to verify behavior quickly (target: ~2 minutes).

## Viewports to test

- Mobile small: `360 x 800`
- Mobile large: `430 x 932`
- Tablet/mobile edge: `767 x 1024`
- Desktop boundary: `768 x 1024` (desktop nav should appear)
- Desktop wide: `1280 x 800`

## Core behavior checks

- On `< md` (width < 768), nav shows compact top bar only (brand left, menu toggle right).
- On `>= md` (width >= 768), desktop nav layout appears and mobile drawer is not visible.
- Mobile header height is compact and does not push hero content excessively.
- Opening/closing mobile menu has subtle animation (~150–250ms) and feels smooth.
- Menu icon swaps correctly between hamburger and close states.

## Mobile menu content checks

- Drawer includes: Home, Projects, About, Blog, Contact, Login (or Dashboard/Admin Dashboard when authenticated).
- Projects expands to child links: My Projects, Future Projects.
- About expands to child links: Overview, Certifications.
- Accordion behavior is one-at-a-time only.
- Tap targets feel comfortable (no cramped links/buttons).

## Accessibility checks

- Toggle button has clear label/state (screen reader announces open/close state).
- Keyboard:
  - `Enter/Space` opens menu from toggle.
  - Focus moves to first menu control when menu opens.
  - `Esc` closes menu.
  - Focus returns to toggle after close.
- Focus ring is visible on interactive controls.

## Close behavior checks

- Selecting any link closes the mobile menu.
- Tapping/clicking outside the drawer closes the mobile menu.
- Route changes close the menu and reset accordion state.

## Layout stability checks (no jump/shift)

- Opening/closing menu does not cause page width jump.
- Body scroll is locked while menu is open.
- After closing, body scroll is restored.

## Quick pass/fail criteria

Pass if all checks above succeed on at least:
- `360 x 800`
- `767 x 1024`
- `768 x 1024`

If any fail, capture:
- Viewport size
- Route/page
- Step to reproduce
- Expected vs actual behavior

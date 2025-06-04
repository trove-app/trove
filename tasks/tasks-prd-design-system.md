## Relevant Files

- `frontend/app/globals.css` - Global CSS with Tailwind v4 @theme configuration and brand colors
- `frontend/postcss.config.mjs` - PostCSS configuration with Tailwind v4 plugin
- `frontend/package.json` - Project dependencies including Tailwind v4, typography plugin, clsx, and tailwind-merge
- `frontend/app/components/` - Current component library (SidebarLayout, Sidebar, TroveGradientTitle)
- `frontend/app/components/ui/` - New UI component library structure with organized directories
- `frontend/app/components/ui/index.ts` - Main export file for UI components
- `frontend/app/components/ui/types.ts` - Shared TypeScript interfaces and types for components
- `frontend/app/components/ui/utils/cn.ts` - Class name utility for combining Tailwind classes
- `frontend/app/components/ui/utils/tailwind-utils.ts` - Shared Tailwind utility patterns and component base classes
- `frontend/app/components/ui/docs/development-guidelines.md` - Tailwind v4-focused development guidelines and best practices
- `frontend/app/components/ui/docs/composition-patterns.md` - Component composition patterns and advanced usage examples
- `frontend/app/components/ui/README.md` - Component library documentation and guidelines
- `frontend/app/components/ui/typography/Text.tsx` - Base Text component with size variants, color variants, and Trove brand styling
- `frontend/app/components/ui/typography/index.ts` - Typography components export file
- `frontend/app/layout.tsx` - Root layout component
- `frontend/app/page.tsx` - Homepage component
- `frontend/app/sql-builder/` - SQL builder section
- `frontend/app/db-explorer/` - Database explorer section
- `frontend/README.md` - Project overview with design system quick start
- `docs/theme-customization.md` - Comprehensive theme customization documentation and guidelines

### Notes

- Project is already using **Tailwind CSS v4** with @theme directive in globals.css
- Brand colors from style guide are already defined in the @theme configuration
- Components should be organized in subdirectories by type (e.g., `ui/typography`, `ui/inputs`, etc.)
- Each component should be a Tailwind-first implementation with minimal custom CSS
- Prefer Tailwind's utility classes over custom CSS whenever possible
- Use Tailwind v4's @theme configuration to extend theme values (colors, spacing, etc.)
- Follow mobile-first responsive design patterns
- Migration follows a "build, test, migrate, validate" cycle for each component type:
  1. Build new component using Tailwind
  2. Test in isolation
  3. Migrate one section at a time (homepage → SQL builder → DB explorer)
  4. Validate in real usage before proceeding
  5. Clean up old implementation only after successful validation
- Keep existing components functional until their replacements are fully validated
- Document Tailwind patterns and compositions for each component type
- Maintain dark mode support through Tailwind's dark: variant and @media (prefers-color-scheme: dark)
- FULLY follow the [style guide](../assets/style-guide.md) for all the feel, vibe, colors etc. etc.

## Tasks

- [x] 1.0 Setup Tailwind Theme Foundation ✅ (Already completed - v4 is set up)
  - [x] 1.1 Tailwind v4 is already installed and configured
  - [x] 1.2 Brand color palette is defined in @theme configuration
  - [x] 1.3 Typography plugin is installed (@tailwindcss/typography)
  - [x] 1.4 Custom spacing scales are defined in @theme
  - [x] 1.5 Border radius and shadow presets are configured
  - [x] 1.6 Dark mode strategy is implemented using @media (prefers-color-scheme: dark)
  - [x] 1.7 CSS custom properties are set up in @theme directive
  - [x] 1.8 Review and optimize current @theme configuration for style guide compliance
  - [x] 1.9 Document theme customization approach

- [ ] 2.0 Create Base Component Library Structure
  - [x] 2.1 Setup component directory structure in `app/components/ui`
  - [x] 2.2 Create TypeScript interfaces for component props (sufficient base types already created)
  - [x] 2.3 Setup shared Tailwind utility classes and component patterns
  - [x] 2.4 Create component development guidelines focusing on Tailwind v4 usage
  - [x] 2.5 Document component composition patterns

- [ ] 3.0 Typography System Implementation
  - [x] 3.1 Create base Text component with size variants using Tailwind
  - [ ] 3.2 Implement Heading component (h1-h6) using Tailwind classes
  - [ ] 3.3 Build Code block component with proper font settings
  - [ ] 3.4 Add theme-aware color variants via Tailwind classes
  - [ ] 3.5 Identify typography usage in homepage
  - [ ] 3.6 Migrate homepage typography to new components
  - [ ] 3.7 Migrate SQL builder typography components
  - [ ] 3.8 Migrate DB explorer typography components
  - [ ] 3.9 Document typography usage patterns
  - [ ] 3.10 Remove old typography styles after validation

- [ ] 4.0 Input Components Implementation
  - [ ] 4.1 Create base Input component with Tailwind styling
  - [ ] 4.2 Build Select component using Tailwind classes
  - [ ] 4.3 Implement Tag/Pill component system
  - [ ] 4.4 Create SearchInput with icon support
  - [ ] 4.5 Add input states using Tailwind modifiers
  - [ ] 4.6 Identify input usage in SQL builder
  - [ ] 4.7 Migrate SQL builder inputs
  - [ ] 4.8 Identify input usage in DB explorer
  - [ ] 4.9 Migrate DB explorer inputs
  - [ ] 4.10 Document form component usage
  - [ ] 4.11 Remove old input components after validation

- [ ] 5.0 Interactive Elements Implementation
  - [ ] 5.1 Create Button component with type variants using Tailwind
  - [ ] 5.2 Add size variants using Tailwind classes
  - [ ] 5.3 Implement IconButton component
  - [ ] 5.4 Build Link component with proper states
  - [ ] 5.5 Add loading states via Tailwind animations
  - [ ] 5.6 Identify button/link usage in homepage
  - [ ] 5.7 Migrate homepage interactive elements
  - [ ] 5.8 Migrate SQL builder interactive elements
  - [ ] 5.9 Migrate DB explorer interactive elements
  - [ ] 5.10 Document interactive component usage
  - [ ] 5.11 Remove old button components after validation

- [ ] 6.0 Layout Components Implementation
  - [ ] 6.1 Create Container component with Tailwind constraints
  - [ ] 6.2 Implement Grid system using Tailwind grid classes
  - [ ] 6.3 Build Card component with variants
  - [ ] 6.4 Add spacing utilities through Tailwind classes
  - [ ] 6.5 Identify layout patterns in homepage
  - [ ] 6.6 Migrate homepage layouts
  - [ ] 6.7 Migrate SQL builder layouts
  - [ ] 6.8 Migrate DB explorer layouts
  - [ ] 6.9 Document layout composition patterns
  - [ ] 6.10 Remove old layout components after validation

- [ ] 7.0 Data Display Components Implementation
  - [ ] 7.1 Create Table wrapper component
    - [ ] 7.1.1 Style mantine-react-table using Tailwind classes
    - [ ] 7.1.2 Implement consistent header and cell styles
    - [ ] 7.1.3 Add responsive behaviors
    - [ ] 7.1.4 Setup dark mode variants
    - [ ] 7.1.5 Test table component in SQL builder
    - [ ] 7.1.6 Migrate SQL builder tables
    - [ ] 7.1.7 Test table component in DB explorer
    - [ ] 7.1.8 Migrate DB explorer tables
  - [ ] 7.2 Build Status indicator components
  - [ ] 7.3 Create Loading state components
  - [ ] 7.4 Test data display components in context
  - [ ] 7.5 Document data display patterns
  - [ ] 7.6 Remove old data display components after validation

- [ ] 8.0 Quality Assurance
  - [ ] 8.1 Audit remaining non-Tailwind styles
  - [ ] 8.2 Performance testing of new components
  - [ ] 8.3 Accessibility testing
  - [ ] 8.4 Cross-browser testing
  - [ ] 8.5 Dark mode validation
  - [ ] 8.6 Responsive design validation

- [ ] 9.0 Documentation
  - [ ] 9.1 Create Tailwind v4 usage guidelines
  - [ ] 9.2 Document theme customization using @theme directive
  - [ ] 9.3 Add component prop documentation
  - [ ] 9.4 Create example implementations
  - [ ] 9.5 Document dark mode usage with @media queries
  - [ ] 9.6 Add contribution guidelines

Ready to start with the next incomplete task: **3.2 Implement Heading component (h1-h6) using Tailwind classes**. This will begin building our actual component library with typography components. 

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.
- **Iconography Standard (PrimeIcons)**: Always prioritize using icons from the official PrimeIcons library (`pi pi-[icon-name]`) instead of declaring inline or external SVGs for icons. This ensures absolute styling consistency, fast rendering, and simple maintenance across templates.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Separate Logic, Template, and Style (4-File Rule): Every complex Angular component (or those containing form logic, validation, transitions, or rich styles) **MUST** be built by splitting it into its 4 corresponding files:
  1. `.ts` (Component logic and control, referencing relative `templateUrl` and `styleUrl`)
  2. `.html` (Clean and independent HTML template)
  3. `.css` (UI-specific styles)
  4. `.spec.ts` (Automated unit tests)
- **Single-File Exception**: Only extremely simple components, of a purely illustrative nature or static alerts, that possess **very few lines of logic and template**, are allowed to be in a single file with inline template/styles.
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Execution & Verification Guidelines

- **Smart Testing & Verification**: To save time and system resources, do NOT run the entire unit test suite (`npm run test`) or trigger full production builds (`npm run build`) on every minor modification or every turn.
  - Only execute the full test suite and build when finalizing the implementation of a feature, before delivering the final task summary, or when explicitly requested by the user.
  - For minor changes, prioritize visual verification or reasoning, or run targeted tests instead of the entire suite.

## Styling & Theme Rules

- **NO Color Transitions for Themes**: NEVER add CSS color transitions (`transition: background-color ...`, `transition: color ...`, etc.) when changing themes. Themes must toggle instantly without delays or desynchronization between different elements.

## Git & GitHub Versioning Rules

- **NO Proactive Commits or PRs**: You are strictly **forbidden** from running git commits (`git commit`), pushes (`git push`), or Pull Request automation commands (such as `pr-creator.js`) on your own initiative.
- **Explicit Permission Required**: You must only perform commits or create Pull Requests when explicitly requested by the user in their active prompt. For default tasks, limit your actions to file modifications and wait for the user's validation before staging or committing any code.


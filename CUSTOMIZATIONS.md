# Docusaurus Customizations

This site uses several customizations on top of the default Docusaurus setup.

---

## 1. Monokai Pro Syntax Highlighting (via Shiki)

Code blocks use the **Monokai Pro** VS Code color theme rendered by [Shiki](https://shiki.matsu.io/) instead of the default Prism highlighter.

### How it works

1. `shiki` and `@shikijs/rehype` are installed as dependencies.
2. The full Monokai Pro VS Code theme JSON lives at `src/themes/monokai-pro.json`.
3. `docusaurus.config.ts` configures `@shikijs/rehype` as a rehype plugin for the `plugin-content-docs` instance, passing the Monokai Pro theme:

   ```typescript
   import rehypeShiki from "@shikijs/rehype";
   import monokaiPro from "./src/themes/monokai-pro.json";

   const shikiPlugin = [
     rehypeShiki,
     { theme: monokaiPro as any, defaultLanguage: "text" },
   ] as const;
   ```

   Then `rehypePlugins: [shikiPlugin]` is added to the docs plugin config.

   > **Note:** `defaultLanguage: "text"` ensures that fenced code blocks without a language (bare triple backticks) are still processed by Shiki and rendered with the Monokai Pro theme. Without this, language-less blocks fall back to Docusaurus's default Prism highlighter.

4. `src/theme/CodeBlock/Container/index.tsx` is a swizzled component that sets the Monokai Pro CSS variables (`--prism-color: #fcfcfa`, `--prism-background-color: #2d2a2e`) on a wrapper div so the code block container uses the dark background.
5. `src/theme/CodeBlock/Container/styles.module.css` provides the container styles (border radius, overflow).
6. `src/css/custom.css` includes a rule targeting `pre[class*="codeBlock"]` that forces the Monokai Pro background/foreground with `!important`, overriding the inline `--prism-*` variables Docusaurus sets on the `<pre>` element. This is necessary because Docusaurus injects light-mode Prism colors as inline styles, which would otherwise take precedence.
7. `tsconfig.json` has `"resolveJsonModule": true` to allow importing the theme JSON.

---

## 2. Slack-Style Inline Code

Inline `code` uses a reddish text on grey background style (similar to Slack), defined in `src/css/custom.css`:

- **Light mode:** `color: #e01e5a` on `background-color: #f0f0f0` with a `1px solid #e0e0e0` border
- **Dark mode:** `color: #e06b91` on `background-color: #3a3a3c` with `border-color: #4a4a4c`

```css
:not(pre) > code {
  color: #e01e5a;
  background-color: #f0f0f0;
  border: 1px solid #e0e0e0;
  border-radius: 3px;
  padding: 0.1em 0.3em;
  font-size: 90%;
}

[data-theme="dark"] :not(pre) > code {
  color: #e06b91;
  background-color: #3a3a3c;
  border-color: #4a4a4c;
}
```

---

## 3. Full-Width Doc Layout (TOC Pinned Far Right)

By default, Docusaurus centers the content + TOC in a fixed-width container, leaving empty space on both sides. Custom CSS in `src/css/custom.css` overrides this so the content fills all available space and the TOC stays pinned to the far right:

```css
@media (min-width: 997px) {
  main[class*="docMainContainer"] > .container {
    max-width: 100% !important;
    padding-left: 2rem;
    padding-right: 2rem;
  }

  main[class*="docMainContainer"]
    > .container
    > .row
    > .col[class*="docItemCol"] {
    flex: 1 1 0%;
    max-width: none !important;
    min-width: 0;
  }
}
```

> **Important:** The selector must target `main` (not `div`) because Docusaurus renders the doc container as a `<main>` element.

---

## 4. Code Block Copy & Word Wrap Toggle Buttons

When using Shiki as a rehype plugin, Docusaurus's built-in copy button and word wrap toggle are bypassed (Shiki processes code blocks at the rehype level before the Docusaurus `CodeBlock` component renders). A custom **client module** restores these buttons for all code blocks.

### How it works

1. **Client module** at `src/clientModules/codeBlockButtons.js`:
   - Exports `onRouteDidUpdate()` — a Docusaurus lifecycle hook that runs after every route change.
   - On each route change, it finds all `<pre>` elements with a `<code>` child that haven't been enhanced yet.
   - For each code block, it wraps the `<pre>` in a `<div class="code-block-enhanced">` and appends a button bar with two icon buttons:
     - **Word wrap toggle** — Toggles a `.wrap` class on the `<pre>` and `<code>` elements. Uses a Lucide `text-wrap` SVG icon. Inactive by default (word wrap is off).
     - **Copy button** — Copies the code text to clipboard and shows a checkmark for 2 seconds. Uses a Lucide `copy` SVG icon.
   - Icons are inline SVGs so no external dependencies are needed.

2. **Registered in `docusaurus.config.ts`:**

   ```typescript
   const config: Config = {
     clientModules: ["./src/clientModules/codeBlockButtons.js"],
     // ...
   };
   ```

3. **CSS in `src/css/custom.css`:**

   - Word wrap is **off** by default; toggled on/off via the `.wrap` class.
   - Buttons appear on hover in the top-right corner of each code block.
   - Active/copied states highlight with the site's primary color.

   ```css
   /* Word wrap off by default, togglable via .wrap */
   pre {
     white-space: pre !important;
     word-break: normal !important;
     overflow-x: auto;
   }
   pre.wrap {
     white-space: pre-wrap !important;
     word-break: break-word !important;
     overflow-x: unset;
   }

   /* Buttons appear on hover */
   .code-block-buttons {
     position: absolute;
     top: 8px;
     right: 8px;
     opacity: 0;
     transition: opacity 0.2s;
   }
   .code-block-enhanced:hover .code-block-buttons {
     opacity: 1;
   }
   ```

> **Why a client module?** Docusaurus `clientModules` run on every page and can export lifecycle hooks like `onRouteDidUpdate`. This is the correct pattern for adding DOM enhancements to content generated by rehype plugins (like Shiki), since that content bypasses React theme components entirely.

---

## Relevant Files

| File | Purpose |
| --- | --- |
| `src/themes/monokai-pro.json` | Full Monokai Pro VS Code theme JSON |
| `src/theme/CodeBlock/Container/index.tsx` | Swizzled container to set Monokai Pro CSS variables |
| `src/theme/CodeBlock/Container/styles.module.css` | Container CSS module (border radius, overflow) |
| `src/clientModules/codeBlockButtons.js` | Client module: copy button + word wrap toggle for code blocks |
| `src/css/custom.css` | Monokai Pro override, inline code styling, full-width layout, button CSS |
| `docusaurus.config.ts` | Shiki rehype plugin config + client module registration |
| `tsconfig.json` | `resolveJsonModule: true` for theme JSON import |

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # Install dependencies
pnpm start            # Start dev server on port 3003
pnpm build            # Build static site to /build
pnpm serve            # Serve the built site locally
pnpm clear            # Clear Docusaurus cache
pnpm typecheck        # Run TypeScript type checking
pnpm pull-submodules  # Pull latest from git submodules (code-repos/)
```

## Architecture

This is the documentation site for [ZenStack](https://zenstack.dev), built with **Docusaurus 3** and styled with **Tailwind CSS**.

### Content Structure

- `docs/` — Current (v3.x) documentation, auto-generated sidebar via `sidebars.js`
  - `modeling/` — ZenStack schema language (ZModel) documentation
  - `orm/` — ORM usage, access control, query API, plugins
  - `service/` — Query-as-a-Service (server adapters, client SDK, API handler)
  - `reference/` — Reference docs for ZModel language, CLI, server adapters, plugins
  - `recipe/`, `utilities/` — Recipes and utility documentation
- `versioned_docs/version-2.x/` — Archived v2.x docs (Prisma-based version)
- `blog/` — Blog posts (MDX files, custom blog plugin at `src/plugins/blog-plugin.js`)
- `code-repos/` — Git submodule (`zenstackhq/`) with linked code repositories used in docs

### Source Code Structure

- `src/pages/` — Landing page (`index.tsx`) and its `_components/` subfolder with feature sections
- `src/components/` — Shared React components (sponsorship, user logos, code blocks, etc.)
- `src/plugins/blog-plugin.js` — Custom Docusaurus blog plugin wrapper
- `src/theme/` — Docusaurus theme customizations (swizzled components)
- `src/css/custom.css` — Global CSS customizations
- `static/` — Static assets (images, icons)

### Versioning

The site has two doc versions:
- **current** (labeled `3.x`) — files in `docs/`
- **2.x** — files in `versioned_docs/version-2.x/` with its own sidebar at `versioned_sidebars/`

When adding documentation that applies only to v3, add it to `docs/`. The v2.x content is archived and should rarely need changes.

### Key Configuration

- `docusaurus.config.js` — Main site config: navbar, footer, Algolia search, Mermaid diagrams, Google Tag Manager
- `tailwind.config.js` — Tailwind config (used in landing page components)
- Mermaid diagram support is enabled for all docs pages
- Algolia search is configured for the `zenstack` index

### Blog

The blog is driven by a custom plugin (`src/plugins/blog-plugin.js`) that wraps Docusaurus's built-in blog plugin. Blog posts live in `blog/` as `.md` or `.mdx` files. Authors are defined in `blog/authors.yml`.

# Agent Rules for XIVBIS

This repository follows specific architectural and styling patterns. Please adhere to these rules when making changes.

## Styling & Components

1.  **Component Library**: Use [Mantine](https://mantine.dev) for all UI components.
2.  **Mantine Props First**: Prioritize Mantine's built-in style props (e.g., `p`, `m`, `bg`, `c`, `fw`, `fs`, `w`, `h`) for layout and appearance.
3.  **NO Inline Styles**: Never use the `style` prop in React components. If a style cannot be achieved via Mantine props, update the `MantineTheme` in `src/main.jsx`.
4.  **NO Custom CSS**: Avoid creating or modifying `.css` files. The project aims for zero custom CSS.
5.  **Icons**: Use `@tabler/icons-react` for all iconography.

## Data Management

1.  **Sets Data**: All BiS sets must be stored in `public/data/sets.json`.
2.  **Data Schema**: Maintain the existing schema for patches, categories, and roles to ensure filtering logic remains functional.
3.  **Editing Sets**: Run `yarn admin` for the local editor at `http://127.0.0.1:5174/admin.html`. It reads and writes `public/data/sets.json` directly through a dev-only endpoint (`tools/vite-plugin-admin-api.ts`), snapshots the previous file to `.admin-backups/` on every save, and is never part of `yarn dev` or the production build. Commit the resulting `sets.json` change to publish it.

## Deployment

1.  **GitHub Pages**: Ensure the `base` path in `vite.config.js` remains compatible with GitHub Pages sub-directory hosting.

## TypeScript

1.  **Strict Mode**: Maintain strict TypeScript mode and define interfaces for all data structures (e.g., `BiSSet`, `SetsData`).

## Package Management

1.  **Yarn**: Use `yarn` for all package management tasks (installing, adding, or removing dependencies). Always use `yarn` instead of `npm`.

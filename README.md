# XIVBiS

A sleek, minimalist, and data-driven FFXIV Best-in-Slot (BiS) masterlist.

![XIVBiS Preview](public/favicon.svg)

## Features

- **Modern UI**: Built with [Mantine](https://mantine.dev) for a clean, professional aesthetic.
- **Data-Driven**: All gearsets are managed via a simple JSON file—no code changes required to update BiS.
- **Type-Safe**: Fully implemented in **TypeScript** for robust reliability.
- **Auto-Deployment**: Integrated with GitHub Actions for seamless deployment to GitHub Pages.
- **Theme Support**: Native light and dark mode support, defaulting to system settings.
- **Dynamic Updates**: Automatically displays the last time the data was updated using the GitHub API.

## Adding/Updating Sets

To update the gearsets or add new categories (like a new patch or ultimate):

1.  Open `public/data/sets.json`.
2.  Add or modify a key in the main object (e.g., `"7.4 (current)"`).
3.  Add sets following this structure:
    ```json
    { "job": "PLD", "role": "Tank", "link": "https://etro.gg/gearset/..." }
    ```
4.  Commit and push to `main`. The site will update automatically!

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Credits

- Curated BiS sets sourced from **[The Balance](https://www.thebalanceffxiv.com/)**.
- Job icons provided by **[XIVAPI](https://xivapi.com/)**.
- Built by **tenyu**.

---
FFXIV is a trademark of Square Enix. This project is a community-run tool and is not affiliated with Square Enix.

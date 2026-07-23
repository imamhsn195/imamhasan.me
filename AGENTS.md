# AGENTS.md

## Cursor Cloud specific instructions

This is a static personal portfolio website (HTML, CSS, vanilla JS). There are **no dependencies to install**, no build step, and no package manager.

### Running the dev server

Serve the site locally with any static HTTP server from the repository root:

```bash
python3 -m http.server 8080
```

The site is then accessible at `http://localhost:8080/`.

### Linting / Testing / Building

- There is no linter, test framework, or build toolchain configured in this repo.
- Validation is done visually by opening `index.html` in a browser.
- External CDN resources (Ionicons, Google Fonts) require internet access to render icons and the Poppins font.

### Key files

| File | Purpose |
|---|---|
| `index.html` | Single-page site entry point |
| `assets/css/style.css` | Main stylesheet |
| `assets/css/custom.css` | Custom overrides |
| `assets/js/script.js` | Client-side interactivity (nav, sidebar toggle, modals) |
| `CNAME` | GitHub Pages custom domain (`imamhasan.me`) |

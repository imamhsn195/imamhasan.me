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
- External CDN resources (Google Fonts: IBM Plex Sans, JetBrains Mono) require internet access.

### Key files

| File | Purpose |
| --- | --- |
| `index.html` | Single-page portfolio entry point |
| `styles.css` | Main stylesheet |
| `script.js` | Nav, scroll reveal, contact form |
| `cv.html` | Print-friendly online CV |
| `resume-print.html` | Print-ready 2-page resume (Save as PDF from browser) |
| `CNAME` | GitHub Pages custom domain (`imamhasan.me`) |

# inkoprep.ca

The website for Inko Prep, tutoring and mentorship in Ottawa.

Plain HTML, CSS and JS with no build step. Everything that goes live is in `site/`.

## See it locally

```
python3 -m http.server 8000 --directory site
```

Then open http://localhost:8000

## Put it live

The site is on Netlify. Either drag the `site` folder onto the site's Deploys page, or connect this repo and Netlify will publish `site/` on every push (`netlify.toml` handles the settings).

## Working on it with Claude Code

Open this folder in Claude Code. `CLAUDE.md` explains how the pages are built, the brand and copy rules, the contact details and forms, and the ideas planned for the site.

# Inko Prep website (inkoprep.ca)

Static site for Inko Prep, Hussain Ghuloum's tutoring and mentorship business in Ottawa: science, math and MCAT for high school and university, Inko Prep Jr for grades 6 to 8, plus online branches for Kuwait and Dalhousie. Hosted on Netlify. No framework, no build step.

## Layout

`site/` is what gets deployed (`netlify.toml` sets `publish = "site"`).

| Path | What it is |
|---|---|
| `index.html` | Home, a long story page with chapters, `#prices`, `#calendar` (free calendar signup) and `#book` |
| `about.html` | Who's teaching |
| `courses.html`, `course/*.html` | Course finder, plus one page per uOttawa and Carleton course |
| `mentorship.html` | Mentorship |
| `shop.html`, `shop/*.html` | Shop: free study calendar, notebook + pomodoro theme, sticker sheet |
| `quiz.html` | "What's your study character?" quiz (art in `img/quiz/`) |
| `book/` | Themed slot picker for the free 20-minute diagnostic (`book/index.html`) and its hours file `book/availability.json` |
| `focus.html` | Short attention span page |
| `support.html` | Mental health support |
| `friend.html` | Bring a friend |
| `policies.html`, `calendar-thanks.html`, `404.html` | Policies, thank-you page, not found |
| `juniors/` | Inko Prep Jr (grades 6 to 8), with its own Google Form |
| `kuwait/` | Kuwait branch: `index.html` (Arabic, Kuwaiti dialect), `en.html`, `courses.html`, `courses-en.html`. Online only, WhatsApp contact |
| `dal/`, `kwt/` | Dalhousie promo pages (codes DAL20 and KWT20) |
| `fonts/` | Self-hosted woff2: Gaegu, Instrument Sans, Baloo Bhaijaan 2, IBM Plex Sans Arabic |
| `js/lenis.min.js` | Smooth scrolling, the only shared script |
| `_headers`, `_redirects` | Netlify cache headers; 301s from capitalmedprep.ca to inkoprep.ca; `/focus` and `/support` |
| `sitemap.xml`, `robots.txt`, `og-image.png`, favicons | SEO and sharing |

## How the pages are built

- Every page is self-contained: CSS in one `<style>` block, JS in `<script>` at the bottom. There's no shared stylesheet.
- The header, mobile menu and footer are copied into all 63 pages. A nav or footer change means editing every page. Do it with a script across `site/**/*.html`, then check how many files changed.
- Pages in subfolders use root-absolute links like `/about.html`. The exception is `course/` pages, which link to each other with relative links. Root pages use relative links. Keep it that way when copying markup between them. Every local link resolves right now, so check new ones.
- Each `<body>` has `data-page="..."` to highlight the current nav item.
- Colours are CSS variables on `:root`. Main ones: `--ink #111111`, `--paper #FFFFFF`, `--sun #FFCF3F` (main accent), `--coral #FF7A5C`, `--sky #6CB6F5`, `--mint #A8E39A`, `--lilac #B69CFF`, `--pink #FF9CC2`, with `-t` tints of each, `--text #3D3D3D`, `--muted #6B6B6B`, `--line #E6E2DA`.
- Look: white pages, black hand-drawn line art, small pops of colour, the yellow highlighter mark. Gaegu for headings and labels, Instrument Sans for body text.

## Booking and contact

- Main booking: `/book/`, a slot picker in the site's own style. The visitor picks a day and a 20-minute time (shown in their time zone), fills in a short form, and it goes to Netlify Forms as `diagnostic-booking`. It is a request: Hussain emails within one business day to confirm. Every main-site booking button points here (`?course=BIO+1131` on course pages pre-fills the "help with" box). `juniors/`, `kuwait/`, `dal/` and `kwt/` keep their own links.
- Hours and blocked times live in `site/book/availability.json` (Ottawa time, 24h). To block a time after confirming it, copy the `slot-ottawa` value from the Netlify form email (like `2026-11-19 18:20`) into `blockedSlots`. Whole days go in `blockedDates`. Mistyped JSON makes the picker show an email fallback, so check it after editing.
- In Netlify: Forms, Notifications, add an email notification to booking@inkoprep.ca for `diagnostic-booking`, otherwise requests only show in the dashboard.
- Old booking form (kept for Dal, Kuwait and the no-JavaScript fallback): https://forms.gle/rrGaiQvjPC1QqRD37
- Juniors form: https://docs.google.com/forms/d/e/1FAIpQLSfdhh3FD9BGggNXBUCmNn8ojr3b_vsHuQy0wxdYWsO9z11MXg/viewform
- Email: booking@inkoprep.ca
- Ottawa phone and text: 343-553-9369
- Kuwait WhatsApp: +965 9673 5835 (`https://wa.me/96596735835`)
- Instagram: @capitalmedprep (until it's renamed)

## Copy rules

- No em dashes anywhere. Use commas, colons or periods instead.
- Voice: short, warm, human, mostly lowercase. Nothing that sounds AI-written.
- Never mention ADHD or any diagnosis. Say "short attention span" only.
- Hussain is not a medical student or doctor, so no "MD" or "med student" claims. These are fine: "admitted to uOttawa medicine", "tutoring since 2020", "uOttawa Biomedical Science grad".
- No made-up testimonials, reviews, stats or percentages.
- Kuwait pages use natural Kuwaiti dialect.
- Dal pages say "Kuwaitis" or KWT, never KMP.
- Never publish student numbers, an OEN or a personal email.

## The teaching method (use it in copy)

Motto: "we learn better by teaching." Students learn a topic on their own, come back and teach it to Hussain, and he questions and scores them, with more points for their own analogies. He keeps asking "why?" until they say "ok, stop!". It's coaching, not tutoring, and meant to be long-term rather than cramming.

## Preview and deploy

- Preview: `python3 -m http.server 8000 --directory site`, then open http://localhost:8000
- Deploy on Netlify, either way works:
  - drag the `site` folder onto the site's Deploys page, or
  - connect this repo in Netlify. The publish folder is `site` and there's no build command.
- Before a deploy:
  - check changed pages at 390px wide
  - check links from subfolder pages
  - run `grep -rlP "\x{2014}" site` to catch em dashes

## Ideas Hussain has mentioned for the site

- Timer with a 2-minute quick start, and a planner (both started as his Obsidian plugins)
- Paid monthly premium subscription
- Amazon affiliate links and study packages in the shop
- A "factory" goal-setting game and a systems-building section
- A page on his teaching method, from his diagnostic monologue
- Daily quiz that checks answer depth and key terms
- Live quiz rooms with QR and session codes for club presentations
- Promo code field in the main booking form
- A link to `/juniors/` from the main site

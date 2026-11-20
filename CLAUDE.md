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
| `book/` | Slot picker for the free 20-minute diagnostic (`book/index.html`) and its hours file `book/availability.json` |
| `focus.html` | Short attention span page |
| `support.html` | Mental health support |
| `friend.html` | Bring a friend |
| `policies.html`, `calendar-thanks.html`, `404.html` | Policies, thank-you page, not found |
| `juniors/` | Inko Prep Jr (grades 6 to 8), with its own Google Form |
| `kuwait/` | Kuwait branch: `index.html` (Arabic, Kuwaiti dialect), `en.html`, `courses.html`, `courses-en.html`, `quiz.html` + `quiz-en.html` (quizzes), `calendar-thanks.html` + `calendar-thanks-en.html`. Online only, WhatsApp contact |
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

- Main booking: `/book/`, a slot picker in the site's own style. The visitor picks a day and an hour (times are always on the hour), chooses which city's time to see (Ottawa, Hamilton, London ON, Halifax, Kuwait, Dublin, London UK; `?city=kuwait` etc. preselects one), fills in a short form (name, email, help with, promo code), and it goes to Netlify Forms as `diagnostic-booking`. It is a request: Hussain emails within one business day to confirm. A button on the page opens the full Google Form instead. Every main-site booking button points here (`?course=BIO+1131` on course pages pre-fills the "help with" box). `juniors/`, `kuwait/`, `dal/` and `kwt/` keep their own links.
- Bookable hours live in `site/book/availability.json` (Ottawa time, 24h). Busy times come from Hussain's calendar: `netlify/functions/busy.mjs` (served at `/api/busy`) reads the calendar's private iCal link from the `CALENDAR_ICS_URL` environment variable in Netlify and returns only start and end times, never event names. Anything busy is hidden from the picker within about 5 minutes, so a confirmed session only needs to go in the calendar. Events marked "free" and cancelled events are ignored. If the variable is missing or the calendar can't be read, the picker falls back to the hours file alone. Never put the iCal link in this repo.
- In Netlify: Forms, Notifications, add an email notification to an inbox Hussain checks for `diagnostic-booking`, otherwise requests only show in the dashboard.
- Old booking form (kept for Dal, Kuwait and the no-JavaScript fallback): https://forms.gle/rrGaiQvjPC1QqRD37
- Kuwait quizzes: `kuwait/quiz.html` (Arabic) and `quiz-en.html`. Three sections: الثانوي / high school (biology, chemistry, physics, math), القدرات / Qudurat (math, chemistry), الجامعة / university (8 courses). High school and Qudurat questions are written for Kuwait in Arabic and English; university quizzes reuse the Canadian course page quizzes (questions stay in English, interface in Arabic). Quiz data is JSON in `#kq-data`. `#hs`, `#qudurat`, `#uni` jump to a section and `#hs-bio`, `#q-math`, `#uni-orgo` etc. open a quiz. The result screen has a WhatsApp button with the score pre-filled.
- Kuwait study calendar: `downloads/inko-prep-kuwait-calendar-ar.pdf` and `-en.pdf` (Dec 2026 to Aug 2027, MoE 2026/2027 school dates, Islamic holidays marked approximate). Signup is the `kuwait-calendar` Netlify form in the `#calendar` section of `kuwait/index.html` and `en.html` (fields: email, first-name, stage, language). Add a Netlify email notification for it too. Preview images are `img/kw-cal-{ar,en}-{cover,jan,jun}.jpg`.
- Juniors form: https://docs.google.com/forms/d/e/1FAIpQLSfdhh3FD9BGggNXBUCmNn8ojr3b_vsHuQy0wxdYWsO9z11MXg/viewform
- No email address on the site: booking@inkoprep.ca was never set up, so don't add it back. Contact is text 343-553-9369 (Ottawa pages, `sms:+13435539369`) or WhatsApp (Kuwait pages).
- Ottawa phone and text: 343-553-9369 (in every footer outside `kuwait/`)
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
- Deploy on Netlify by connecting this repo (publish folder `site`, no build command). Netlify installs `package.json` and bundles `netlify/functions` on each deploy.
  Dragging the `site` folder onto the Deploys page still publishes the pages but skips the calendar function, so the picker then ignores the calendar.
- Preview with the calendar: `netlify dev` (Netlify CLI) with `CALENDAR_ICS_URL` set locally. The plain `http.server` preview works too, just without busy times.
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
- A link to `/juniors/` from the main site

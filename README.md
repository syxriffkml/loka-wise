# LOKA WISE v2

A bilingual Svelte 5 + TypeScript booth website for custom business-location reports and optional consultation. Retirees starting or running businesses are the primary audience; other SMEs starting, relocating or expanding are the secondary audience. F&B and retail are business categories within those audiences.

This is a separate copy of the original LOKA-WISE project. The original source and assets were not edited. The original chat, **Loka Wise**, README, verification notes, source and tests informed this revision.

## Run the booth demo

1. Open this `LOKA-WISE-v2` folder, or extract the ZIP completely first.
2. Double-click **Start Demo.cmd**.
3. Open **http://127.0.0.1:4318/#home** in Chrome, Edge or the Codex browser.
4. Keep the server window open. Stop it with Ctrl+C when finished.

Port **4318** is v2. The original remains on **4317**. Node.js 22.12+ is required; the launcher can also use this computer's bundled Codex runtime. The included `dist` build runs without installing packages. Do not open `dist/index.html` directly.

Saved snapshots, calculations, PDF generation and local demo forms work without a backend. Map background tiles and Google Fonts require internet; saved place data and fallback fonts remain available. Supabase and payments are deliberately disabled/deferred in this edition. Nothing is submitted to a consultant.

## Map pins and place details

Larger category-coded SVG pins replace the circles. Tap a pin for its mapped type, area, approximate straight-line distance from the study point and source date. Address, cuisine, hours, operator, access and contact links appear where the saved OpenStreetMap tags provide them. Sparse records explicitly identify missing information. Zoom in to separate nearby pins; longer popups scroll within the map.

## Illustration follow-up

Services now includes a shopfront/map scene and illustrations for its two choices. Both request introductions show the matching report or conversation artwork, and My workspace has a saved-briefs folder illustration. These responsive SVGs use the same navy/gold style as the location tools.

## Technical-tool refinement

The map and analysis pages have been revised to reduce the amount of explanation a presenter needs to provide:

- Area cards show the current selection; category buttons combine labels and real snapshot counts, with a live map-status line.
- Three observation cards connect nearby businesses and access features to practical questions, while keeping customer demand explicitly unknown.
- The calculator separates **Try an example** from **Use my numbers**. Each retains its own edits during the current page session; reloading starts a fresh scenario.
- Inputs are grouped into money coming in and money going out. The leading result is the number of customers per day needed to cover operating costs, with a plain-language gap explanation.
- Mobile and tablet inputs have a compact result bar showing the required and estimated customer counts, plus a **See result** shortcut. It stays with the inputs and does not cover the full result section.
- Empty or invalid estimates pause results and disable the PDF action. Zero customers and zero fixed costs remain valid where supported by the model.
- Custom SVG map, shopfront, report and conversation illustrations support the task. Selection styles, keyboard focus, hover feedback and short result/save animations provide feedback; reduced-motion CSS disables those animations.
- Brief reviews show a visual business/location card. Area-specific requests carry the selected location; **Request another location** starts blank, even after an earlier contextual request.

These are design and functional improvements, not evidence of usability validated with target customers. The next useful test is to let a first-time visitor try a task without narration and observe where they hesitate.

## What changed

- Preserved the original logo, navy/gold brand, uppercase **INSIGHTS FOR A STRONGER TOMORROW**, full-width commercial-street hero and oversized LOKA WISE footer. No cursive fonts or retirement-home imagery.
- The story-led homepage now offers clear report and guidance paths. Services also explains these two starting points.
- Request forms use **Your brief → Review & save**, with editable summaries and an explicit local-only consent statement.
- Consultation lets visitors choose **Find or compare locations** or **Understand my report**, and select **Help me choose** without inventing an address. Preferred dates are optional and never confirmed bookings.
- Business stages include starting/running after retirement, existing operations, relocation and expansion. Budget wording works for all of them.
- Area-specific calls to action carry SS15 or TTDI into the request. Fresh direct requests start without an assumed location.
- The workspace confirms a successful local save, identifies fictional samples and avoids payment/account distractions.
- Mobile controls are larger, labelled map filters sit above the map, scenario results stack clearly, and the right-side navigation drawer retains keyboard focus containment and Escape dismissal.
- v2 uses separate local-storage keys (`loka-v2-demo-requests`, `loka-v2-language`). Its original hosting registration was not retained as an active v2 registration. Nothing was published.

## Customer-journey review and concrete improvements

| Journey | Original friction observed | v2 improvement |
| --- | --- | --- |
| Retiree seeking guidance | The form required an address and date; an undecided visitor had to type a special phrase into the location field. | Explicit location-help choice, optional date, simple business profile and review step. |
| SME expanding or relocating | After viewing TTDI, the report request still defaulted to SS15. The homepage's single leading action favoured consultation. | Contextual area handoff, direct report action, relocation/expansion choices and a reviewable brief. |
| Both | A brief toast was the main save feedback; account setup was a distraction for a local booth demo. | Persistent save receipt during the session, clear local-only status and a workspace showing saved requests. |

These improvements came from inspecting the original site and then executing the v2 journeys in the browser. See **VERIFICATION.md** for the exact evidence and limitations.

## Suggested booth walkthroughs

**Retiree — Bahasa Malaysia, mobile:** Home → Help me choose a location → switch to BM → enter fictional business details → select starting/running after retirement → Bantu saya memilih → leave the date blank → Semak permintaan saya → Simpan permintaan demo → reload the workspace.

**SME — English, desktop:** Location insights → SS15, then TTDI → Retail filter → Explore this report → try an example or enter your own estimates → inspect break-even and scenario limitations → Download sample PDF → Request my custom report → verify TTDI → choose expansion or relocation → review and save a fictional brief.

Use **Reset demo** in My workspace between booth visitors. It clears only v2's local demo records and restores the fictional examples. Saved demo requests are browser-local; the ZIP does not contain requests created during testing.

## Development

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm test
pnpm test:ui
pnpm build
pnpm demo
```

The ready-built demo is served on 4318; Vite's development command prints its own URL. Rebuild after source edits, then reload the ready-built preview.

- `src/Story.svelte`: homepage and service storytelling.
- `src/RequestForm.svelte`: bilingual two-step brief and review.
- `src/App.svelte`: navigation, session scenario drafts and local workspace.
- `src/Explorer.svelte`, `ReportTools.svelte`, `Scenario.svelte`: map controls, sample evidence and business calculations.
- `src/ToolIllustration.svelte`: code-native navy/gold SVG illustrations.
- `src/lib/scenario-inputs.ts`: empty/invalid input handling around the preserved calculation model.
- `src/style.css`: preserved base styles; `src/v2.css`: v2 branding and requests; `src/technical.css`: responsive technical tools, focus and motion.
- `src/lib/model.ts` and `report.ts`: preserved calculations and PDF generator. `Map.svelte` and `place-details.ts`: category pins and bilingual details from the saved evidence.
- `src/lib/pricing.ts`: provisional services/prices; the full-report starting fee remains RM4,500, from the existing shared pricing JSON.
- `src/lib/backend.ts`: explicitly disabled in the v2 booth edition. Existing server integration source remains under `supabase/` for a separately scoped future task.

Dependencies were reused from the existing locked local cache; no new package versions were introduced. Automated checks were run with the local Node executables. The package manager's registry metadata/attestation checks could not complete in the restricted network environment; the application build and tests completed using the available packages.

## Data and interpretation

`public/data/locations.json` contains actual public OpenStreetMap/Overpass snapshots: **250 features for SS15**, **306 for TTDI**, retrieved **2 October 2026**. Raw responses, query details and timestamps are preserved. Counts can be incomplete, duplicated or outdated. Parking features are not parking spaces; transit features are not service frequency. An 800 m radius is not a measured walking catchment.

Sample companies and booth requests are fictional. The current commercial-street image is illustrative; provenance remains in `ASSET-NOTES.txt`. Prices are provisional starting fees; scope, data availability and final quote must be agreed before work begins.

Scenario inputs are editable assumptions, not validated local forecasts:

- Monthly sales = customers/day × spend × opening days.
- Operating surplus = sales × contribution margin − fixed costs.
- Break-even customers/day = fixed costs ÷ spend ÷ contribution margin ÷ opening days, rounded up.
- Sensitivity changes customer volume by ±25%; it is not a confidence interval.

Tax, financing, capital expenditure and startup costs are excluded. Real recommendations require verified rent, customer demand, measured footfall and professional review. No success score or guaranteed sales is claimed.

Sources: [OpenStreetMap / ODbL](https://www.openstreetmap.org/copyright), [Overpass API](https://overpass-api.de/api/interpreter), [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/), and the user-supplied LOKA WISE brand/business materials referenced in the original chat.


## Visual report update

The sample report now leads with real snapshot statistics, a category-composition chart and the six most mapped business types, followed by a plain-language takeaway. The scenario includes a diverging bar chart with a labelled zero line. Charts update with the selected area or entered assumptions; no demand, footfall, rent or sales observations have been invented.

PDF downloads are now two-page navy/gold reports with the original logo, statistics, two evidence charts, assumptions, a sensitivity chart, source links and the uppercase brand tagline. English and Bahasa Malaysia exports retain the current area and five scenario inputs. The PDF logo is embedded from the original `public/logo.png` so export does not need an image request.

## Git and Vercel updates

The production site is https://loka-wise.vercel.app/ and the existing Vercel
project is https://vercel.com/syxriffkmls-projects/loka-wise.

This folder is the repository root. Commit source changes, assets, package.json,
pnpm-lock.yaml and vercel.json. Dependencies, generated dist output, local
verification screenshots and environment secrets are excluded by .gitignore.

The public repository https://github.com/syxriffkml/loka-wise is connected
to the existing Vercel project. Use main as the production branch. Push reviewed updates to main to deploy;
use separate branches for preview deployments. Check the deployment status
and the public website after each release. No environment variables are
required for the current local-demo functionality.

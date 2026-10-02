# Verification — LOKA WISE v2

Verified on **3 October 2026 (Asia/Kuala_Lumpur)**. Local v2 preview: **http://127.0.0.1:4318/#home**.

## Preservation and scope

- A separate `LOKA-WISE-v2` copy was created before source edits.
- SHA-256 comparison of the original project's 40 source, asset and configuration files found **0 changes**.
- Original logo, commercial-street image, raw/saved OpenStreetMap data, scenario formulas and PDF generator remain intact.
- Original chat **Loka Wise** was read, including the two audience definitions, full-width hero preference, uppercase tagline, right-side drawer, deferred integrations and previous browser permission failures.
- v2 has a separate port and browser-storage keys. Original source and original browser demo records were not edited.
- No Supabase connection, payment, hosted deployment or external customer submission was performed. The inherited hosting registration is not active in v2.

## Map pins and popups — 3 October 2026

- Build and Svelte/TypeScript checks passed with 0 errors/warnings. All **24 UI, PDF and popup tests** passed across 3 files, including four new tests covering sparse records, BM details/contact links, safe handling of tag text/URLs, and straight-line distance. The unchanged model/data tests retain their earlier four passing results.
- Actual desktop browser: selected F&B and clicked Sinbad. Its popup showed Restaurant, SS15/Subang Jaya, approximately 300 m from the study point, missing-data text and the OSM source link.
- Selected Retail and clicked the first 7-Eleven record: observed its street, 24/7 hours, operator, phone and website/call/source links. Contact links were inspected without placing a call.
- At 390px in BM, opened 7-Eleven using Enter. Translated details rendered; the scrollable popup fit inside the map and the page had no horizontal overflow.
- The initial browser tab hit two debugger synchronization timeouts. A fresh tab in the same browser worked; no permissions were changed.
- Screenshots: `verification/map-pin-details-desktop.jpg` and `map-pin-details-mobile-ms.jpg`.

## Illustration follow-up — 3 October 2026

- Added responsive SVG artwork to Services, the custom-report introduction, the consultation introduction and My workspace.
- Production build passed; Svelte/TypeScript check returned **0 errors, 0 warnings**. This presentation-only follow-up did not rerun the previously passing 24 functional tests listed below.
- Actual browser inspection: all four pages at 1440px in English; both forms and workspace at 390px in Bahasa Malaysia; all four pages at 320px in Bahasa Malaysia had matching document/viewport widths. Services was also visually inspected at 320px.
- Artwork is decorative and hidden from assistive technology. Existing headings, form controls, bilingual text and actions remain the functional content. The service-card hover motion respects reduced-motion preferences.
- Screenshots: `verification/illustrated-services-desktop.jpg`, `illustrated-workspace-desktop.jpg`, `illustrated-consultation-mobile-ms.jpg`.

## Automated checks

| Check | Result |
| --- | --- |
| Svelte / TypeScript check | **0 errors, 0 warnings** |
| Production Vite build | **Passed**; includes revised technical tools and mobile result bar |
| UI, PDF and place-popup tests | **24 passed** across 3 test files |
| Calculation and source-data tests | **4 passed** |

The tests cover routing, drawer dismissal, skip-link behavior, malformed storage, failed saves retaining editable details, TTDI context handoff, optional consultation date/location, review/edit/save, persistence, separation of report and consultation dates, language switching, reset, current scenario inputs passed to the PDF generator, EN/BM PDF content, formulas and snapshot integrity.

The UI tests use jsdom and mocked Leaflet; they do not substitute for the browser observations below. The final refinement suite includes separate scenario drafts, blank/invalid input gating, current personal values passed to PDF generation, category/count feedback, language preservation and the blank handoff for another location.

## Technical-tool refinement — additional browser observations

The following checks were performed after the self-explanatory tool redesign, using the actual 4318 preview. The earlier walkthroughs below describe the first v2 revision.

- **Desktop 1440 × 1000, EN:** selected TTDI and Retail; status showed **167 mapped features**, map tiles/markers rendered, and keyboard Enter selected the category with a visible focus outline. Analysis retained TTDI.
- **Scenario:** the +10 control changed the example from 65 to 75 customers/day, with RM35,100 sales and RM6,815 operating surplus. **Use my numbers** started empty with results withheld and PDF disabled. Entering 40 customers, RM20 spend, 25 days, 60% margin and RM15,000 fixed costs produced **RM20,000 sales**, **−RM3,000 operating result**, and **50 customers/day** needed, with an explicit 10-customer gap. Switching back restored the separate example.
- **Mobile 390 × 844, BM:** category feedback showed TTDI / Runcit / 167. The final compact calculator bar showed 53 required customers/day and an updated estimate of 75/day. Its shortcut moved focus to the full result; the bar remained with the input section. A separate cost change to RM22,000 produced 73/day needed, an 8-customer gap from 65/day, and −RM2,227.
- **Retiree consultation:** fictional **Aminah — Demo UI**, retirement business stage, RM80,000, undecided location and no date. The visual review card displayed the name and location-help state. Local save succeeded and the request remained after reload.
- **SME report:** chose TTDI, opened the contextual report request, and observed TTDI in the form. Fictional **Ruang Retail — UI Demo**, retail / expansion / RM150,000, was reviewed, saved locally and remained after reload.
- Both new QA requests were removed through the demo reset control; the two original fictional examples were restored. No customer data was submitted externally.
- **320px BM:** explorer, analysis and custom request had document widths equal to the available viewport width in the inspected states. **768 × 1024 BM:** the two-column input grouping and result section were visually inspected without page overflow.
- Escape closed the right-side mobile drawer and restored focus to its menu button. The report/calculator shortcuts moved focus to their intended headings/result.
- No errors were returned by the browser console inspection. SVG illustrations are decorative; controls retain text labels and pressed states. Reduced-motion behavior is implemented in CSS; an OS preference toggle and a full screen-reader audit were not performed.
- Original-project SHA-256 audit repeated: **40 checked, 0 changed**.

Refinement evidence is in `verification/refined-desktop-map.jpg`, `refined-desktop-scenario.jpg`, `refined-mobile-map-ms.jpg`, `refined-mobile-controls-ms.jpg`, `refined-mobile-result-ms.jpg`, `refined-mobile-review-ms.jpg`, and `refined-desktop-review.jpg`.

These checks verify the observed functionality and layouts. They are not a usability study with retirees or SME owners. Browser PDF delivery remains unverified as described below.

## Earlier v2 browser observations

Browser access to the original **4317** preview succeeded on the first local-site attempt in this chat. The previous saved-permission loop did not recur. No permission setting was changed or bypassed. v2 on **4318** was then inspected directly using the same browser.

### Retiree journey — mobile, Bahasa Malaysia

At **390 × 844**:

1. Opened the consultation route and switched to BM.
2. Entered fictional **Aminah — Demo Pameran**, chose starting/running a business after retirement, and entered an RM80,000 budget.
3. Selected **Bantu saya memilih**, with no address or preferred date.
4. Reviewed the location-help choice, budget, profile and flexible date.
5. Saved the local request and observed **Permintaan demo disimpan**, with explicit no-transmission/no-booking/no-payment copy.
6. Reloaded and verified the request remained in the workspace.

### SME journey — desktop, English

At **1440 × 1000**:

1. Opened the explorer, viewed SS15 and selected TTDI.
2. Selected the Retail map filter. Real map tiles, source attribution and markers rendered. A DOM inspection confirmed the current map's ten tile images had loaded with 256px natural widths.
3. Observed TTDI counts: 118 F&B, 167 retail, 1 transport and 20 parking features.
4. Opened the TTDI analysis and changed customers/day from 65 to 100. Monthly sales changed to **RM46,800**, operating surplus to **RM14,420**, with break-even remaining **53 customers/day** under the unchanged cost assumptions.
5. Opened **Request my custom report** and observed **TTDI** in the location field. The original site's incorrect SS15 handoff was reproduced before this fix.
6. Entered fictional **Ruang Retail — Fictional Demo**, chose expansion and RM150,000, reviewed and saved it.
7. Reloaded and verified both fictional walkthrough records persisted.
8. Reset only these v2 demo records through the workspace UI and verified the two fictional example requests were restored.

### Responsive and navigation checks

- Desktop and mobile hero inspected with the existing street photograph and text overlay.
- At **320px** the first pass exposed an 11px horizontal overflow in the header. Padding/gaps were corrected and the production build was reloaded.
- Final **320px** EN/BM home, plus BM services, custom request, reports, explorer, methodology and workspace: document scroll width equalled viewport content width; no horizontal page overflow in these checks.
- **768 × 1024** BM services inspected visually; no horizontal overflow.
- **1101px** desktop-navigation breakpoint checked in BM; no horizontal overflow.
- Right-side drawer inspected at 390px. Escape closes it and restores focus to Open menu; Shift+Tab from the first control reaches the final drawer link, and Tab from that final link returns to Close navigation. Body scroll locking restores correctly.
- Browser viewport override was reset at handoff.

## PDF download limitation

The EN and BM PDF-generation tests produce real `%PDF` content with source attribution and explicit forecast limitations. The UI test confirms current assumptions are passed to the generator.

In the actual browser, the download button was clicked after setting TTDI to 100 customers/day. The download-event listener **timed out after 15 seconds**. No browser error was reported, but no downloaded file was captured or found in the normal Downloads folder. Therefore **browser download delivery is not marked verified**. This is separate from the successful PDF-generation checks. The UI now says the PDF was *prepared* and asks visitors to check their browser downloads instead of claiming that a file was definitely downloaded.

Before the booth, manually confirm a sample PDF download in the presentation laptop's normal Chrome/Edge browser. No repeated permission loop was attempted.

## Screenshots

Files are in `verification/`:

- `desktop-home.jpg`, `mobile-home.jpg` — the hero and two primary paths.
- `mobile-drawer.jpg` — the right-side menu.
- `mobile-retiree-review-ms.jpg`, `mobile-retiree-saved-ms.jpg` — the BM retiree walkthrough.
- `desktop-ttdi-map.jpg`, `desktop-sme-scenario.jpg` — real map features and editable assumptions.
- `desktop-sme-review.jpg`, `desktop-sme-saved.jpg` — the SME report request.
- `tablet-services-ms.jpg` — BM services on tablet.

Walkthrough screenshots were captured during the interactions. Some precede the final minor wording/status-label refinements; the packaged production build contains those refinements. Screenshots are evidence of those specific views, not a claim of exhaustive device or assistive-technology testing.

## Remaining limits

- Map background tiles and Google Fonts need internet; no offline tile cache was bundled.
- Service pricing is provisional. Real market validation, measured footfall and verified rents are outside this demo.
- Only local request persistence is implemented for the booth. No appointment availability, notification, consultant response or payment is implied.
- The package manager's registry metadata/attestation checks could not finish in the restricted network environment. Existing locked packages were available locally; check, build and tests ran successfully with them.

## Report charts and branded PDF — 2026-10-03

- Replaced the tools-first introduction with a location report overview, four summary statistics, feature-composition donut, top-six business-type bars and a practical takeaway. The scenario comparison now has a visible zero line and responsive text labels.
- Screen and PDF use the same snapshot aggregation. Percentages identify their denominator; mapped features remain distinct from verified businesses, demand and observed sales.
- Rebuilt PDF generation as two branded pages with the original embedded logo, navy/gold chart panels, all five current assumptions, sensitivity bars, source attribution/links and the uppercase tagline. The supplied TTDI export was inspected first (65 customers, RM18, 26 days, 65% margin, RM16,000 fixed costs); the updated TTDI sample uses those same inputs.
- Production build passed. Final Svelte check: zero errors and warnings. Existing Vitest suite: 24/24 passed for the report implementation; the final mobile chart text/layout refinement was then checked with Svelte, rebuilt and visually inspected.
- Rendered and inspected every page of TTDI English and SS15 Bahasa Malaysia PDFs. Both have two pages, readable charts, intact logos and no observed clipping. Poppler emitted local fallback-font configuration warnings; the rendered pages were visually sound.
- Browser access succeeded on a fresh background preview tab at 4318. Desktop TTDI charts showed 306 features / 285 business features, and SS15 showed 250 / 242. Mobile BM charts were inspected at 390 x 844; page scroll width and client width both measured 375 px (no horizontal overflow). Changing customers from 65 to 40 updated the scenario chart to -RM6,874 / -RM3,832 / -RM790. Final mobile chart labels and zero line were visually checked after rebuild. No browser console errors were returned.
- Screenshots: report-charts-desktop.jpg, report-charts-mobile-ms.jpg, report-scenario-mobile-ms.jpg. Checks cover these views and generated PDFs, not a claim of target-customer usability validation.
- Original project preserved. No ZIP generated or updated. The embedded original logo increases the main bundle; Vite reports a chunk-size advisory. Supabase and payments remain deferred.

# Local QA patch — 2026-09-27

Implemented the requested cross-site homepage, country-page, services CTA, Experts, About and Contact mobile/visual consistency fixes in this local snapshot.

## One source asset still required
The request to replace **The City Bank** image in Experts → Distinguished Visitors could not be completed because the supplied uploads contain screenshots only and no replacement City Bank photograph. The existing City Bank image is intentionally left untouched rather than fabricating/cropping a replacement.

## Asset localization
Embedded HTML images, external flag images, external Unsplash images and CSS data-image URLs were moved/repointed to local `/assets/` resources where applicable. External non-image services such as Google Maps embeds and font/script CDNs are not image assets and remain external.


## Round 2 updates — 2026-09-27
- Restored visible country-page fact icons on mobile.
- Replaced duplicated service imagery with more appropriate local assets.
- Removed Oxford certificate forced rotation override so it can be fixed manually later.
- Switched experts page partner image reference to /assets/localized/embedded/sfde4tersgrfdv.jpg and included that asset in the patch.
- Replaced "The Files They Signed Off" gallery with the 8 provided cleaned images.
- Updated About Us mission/vision images using the 2 provided office photos.
- Improved homepage mobile stats balance with subtle muted decorative motifs on each row.
- Removed mobile registration-card corner triangles and fixed footer overlap.
- Reworked homepage CEO mobile block to use a portrait-first 3:4 image area.
- Improved experts mobile personnel-image framing and width handling.

## Round 3 — Homepage CEO mobile margin
- Removed the accidental double mobile gutter around the CEO card.
- The CEO card now uses the same 16px outer page margin as the rest of the mobile homepage.

## R5 corrections — 2026-09-27
- Mobile registration licence cards no longer use a forced landscape ratio; height/bottom spacing increased to prevent footer/field overlap.
- Homepage mobile stats use four distinct subtle local SVG motifs, one per row.
- Australia mobile hero heading is constrained to two lines only.
- Why Choose Us mobile item titles are centered.
- Canada flag SVG is now fully self-contained and no longer depends on an external image reference inside SVG.
- Homepage CEO mobile card removes the blurred pseudo-background/padding artifact and uses a clean 3:4 portrait frame.
- Country-page Visa Types cards center icon + heading on mobile.
- Services page is restored to the original six Unsplash image choices, with HTML pointing to locally stored filenames. The deployment block downloads these exact originals into assets/services/localized before commit.
- Success Stories mobile cards become image-first stacked cards; the six named student portraits use URL-safe local filenames to avoid failures caused by spaces.
- Experts/About mobile hero background positioning now crops toward actual artwork instead of the empty center of the panoramic images.
- City Bank HTML uses the exact requested /assets/localized/embedded/sfde4tersgrfdv.jpg path with a new cache-busting query. R5 intentionally does not overwrite that file's bytes.
- The Files They Signed Off keeps all original titles/captions and uses the eight new supplied images, plus compact blue statistic overlays.
- About Mission uses mission.jpg and About Vision uses vision.jpg (previous swap corrected).


## R6 — Canada flag + success stories mobile gap
- Replaced all references to `/assets/localized/flags/ca.svg` with the proven local `/assets/destinations/canada-flag.webp`.
- Fixed the Success Stories mobile pagination regression where R5's `display:grid!important` overrode hidden paginated cards and left a huge invisible layout gap.
- Added explicit `[hidden]{display:none!important}` for success-story cards and intrinsic mobile list sizing.
- Bumped relevant stylesheet query versions to R6 for cache busting.

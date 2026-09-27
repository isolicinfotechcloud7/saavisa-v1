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

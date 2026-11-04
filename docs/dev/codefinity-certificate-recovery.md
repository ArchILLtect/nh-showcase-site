# Codefinity Certificate Recovery — November 4, 2026

## Purpose and scope

The older `ArchILLtect/SRShowcase` portfolio referenced seven 2023
Codefinity certificate images hosted on Imgur. The owner recovered original
certificate images, including a completed learning-track credential that was
not visible in the current provider dashboard during the recovery review.

The recovered images are now versioned locally in
`public/images/certificates/`. The live source of certificate card metadata
is `public/data/certificates.json`, rendered by
`src/pages/Certificates.jsx`. No Codefinity subscription, provider
account status, or current external verification endpoint is asserted here.

## Recovered credentials

| Credential | Completion date | Display type | File |
| --- | --- | --- | --- |
| Introduction to JavaScript | July 18, 2023 | Course | `Codefinity-Introduction_to_Javascript_Certificate.png` |
| Ultimate HTML | July 20, 2023 | Course | `Codefinity-Ultimate_HTML_Certificate.png` |
| CSS Fundamentals | July 23, 2023 | Course | `Codefinity-CSS_Fundamentals_Certificate.png` |
| Advanced CSS Techniques | July 24, 2023 | Course | `Codefinity-Advanced_CSS_Techniques_Certificate.png` |
| Mastering React | July 28, 2023 | Course | `Codefinity-Mastering_React_Certificate.png` |
| Expert React | July 30, 2023 | Course | `Codefinity-Expert_React_Certificate.png` |
| Becoming a Web Developer | July 30, 2023 | Completed track | `Codefinity-Web_Developer_TRACK_Certificate.png` |

The complete certificate IDs are recorded in the JSON entries and visible on
the underlying images. These are historical certificate identifiers, **not**
verified public credential URLs.

## Duplicate title / historical note

A separate image was downloaded with the local filename
`Codefinity-CSS_Layout_Effects_and_Sass_Certificate.png`, reflecting a
different course title shown by the current provider UI. On inspection it
contained the **Advanced CSS Techniques** certificate image and matching ID.
It is not a distinct eighth credential and is deliberately excluded from the
site's certificate data and deployed assets. Retain **Advanced CSS Techniques**
as the displayed title unless stronger evidence supports a correction.

The discrepancy between historical and current Codefinity dashboard entries
does **not** establish why the provider's records differ or whether a
curriculum migration caused the discrepancy.

## Maintenance and validation

- Preserve existing Coursera certificate entries and URLs unchanged.
- For Codefinity, include `title`, `issuer`, `date`, `image`, and
  `certificateId`. Set `type: "track"` only for the completed track.
- Use exact, case-sensitive, root-relative image paths
  (`/images/certificates/...`); a data/image filename mismatch will fail on
  a Linux-based production deployment.
- Do not invent Codefinity verification links; `certUrl` is optional.
- Validate that every JSON image path has a matching file, and run
  `npm test`, `npm run lint`, and `npm run build` before merge.
- Confirm all seven recovered credentials and the five pre-existing Coursera
  cards render correctly in the Netlify deploy preview, particularly on
  mobile, before considering production verification complete.

## Change status

Prepared on feature branch `feat/recover-codefinity-certificates` for
[PR #11](https://github.com/ArchILLtect/nh-showcase-site/pull/11).
Not recorded as merged or deployed until those events are verified.

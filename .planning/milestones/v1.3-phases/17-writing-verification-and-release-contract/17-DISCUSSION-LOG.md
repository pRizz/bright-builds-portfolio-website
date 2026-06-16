# Phase 17: Writing Verification and Release Contract - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-06-14T18:47:38.999Z
**Phase:** 17 - Writing Verification and Release Contract
**Mode:** Yolo
**Areas discussed:** Static verification contract, Browser release coverage, Release readiness and evidence labels, OpenLinks identity presence, Verification scope

---

## Static Verification Contract

| Option | Description | Selected |
| --- | --- | --- |
| Helper-derived assertions | Compare generated writing output against writing and SEO helpers. | yes |
| Duplicated route fixtures | Hard-code expected writing slugs and metadata into verifier fixtures. | |
| Defer to manual review | Leave writing generated-output proof outside automation. | |

**User's choice:** Auto-selected helper-derived assertions.
**Notes:** Phase 16 already added much of this static verifier surface. Phase 17 should preserve and tighten it rather than duplicate route lists.

---

## Browser Release Coverage

| Option | Description | Selected |
| --- | --- | --- |
| Representative writing paths | Keep route-wide axe/layout loops and add explicit keyboard/reduced-motion writing paths. | yes |
| Exhaustive custom writing flows | Add separate bespoke browser workflows for every writing route. | |
| Static-only coverage | Rely only on generated HTML checks for writing routes. | |

**User's choice:** Auto-selected representative writing paths.
**Notes:** `prerenderRoutes` already gives writing routes axe and desktop/mobile dark layout coverage. Keyboard and reduced-motion need explicit writing-path assertions.

---

## Release Readiness and Evidence Labels

| Option | Description | Selected |
| --- | --- | --- |
| Truthful writing coverage label | Add writing route coverage docs, guard facts, and evidence label only for checks that run. | yes |
| Broad release claims | Claim manual or hosted coverage in automated labels. | |
| No doc update | Leave release-readiness docs project-detail-only. | |

**User's choice:** Auto-selected truthful writing coverage label.
**Notes:** The aggregate `bun run verify` already includes the relevant scripts. The release contract should explain that writing coverage is now part of the existing static, browser, and release checks.

---

## OpenLinks Identity Presence

| Option | Description | Selected |
| --- | --- | --- |
| Preserve subtle identity | Keep existing footer/about/contact and `Person.sameAs` presence without new writing CTA. | yes |
| Add writing-page CTA | Add visible OpenLinks promotion to writing routes. | |
| Metadata-only change | Modify identity metadata without considering visible placement. | |

**User's choice:** Auto-selected preserve subtle identity.
**Notes:** OpenLinks remains identity infrastructure. Phase 17 may verify metadata presence but should not make OpenLinks the writing-route release headline.

---

## Verification Scope

| Option | Description | Selected |
| --- | --- | --- |
| Repo-native full gate | Run focused tests during implementation and finish with the aggregate verify gate. | yes |
| New external tooling | Add hosted audits or live link crawlers. | |
| Partial checks only | Stop after unit tests without browser/static release coverage. | |

**User's choice:** Auto-selected repo-native full gate.
**Notes:** Use Bun and existing scripts. Avoid new Python automation or external dependencies.

---

## the agent's Discretion

- Choose exact representative writing route from public writing helper output.
- Choose whether static verifier changes are assertion changes, message changes, or both.
- Choose the smallest test/docs/code edits that make release evidence truthful.

## Deferred Ideas

- Rich per-writing OG images.
- RSS/Atom, search, tag archive pages, comments, newsletter capture, CMS/admin, MDX ingestion, and runtime content integrations.
- Live external-link reachability automation.

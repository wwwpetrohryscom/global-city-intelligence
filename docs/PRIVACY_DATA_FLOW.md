# Privacy data flow

What actually happens when somebody uses a GCI site, recorded by loading each
surface in a browser and reading what it contacted, stored and set.

**This is the source material for the public privacy policy.** It was written
first, deliberately: a policy composed from what a repository suggests it might
do is a description of an intention, and intentions drift from deployments.

Recorded 2026-09-09 against production.

## Method

A headless browser visited each surface, recorded every request that left the
canonical origin, and read cookies, `localStorage` and `sessionStorage`. Script
tags were listed from the rendered DOM.

Not from `package.json`. A dependency list says what the build uses; it says
nothing about which hosts a reader's browser reaches, and it will happily list
something that never ships and omit a `<script src>` written by hand.

## Three states, kept apart

Mixing these is how a policy comes to describe a product that does not exist.

| | Meaning |
|---|---|
| **ACTIVE** | Happens today, to real readers |
| **BUILT, DISABLED** | The code exists and is switched off |
| **FUTURE** | Not built |

## Currently active

| System | Purpose | What it receives | Storage it creates | Reader control | Verified by |
|---|---|---|---|---|---|
| **Netlify** (hosting) | Serving the sites | The ordinary HTTP request: path, IP address, user-agent | none | none — this is how the web works | Hosting configuration; response headers |
| **WebmasterID** (main site only) | Usage measurement | Page address, referrer, title, language, user-agent, window width, plus its own identifier | `wmid:av:v1` in **localStorage** (durable); `wmid:as:v1` in sessionStorage | Clear site data; DNT/GPC suppresses it entirely | Script tag and network POST observed on `www.globalcityintelligence.com/` |
| **OpenFreeMap** (Places only) | Map tiles and styles | Which tiles are requested as a reader pans — so, roughly what part of a map they are looking at | none | none while a map is open | `tiles.openfreemap.org` requests observed on Places city and place pages |
| **Wikimedia Commons** | Photographs | A request per image | sets its own `WMF-Uniq` cookie | Clear site data | `upload.wikimedia.org` request and cookie observed on main and Media pages |
| **GCI Places local state** | Saves, lists, pins, notes | nothing — never transmitted | `gci.places.retention.v1`, `gci.places.retention.quarantine.v1` | *Clear saved data* on the Saved page | Places source; `RETENTION_ANALYTICS_ENABLED = false` |
| **Main site recent cities** | Offering recently viewed cities again | nothing — never transmitted | `gci:recent-cities:v1` | Clear site data | Observed on a main city page |

### Per-surface observations

| Surface | Third parties contacted | Cookies | localStorage |
|---|---|---|---|
| Main homepage | WebmasterID, Wikimedia | `WMF-Uniq` (Wikimedia) | `wmid:av:v1` |
| Main city page | WebmasterID, Wikimedia | `WMF-Uniq` | `wmid:av:v1`, `gci:recent-cities:v1` |
| Places hub | **none** | none | none |
| Places city page | OpenFreeMap | none | none |
| Places place page | OpenFreeMap | none | none |
| GCI Media | Wikimedia | `WMF-Uniq` | none |

**GCI Places loads no analytics script and sets no cookie.** On a first visit it
writes nothing at all; storage appears only when somebody saves something.

## Built, disabled

| System | State | Would receive | Would create |
|---|---|---|---|
| **GCI Places retention measurement** | `RETENTION_ANALYTICS_ENABLED = false`, and no tracker script is loaded | Bounded action events: that a place was saved, a list created, a map opened — with city, category, visit-ready state, source context and coarse count buckets | Nothing new of its own; it would use the tracker's existing `wmid:av:v1` |

**It can never carry personal content.** List names, pin titles, pin
coordinates and note text are not expressible in the event type, and the
adapter builds payloads by walking an allow-list rather than reading its
caller's object — so a forbidden field cannot be emitted however it arrives.
Forty poison cases and a browser harness with real private values prove it. See
the Places repository, `docs/RETENTION_ANALYTICS.md`.

## Future, not built

Accounts and cross-device sync. There is no server, no database and no auth
dependency anywhere. If one is ever built it changes where data lives and who
can reach it, and it needs its own review — the current policy explicitly does
not cover it.

## Things worth being precise about

**"Static site" does not mean "no data reaches a server."** These are static
files, so there is no GCI application backend and no database — but every page
view is still an HTTP request to a host, which sees the path, the IP address
and the user-agent. Saying otherwise would be a comfortable falsehood.

**The measurement identifier is durable, and it is not a cookie.** It is 32
random hex characters in `localStorage` under `wmid:av:v1`, sent with every
event. It is not a name and is not linked to an account — there are none — but
it does connect visits from one browser over time. Calling that "completely
anonymous" would be wrong, which is why the policy does not.

**Do Not Track and Global Privacy Control work properly here.** With either
set, the tracker does not initialise at all: no global, no storage, no request.
Verified by running it with each signal. That is better than most, and it is
still not the same as consent where consent is legally required.

**GCI does not control what third parties do with what they receive.** The
policy names what each one gets and says their own practices govern the rest,
rather than making promises on their behalf.

## Open questions this document cannot answer

- **Who is the operator?** Nothing in any of the three repositories publishes a
  legal entity, a postal address or a contact route. Tracked as
  `operator-identity` in `lib/legal/privacy.ts`.
- **Is consent required before writing `wmid:av:v1`?** Rules on non-essential
  browser storage are not limited to cookies, and a browser signal is not
  consent where consent is required. Tracked as `consent-mechanism`. No consent
  mechanism exists in any GCI product.

Both are blockers, both are machine-visible, and neither is guessed at here.

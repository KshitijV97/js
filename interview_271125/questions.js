/**
 * Q) Structural typing vs nominal typing
 * 
 * Q) My developers keep mutating things they receive from APIs
 * 
 * Q) Explain how is a web page rendered in the browser 
 * A) Bytes -> Characters -> Tokens -> Nodes -> DOM
 * CSSOM
 * DOM + CSSOM = Render tree
 * Layout creation
 * Painting
 * 
 * Q) How do you test for keyboard traps?
 * 
 * Q) What are WCAG 2.1 Level AA non-negotiables for enterprise UIs?
 * A) Keyboard usability, Contract, Zoom, Rem, Focus visible
 * 
 * Q) He claims 70% bundle reduction → challenge hard:

Explain your entire strategy for bundle-size optimization.
Which tools? Which metrics? What trade-offs?

Give me ONE example where a bundle unexpectedly increased and how you debugged it.

Q) Explain memory contraints on a TV browser

Video decoder pipelines (often reserving 200–400 MB)

Voice assistant services

HDMI input managers

Manufacturer UI (home screen, launcher)

DRM / playback buffers

Custom OS processes

✔ The browser is just a small component

On Samsung (Tizen) and LG (webOS), the browser is basically a packaged WebKit fork with hard-coded memory caps.

✔ No swap, no virtual memory

TV OSes don’t use swap. When memory runs out:

Your tab is instantly killed.

No recovery, no warning, just a crash or reload.

What you MUST avoid on TV browsers
❌ Don’t load huge JS bundle upfront

Target:

< 500 KB compressed

Ideally 200–300 KB for the initial route

❌ Don’t preload many images

Lazy-load aggressively.
Prefer:

WebP

Lower resolutions (720p max on initial load)

❌ Don’t keep unused DOM nodes around

Use virtualization for lists.

❌ Don’t retain large arrays in global state

Discard data aggressively, e.g.,

release old video metadata

remove previous search results from state stores

prune caches

❌ Don’t use large CSS frameworks

Tailwind, Bootstrap → memory-heavy in CSSOM on constrained engines.

Q) Share state for Microfrontend
 */
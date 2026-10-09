// How the next tab pane enters. Module state (not React state) because the
// entering pane can live on another route: a click on "writes" mounts
// /writes, and a click on "now" from /writes mounts the home shell. Starts
// at 'none' on every full page load, so first paint never animates.
//   enter  — fade up (every tab switch)
//   return — slide in from the left (leaving an article; mirror of its slide-in)
export type TabEntry = 'none' | 'enter' | 'return'

let entry: TabEntry = 'none'

export function setTabEntry(next: TabEntry) {
  entry = next
}

/** Class for a tab pane. The CSS animation replays each time the pane is
 * mounted or un-hidden, so a pane keeps the class between switches. */
export function tabEntryClass(): string | undefined {
  if (entry === 'enter') return 'tab-enter'
  if (entry === 'return') return 'tab-return'
  return undefined
}

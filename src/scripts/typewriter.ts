// Mask the unprinted text without changing link names, line breaks, or page height.
export function printPage() {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || location.hash || !window.CSS?.highlights || !window.Highlight) return;

  const skip = document.querySelector<HTMLButtonElement>('#skip-typing')!;
  const groups = document.querySelectorAll<HTMLElement>('.masthead, .titlebar, .hero, .section');
  const runs: { node: Text; group: HTMLElement; start: number; end: number }[] = [];
  let length = 0;
  for (const group of groups) {
    const walker = document.createTreeWalker(group, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (!node.data.trim()) continue;
      runs.push({ node, group, start: length, end: length + node.length });
      length += node.length;
    }
  }
  if (!runs.length) return;

  const mask = new Range();
  mask.setStart(runs[0].node, 0);
  mask.setEndAfter(runs[runs.length - 1].node);
  CSS.highlights.set('unprinted', new Highlight(mask));
  for (const group of groups) group.dataset.unprinted = '';
  skip.hidden = false;

  let frame = 0;
  let index = 0;
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  function finish() {
    cancelAnimationFrame(frame);
    listeners.abort();
    CSS.highlights.delete('unprinted');
    for (const group of groups) delete group.dataset.unprinted;
    if (document.activeElement === skip) {
      document.getElementById('main')?.focus({ preventScroll: true });
    }
    skip.hidden = true;
  }

  skip.addEventListener('click', finish, options);
  document.addEventListener('focusin', event => {
    if (event.target !== skip) finish();
  }, options);
  window.addEventListener('hashchange', finish, options);
  motion.addEventListener('change', finish, options);
  window.addEventListener('pagehide', finish, options);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') finish();
  }, options);

  const start = performance.now();
  const duration = Math.min(length * 9, 5000);
  function type(now: number) {
    const position = Math.floor(length * (now - start) / duration);
    if (position >= length) return finish();
    while (runs[index].end <= position) {
      delete runs[index++].group.dataset.unprinted;
    }
    const run = runs[index];
    delete run.group.dataset.unprinted;
    mask.setStart(run.node, Math.max(0, position - run.start));
    frame = requestAnimationFrame(type);
  }
  frame = requestAnimationFrame(type);
}

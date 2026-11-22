export function printPage() {
  const control = document.querySelector<HTMLButtonElement>('#typing-control')!;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let stop: (() => void) | undefined;

  function play() {
    const runs: { node: Text; text: string; wrapper: HTMLElement; prefix: Text; tail: Text }[] = [];
    for (const group of document.querySelectorAll('.masthead, .titlebar, .hero, .section')) {
      const walker = document.createTreeWalker(group, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        if (node.data.trim() && !node.parentElement?.closest('button')) nodes.push(node);
      }
      for (const node of nodes) {
        // The transparent suffix reserves the final width, including wrapped lines.
        const wrapper = document.createElement('span');
        const prefix = document.createTextNode('');
        const suffix = document.createElement('span');
        suffix.dataset.unprinted = '';
        const tail = document.createTextNode(node.data);
        suffix.append(tail);
        wrapper.append(prefix, suffix);
        node.replaceWith(wrapper);
        runs.push({ node, text: node.data, wrapper, prefix, tail });
      }
    }
    let frame = 0;
    let index = 0;
    let offset = 0;
    let previous = 0;
    let credit = 0;
    function finish() {
      cancelAnimationFrame(frame);
      for (let i = index; i < runs.length; i++) runs[i].wrapper.replaceWith(runs[i].node);
      document.body.classList.remove('is-typing');
      control.textContent = '重播动画';
      stop = undefined;
    }
    stop = finish;
    control.textContent = '跳过动画';
    document.body.classList.add('is-typing');

    function tick(now: number) {
      // Only spend time on visible frames, including when opened in a background tab.
      if (!document.hidden && previous) credit += Math.min(now - previous, 50);
      previous = now;
      while (index < runs.length) {
        const run = runs[index];
        const delay = run.wrapper.closest('header, .titlebar, .hero') ? 38 : 12;
        const count = Math.min(run.text.length - offset, Math.floor(credit / delay));
        if (!count) break;
        credit -= count * delay;
        offset += count;
        if (offset < run.text.length) {
          run.prefix.data = run.text.slice(0, offset);
          run.tail.data = run.text.slice(offset);
          break;
        }
        run.wrapper.replaceWith(run.node);
        index++;
        offset = 0;
      }
      if (index === runs.length) finish();
      else frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  }

  control.hidden = false;
  control.addEventListener('click', () => {
    if (stop) stop();
    else {
      window.scrollTo(0, 0);
      play();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' || event.key === 'Tab') stop?.();
  });
  window.addEventListener('hashchange', () => stop?.());
  window.addEventListener('pagehide', () => stop?.());
  motion.addEventListener('change', () => stop?.());
  if ((!location.hash || location.hash === '#top') && !motion.matches) play();
  document.documentElement.classList.remove('typing-boot');
}

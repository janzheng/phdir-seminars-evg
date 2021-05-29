
// from here: https://github.com/sveltejs/sapper/issues/331
export function scrollToAnchor(anchor, behavior='smooth') {
  const el = document.getElementById(anchor);
  if (!el) return;
  el.scrollIntoView({
    behavior
  });
}

// takes an element
export function scrollIntoView({ target }) {
  const el = document.querySelector(target.getAttribute('href'));
  if (!el) return;
  el.scrollIntoView({
    behavior: 'smooth'
  });
}
function buildCarouselNav(block, ul) {
  const items = ul.querySelectorAll('li');
  if (items.length < 2) return;

  const cardGap = 24;

  const prev = document.createElement('button');
  prev.className = 'cards-teaser-arrow cards-teaser-prev hidden';
  prev.setAttribute('aria-label', 'Vorherige');
  prev.innerHTML = '&#8249;';
  prev.addEventListener('click', () => {
    ul.scrollBy({ left: -(items[0].offsetWidth + cardGap), behavior: 'smooth' });
  });

  const next = document.createElement('button');
  next.className = 'cards-teaser-arrow cards-teaser-next';
  next.setAttribute('aria-label', 'Nächste');
  next.innerHTML = '&#8250;';
  next.addEventListener('click', () => {
    ul.scrollBy({ left: items[0].offsetWidth + cardGap, behavior: 'smooth' });
  });

  function updateArrows() {
    const atStart = ul.scrollLeft <= 0;
    const atEnd = ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 1;
    const noScroll = ul.scrollWidth <= ul.clientWidth;
    prev.classList.toggle('hidden', atStart || noScroll);
    next.classList.toggle('hidden', atEnd || noScroll);
    ul.classList.toggle('centered', noScroll);
  }

  ul.addEventListener('scroll', updateArrows, { passive: true });
  block.prepend(prev);
  block.appendChild(next);

  // Double rAF ensures layout is settled before measuring
  requestAnimationFrame(() => requestAnimationFrame(updateArrows));
  // Also update when images load (can change scrollWidth)
  ul.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', updateArrows, { once: true });
  });
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    // Move children while maintaining structure
    while (row.firstElementChild) li.append(row.firstElementChild);
    // Structure: first div = image, second div = text
    const divs = [...li.children];
    divs.forEach((div, idx) => {
      const hasPicture = div.querySelector('picture');
      const hasImageInP = div.children.length === 1
        && div.firstElementChild.tagName === 'P'
        && div.firstElementChild.querySelector('img')
        && div.firstElementChild.childElementCount === 1;
      if (hasPicture || hasImageInP) {
        div.className = 'cards-teaser-card-image';
      } else if (div.children.length === 0 && idx === 0) {
        // Empty image div — card has no image, use colored placeholder
        div.className = 'cards-teaser-card-image cards-teaser-no-image';
      } else {
        div.className = 'cards-teaser-card-body';
      }
    });
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);

  buildCarouselNav(block, ul);
}

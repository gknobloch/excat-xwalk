import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Label sections
  const sections = footer.querySelectorAll('.section');
  const classes = ['links', 'partners'];
  sections.forEach((section, i) => {
    if (classes[i]) section.classList.add(`footer-${classes[i]}`);
  });

  // Style links section
  const linksSection = footer.querySelector('.footer-links');
  if (linksSection) {
    const wrapper = linksSection.querySelector('.default-content-wrapper');

    // Style Filialsuche link (first paragraph with single link, before the ul)
    const filialLink = wrapper?.querySelector('a[href*="suche"]');
    if (filialLink) {
      const filialP = filialLink.closest('p') || filialLink.closest('.button-container');
      if (filialP) {
        filialP.className = 'footer-filialsuche';
        filialLink.className = '';
        // Add search icon
        const icon = document.createElement('img');
        icon.src = '/icons/search.svg';
        icon.alt = '';
        icon.width = 16;
        icon.height = 16;
        filialLink.prepend(icon);
      }
    }

    // Style social media links — replace text with SVG icons
    const paragraphs = wrapper?.querySelectorAll('p') || [];
    paragraphs.forEach((p) => {
      const links = p.querySelectorAll('a');
      if (links.length > 1 && !p.querySelector('img')) {
        p.classList.add('footer-social');
        links.forEach((a) => {
          const name = a.textContent.trim().toLowerCase();
          a.className = 'footer-social-link';
          a.setAttribute('aria-label', a.textContent.trim());
          a.setAttribute('title', a.textContent.trim());
          const icon = document.createElement('img');
          icon.src = `/icons/${name}.svg`;
          icon.alt = a.textContent.trim();
          icon.width = 24;
          icon.height = 24;
          a.textContent = '';
          a.appendChild(icon);
          const container = a.closest('.button-container');
          if (container) container.className = '';
        });
      }
    });

    // Style cookie settings link — keep on its own row
    const cookieLink = wrapper?.querySelector('a[href*="cookie"]');
    if (cookieLink) {
      cookieLink.className = 'footer-cookie-link';
      const cookieContainer = cookieLink.closest('.button-container') || cookieLink.closest('p');
      if (cookieContainer) {
        cookieContainer.className = 'footer-cookie';
      }
    }
  }

  // Clean up partner logo link styling
  const partnersSection = footer.querySelector('.footer-partners');
  if (partnersSection) {
    partnersSection.querySelectorAll('a').forEach((a) => {
      a.className = '';
      const container = a.closest('.button-container');
      if (container) container.className = '';
    });
  }

  block.append(footer);
}

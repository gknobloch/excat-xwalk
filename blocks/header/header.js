import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const sections = nav.querySelectorAll('.section');
  const classes = ['brand', 'sections', 'tools'];
  sections.forEach((section, i) => {
    if (classes[i]) section.classList.add(`nav-${classes[i]}`);
  });

  // --- Top navigation bar (dark blue) ---
  const navBar = document.createElement('div');
  navBar.className = 'nav-bar';

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const ul = navSections.querySelector('ul');
    if (ul) {
      navBar.appendChild(ul);
    }
  }

  // --- Brand bar (white, with logo + login) ---
  const brandBar = document.createElement('div');
  brandBar.className = 'brand-bar';

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const logoWrapper = navBrand.querySelector('.default-content-wrapper');
    if (logoWrapper) {
      const logoP = logoWrapper.querySelector('p');
      if (logoP) {
        logoP.className = 'brand-logo';
        // Clean up button classes added by decorateButtons
        const logoLink = logoP.querySelector('a');
        if (logoLink) logoLink.className = '';
        const logoContainer = logoP.closest('.button-container');
        if (logoContainer) logoContainer.className = '';
        brandBar.appendChild(logoP);
      }
    }
  }

  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const toolsWrapper = navTools.querySelector('.default-content-wrapper');
    if (toolsWrapper) {
      const loginP = toolsWrapper.querySelector('p');
      if (loginP) {
        loginP.className = 'brand-login';
        const loginLink = loginP.querySelector('a');
        if (loginLink) {
          loginLink.className = 'login-button';
          const loginContainer = loginLink.closest('.button-container');
          if (loginContainer) loginContainer.className = '';
        }
        brandBar.appendChild(loginP);
      }
    }
  }

  block.textContent = '';
  block.append(navBar, brandBar);
}

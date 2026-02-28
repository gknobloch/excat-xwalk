export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('cta-card');
    // If there's a wrapper column div, unwrap content
    if (row.children.length === 1 && row.firstElementChild.tagName === 'DIV') {
      const wrapper = row.firstElementChild;
      while (wrapper.firstChild) row.appendChild(wrapper.firstChild);
      wrapper.remove();
    }
    // Find icon image and add class
    const img = row.querySelector('img[src*="icons/"]');
    if (img) img.classList.add('cta-card-icon');
    // Ensure CTA buttons are secondary (outlined) style
    row.querySelectorAll('a.button').forEach((btn) => btn.classList.add('secondary'));
  });
}

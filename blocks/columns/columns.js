export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      // Convert first text element to h2
      const firstText = col.querySelector('p');
      if (firstText && !col.querySelector('h1, h2, h3, h4, h5, h6')) {
        const h2 = document.createElement('h2');
        h2.textContent = firstText.textContent;
        firstText.replaceWith(h2);
      }

      // Create link wrapper and move link
      const link = col.querySelector('a');
      if (link) {
        const linkText = link.textContent.trim();
        link.innerHTML = linkText;
        
        // Create wrapper div for link
        const linkWrapper = document.createElement('div');
        linkWrapper.className = 'link-container';
        
        // Move link to wrapper
        link.parentElement.removeChild(link);
        linkWrapper.appendChild(link);
        col.appendChild(linkWrapper);
      }
    });
  });
}

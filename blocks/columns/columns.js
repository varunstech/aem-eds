export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Add responsive class based on screen width
  const handleResize = () => {
    if (window.innerWidth <= 960) {
      block.classList.add('columns-mobile');
      
      // For mobile: Make headings clickable
      block.querySelectorAll('.columns > div > div').forEach(col => {
        const heading = col.querySelector('h2');
        const link = col.querySelector('a');
        if (heading && link) {
          heading.style.cursor = 'pointer';
          heading.onclick = () => {
            link.click();
          }
        }
      });
    } else {
      block.classList.remove('columns-mobile');
    }
  };

  // Initial check
  handleResize();

  // Listen for window resize
  window.addEventListener('resize', handleResize);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      // Convert first text element to h2
      const firstText = col.querySelector('p');
      if (firstText && !col.querySelector('h1, h2, h3, h4, h5, h6')) {
        const h2 = document.createElement('h2');
        h2.textContent = firstText.textContent;
        firstText.replaceWith(h2);
      }

      // Ensure proper content structure
      const content = col.innerHTML;
      col.innerHTML = ''; // Clear the column
      
      // Create proper structure
      const contentDiv = document.createElement('div');
      contentDiv.className = 'content-wrapper';
      contentDiv.innerHTML = content;
      col.appendChild(contentDiv);

      // Handle link separately
      const link = contentDiv.querySelector('a');
      if (link) {
        const linkText = link.textContent.trim();
        link.innerHTML = linkText;
        
        const linkWrapper = document.createElement('div');
        linkWrapper.className = 'link-container';
        link.parentElement.removeChild(link);
        linkWrapper.appendChild(link);
        col.appendChild(linkWrapper);
      }
    });
  });
}

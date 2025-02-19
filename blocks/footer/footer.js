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

  const sections = footer.querySelectorAll('.section');
  if (sections.length > 0) {
    sections[0].classList.add('local-footer');

    // Find the local footer and its content wrapper
    const localFooter = sections[0];
    const contentWrapper = localFooter.querySelector('.default-content-wrapper');

    if (contentWrapper) {
      // Find all button container paragraphs
      const buttonContainers = contentWrapper.querySelectorAll('.button-container');
      if (buttonContainers.length >= 3) {
        const repeatedDiv = document.createElement('div');
        repeatedDiv.classList.add('mobile-elements');

        // Clone and append the buttons with modified titles
        const phoneButton = buttonContainers[buttonContainers.length - 3].cloneNode(true);
        phoneButton.querySelector('a').textContent = 'Call';

        const emailButton = buttonContainers[buttonContainers.length - 2].cloneNode(true);
        emailButton.querySelector('a').textContent = 'Mail';

        const directionsButton = buttonContainers[buttonContainers.length - 1].cloneNode(true);

        repeatedDiv.appendChild(phoneButton);
        repeatedDiv.appendChild(emailButton);
        repeatedDiv.appendChild(directionsButton);

        buttonContainers[buttonContainers.length - 1].classList.add('hide-mobile');
        // Insert after the address paragraph (which is before the button containers)
        sections[0].appendChild(repeatedDiv);
      }
    }
  }
  if (sections.length > 1) {
    sections[1].classList.add('local-footer-message');
  }
  if (sections.length > 2) {
    sections[2].classList.add('global-footer');
  }

  block.append(footer);
}

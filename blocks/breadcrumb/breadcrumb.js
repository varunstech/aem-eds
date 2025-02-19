import { a, div, li } from '../../scripts/dom-helpers.js';

/**
 * Builds a breadcrumb trail from current path to root
 * @param {Element} block The breadcrumb block element
 */
export default async function decorate(block) {
  const currentPath = window.location.pathname;
  const paths = currentPath?.split('/').filter(Boolean);
  const breadcrumbs = [];

  // Fetch metadata from query-index
//   const resp = await fetch('/query-index.json');
//   const json = await resp.json();
//   const pathsMetadata = json.data;

  const pathsMetadata = [
    {
      "path": "/for-parents",
      "title": "For Parents - Fort Street Public School",
      "description": "The weekly Fort Street Public School newsletter, Fort Street Focus, can be found on Sentral's Parent app.",
      "breadcrumb-title": "For Parents",
      "publication-date": "0",
      "template": "side-nav",
      "from-the-department": "0",
      image: '/default-meta-image.png?width=1200&format=pjpg&optimize=medium',
      lastModified: '1739530047',
      robots: '0',
    },
    {
      "path": "/learning-at-our-school",
      "title": "Learning at our school - Fort Street Public School",
      "description": "The NSW Education Standards Authority (NESA) develops syllabuses for all subjects in six key learning areas.",
      "breadcrumb-title": "Learning at our school",
      "publication-date": "0",
      "template": "side-nav",
      "from-the-department": "0",
      image: '/default-meta-image.png?width=1200&format=pjpg&optimize=medium',
      lastModified: '1739530047',
      robots: '0',
    },
  ];

  // Build array of breadcrumb items
  let accumPath = '';
  paths.forEach((segment) => {
    accumPath += `/${segment}`;
    const pathData = pathsMetadata.find((p) => p.path === accumPath);
    breadcrumbs.push({
      text: pathData?.['breadcrumb-title'] || segment,
      path: accumPath,
    });
  });

  // Create breadcrumb HTML
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  // Create mobile version (Back button)
  const mobileNav = div({ class: 'breadcrumb-mobile' });
  const backButton = a();
  backButton.href = breadcrumbs.length > 0
    ? breadcrumbs[breadcrumbs.length - 2]?.path || '/'
    : '/';
  backButton.innerHTML = 'Back';
  mobileNav.appendChild(backButton);
  nav.appendChild(mobileNav);

  // Create desktop version (full breadcrumb)
  const desktopNav = div({ class: 'breadcrumb-desktop' });
  const list = document.createElement('ul');

  // Add home link
  const homeLi = li();
  const homeLink = a({ href: '/' }, 'Home');
  homeLi.appendChild(homeLink);
  list.appendChild(homeLi);

  // Add remaining breadcrumbs
  breadcrumbs.forEach((crumb, index) => {
    const tempLi = li();
    if (index === breadcrumbs.length - 1) {
      tempLi.textContent = crumb.text;
      tempLi.setAttribute('aria-current', 'page');
    } else {
      const tempA = a({ href: crumb.path }, crumb.text);
      tempLi.appendChild(tempA);
    }
    list.appendChild(tempLi);
  });

  desktopNav.appendChild(list);
  nav.appendChild(desktopNav);
  block.appendChild(nav);
}

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
// const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  
  // Create and add hamburger button
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  for (let i = 0; i < 3; i++) {
    const span = document.createElement('span');
    hamburger.appendChild(span);
  }
  nav.appendChild(hamburger);

  // Create and add overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';
  nav.appendChild(overlay);
  
  // Define classes for the divs in order
  const divClasses = ['global-header', 'global-quicklinks', 'local-header', 'dropdown-menu', 'mobile-menu'];
  let divIndex = 0;
  
  while (fragment.firstElementChild) {
    const element = fragment.firstElementChild;
    if (element.tagName === 'DIV' && divIndex < divClasses.length) {
      element.classList.add(divClasses[divIndex]);
      
      // Add classes to lists in mobile-menu
      if (element.classList.contains('mobile-menu')) {
        const lists = element.querySelectorAll('ul');
        if (lists.length >= 2) {
          lists[0].classList.add('mobile-global-links');
          lists[1].classList.add('mobile-dropdown-menu');
          
          // Add click handlers for mobile dropdown menu
          const dropdownItems = lists[1].querySelectorAll('li:has(> ul)');
          dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
              // Only handle clicks on the item itself or its direct link
              if (e.target === item || e.target === item.querySelector('a')) {
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling to parent list items
                
                // Get the clicked submenu
                const clickedSubmenu = item.querySelector('ul');
                const isCurrentlyOpen = clickedSubmenu.classList.contains('show');
                
                // Close all submenus at the same level
                const parentList = item.parentElement;
                parentList.querySelectorAll(':scope > li > ul').forEach(submenu => {
                  submenu.classList.remove('show');
                });
                
                // If the clicked submenu wasn't open, open it
                if (!isCurrentlyOpen) {
                  clickedSubmenu.classList.add('show');
                }
              }
            });
          });
        }
      }
      
      // Add wrapper for sublist items
      if (element.classList.contains('dropdown-menu')) {
        const subLists = element.querySelectorAll('ul > li > ul');
        subLists.forEach(subList => {
          const wrapper = document.createElement('div');
          wrapper.className = 'submenu-wrapper';
          wrapper.style.display = 'none';
          
          // Get the parent link element
          const parentLi = subList.parentNode;
          const parentLink = parentLi.querySelector('a');
          const originalHref = parentLink.href;  // Store original href
          
          // Add click event handler
          parentLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check if this submenu is already visible
            const isVisible = wrapper.style.display === 'block';
            
            // Remove selected class from all links
            document.querySelectorAll('.dropdown-menu ul > li > a').forEach(link => {
              link.classList.remove('selected');
            });
            
            // Hide all submenu wrappers
            document.querySelectorAll('.submenu-wrapper').forEach(submenu => {
              submenu.style.display = 'none';
            });
            
            // Toggle this submenu wrapper and selected class
            wrapper.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
              parentLink.classList.add('selected');
            }
          });
          
          // Create h3 with a link inside
          const heading = document.createElement('h3');
          const headingLink = document.createElement('a');
          headingLink.href = originalHref;  // Use original href
          headingLink.textContent = parentLink.textContent;
          heading.appendChild(headingLink);
          
          // Create submenu content wrapper
          const submenuContent = document.createElement('div');
          submenuContent.className = 'submenu-content';
          
          // Insert wrapper and move sublist into content wrapper
          subList.parentNode.insertBefore(wrapper, subList);
          wrapper.appendChild(heading);
          wrapper.appendChild(submenuContent);
          submenuContent.appendChild(subList);
        });
      }
      
      divIndex++;
    }
    nav.append(element);
  }

  // Add event listeners for mobile menu
  hamburger.addEventListener('click', () => {
    const mobileMenu = nav.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('open');
    overlay.classList.toggle('open');
  });

  overlay.addEventListener('click', () => {
    const mobileMenu = nav.querySelector('.mobile-menu');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}

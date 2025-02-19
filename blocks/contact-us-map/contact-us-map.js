import { loadScript } from '../../scripts/aem.js';
import { p } from '../../scripts/dom-helpers.js';
import { h3, div } from '../../scripts/dom-helpers.js';

const markerOnClick = (infoWindow, location, map, marker) => {
  const infoWindowDiv = document.querySelector('.info-window');
  const ifVisible = infoWindowDiv?.classList?.contains('visible');

  if (ifVisible) {
    infoWindow.close();
    const accordionItem = document.querySelector('.accordion-item');
    accordionItem.classList.remove('open');
    accordionItem.removeAttribute('open');
  } else {
    infoWindow.setContent(
      // add dynamice class to the info window
      `<div class='info-window visible'>
        <div>
          <img class='info-window-logo' src='/content/dam/doe-sample-site-1/doe/fspslogo.png'>
        </div>
        <div>
          <strong>${location.name}</strong><br>
          <small>${location.address}</small><br>
          <a href='https://www.google.com/maps/dir/?api=1&destination=${location.address}' target='_blank'>
            Get Directions
          </a>
        </div>
      </div>`,
    );
    infoWindow.open(map, marker);

    // open accordion item also
    const accordionItem = document.querySelector('.accordion-item');
    accordionItem.classList.add('open');
    accordionItem.setAttribute('open', 'true');
  }
};

/* eslint-disable  no-undef */
const mapProcessing = (locations) => {
  const mapContainer = div({ class: 'google-map' });
  if (locations.length && !locations[0].lat && !locations[0].lng) {
    locations[0].lat = -33.860451;
    locations[0].lng = 151.204639;
  }

  window.initMap = () => {
    const map = new google.maps.Map(document.getElementsByClassName('google-map')[0], {
      center: { lat: locations[0].lat, lng: locations[0].lng }, // Default center
      zoom: 18,
    });

    const infoWindow = new google.maps.InfoWindow();
    google.maps.event.addListener(infoWindow, 'closeclick', () => {
      const accordionItem = document.querySelector('.accordion-item');
      accordionItem.classList.remove('open');
      accordionItem.removeAttribute('open');
    });

    const markers = [];

    locations.forEach((location, index) => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
        gmpClickable: true,
        icon: {
          url: 'https://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png', // Example pushpin icon
          scaledSize: new google.maps.Size(32, 32), // Resize if needed
        },
      });

      if (index === 0) {
        markerOnClick(infoWindow, location, map, marker);
      }

      marker.addListener('click', () => {
        markerOnClick(infoWindow, location, map, marker);
      });

      markers.push(marker);
    });

    document.querySelectorAll('.accordion-item')?.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        map.setCenter(markers[index].getPosition());
        google.maps.event.trigger(markers[index], 'click');
      });
    });

    // Click event handler for items
    document.querySelectorAll('.location-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        map.setCenter(markers[index].getPosition());
        google.maps.event.trigger(markers[index], 'click');
      });
    });
  };

  loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAwRAI9ybH41VklsZdSJgye2sDAPj1-myI&callback=initMap', {
    async: true,
    defer: true,
  });

  return mapContainer;
};

export default function decorate(block) {
  const locations = [];
  const tempDiv = div({ class: 'locations' });
  const summary = document.createElement('summary');
  summary.className = 'accordion-item-label';
  const details = document.createElement('details');
  details.className = 'accordion-item';

  const body = document.createElement('div');
  body.className = 'accordion-item-body';
  const location = {
    name: '',
    address: '',
    phone: '',
    email: '',
    lat: null,
    lng: null,
  };

  [...block.children].forEach((row, index) => {
    if (index === 0) {
      location.name = row.textContent;
      summary.appendChild(h3(location.name));
    } else if (index === 1) {
      location.address = row.textContent;
      const tempP = p({ class: 'location' });
      let text = '';
      row.querySelectorAll('p').forEach((childP) => {
        text += childP.textContent + '<br>';
      });
      tempP.innerHTML = text;
      body.appendChild(tempP);
      // body.classList.add('location');
      // [...row.children][0].classList.add('location');
      // body.appendChild([...row.children][0]);
      // console.log([...row.children][0]);
      // [...row.children]?.forEach((child) => {
      //   body.appendChild(child);
      // });
      // body.appendChild(p({ class: 'location' }, row));
    } else if (index === 2) {
      location.phone = row.textContent;
      body.appendChild(p({ class: 'phone' }, location.phone));
    } else if (index === 3) {
      location.email = row.textContent;
      body.appendChild(p({ class: 'email' }, location.email));
    } else if (index === 4) {
      location.lat = Number(row.textContent);
    } else if (index === 5) {
      location.lng = Number(row.textContent);
    }
  });

  details.append(summary, body);
  locations.push(location);
  tempDiv.append(details);

  const mapContainer = mapProcessing(locations);
  block.replaceChildren(tempDiv, div({ class: 'map' }, mapContainer));
}

import { Component, OnInit, AfterViewInit } from '@angular/core';

import * as L from 'leaflet';

@Component({
  selector: 'app-dealers',
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.css']
})
export class DealersComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

 dealers = [
    {
      name: 'Dealer one',
      lat: 28.6139,
      lng: 77.2090,
      address: '123 Business Park, Sector 12, New Delhi, Delhi 110075',
      distance: '1.2'
    },
    {
      name: 'Dealer Two',
      lat: 28.6280,
      lng: 77.2029,
      address: '45 Green Avenue, Near Metro Station, New Delhi, Delhi 110017',
      distance: '2.5'
    },
    {
      name: 'Dealer Three',
      lat: 28.7041,
      lng: 77.1025,
      address: '78 Industrial Area, Phase 2, Gurugram, Haryana 122015',
      distance: '5.8'
    },
    {
      name: 'Dealer four',
      lat: 28.4595,
      lng: 77.0266,
      address: '34 Trade Center, Sector 18, Noida, Uttar Pradesh 201301',
      distance: '12.3'
    },
    {
      name: 'Dealer five',
      lat: 28.4089,
      lng: 77.3178,
      address: '9 Green Park, Main Road, Faridabad, Haryana 121002',
      distance: '15.7'
    }
  ];

  ngAfterViewInit(): void {
    const map = L.map('dealerMap').setView([this.dealers[0].lat, this.dealers[0].lng], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
    }).addTo(map);

    this.dealers.forEach((dealer) => {
      L.marker([dealer.lat, dealer.lng])
        .addTo(map)
        .bindPopup(`<b>${dealer.name}</b><br>${dealer.address}`);
    });

    // Optional: Remove background color from all cards
    const dealerCards = document.querySelectorAll('.dealer-card');
    dealerCards.forEach((c) => {
      (c as HTMLElement).style.backgroundColor = '';
    });
  }


  loadMap(): void {
    const map = L.map('dealerMap').setView([28.6139, 77.2090], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const dealerIcon = L.icon({
      iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    setTimeout(() => {
      const dealerCards = document.querySelectorAll('.dealer-card');

      dealerCards.forEach((card: any, i: number) => {
        const lat = parseFloat(card.dataset.lat);
        const lng = parseFloat(card.dataset.lng);
        const name = card.querySelector('.dealer-name').textContent;
        const address = card.querySelector('.dealer-address').textContent.trim().replace(/\n/g, '<br>');

        const marker = L.marker([lat, lng], { icon: dealerIcon }).addTo(map)
          .bindPopup(`<b>${name}</b><br>${address}`);

        marker.on('click', function () {
        dealerCards.forEach(c => (c as HTMLElement).style.backgroundColor = '');

         (card as HTMLElement).style.backgroundColor = '#f0f7ff';
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        card.addEventListener('click', () => {
          map.setView([lat, lng], 15);
          marker.openPopup();
        });
      });
    }, 0);
  }

}

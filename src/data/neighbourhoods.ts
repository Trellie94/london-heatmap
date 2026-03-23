/** Known neighbourhood centres within Wandsworth borough */
export interface Neighbourhood {
  name: string;
  lat: number;
  lng: number;
}

export const NEIGHBOURHOODS: Neighbourhood[] = [
  { name: 'Putney', lat: 51.4610, lng: -0.2155 },
  { name: 'Wandsworth Town', lat: 51.4570, lng: -0.1880 },
  { name: 'Balham', lat: 51.4434, lng: -0.1524 },
  { name: 'Tooting', lat: 51.4275, lng: -0.1680 },
  { name: 'Clapham Junction', lat: 51.4641, lng: -0.1705 },
  { name: 'Battersea', lat: 51.4760, lng: -0.1490 },
  { name: 'Southfields', lat: 51.4448, lng: -0.2065 },
  { name: 'Earlsfield', lat: 51.4430, lng: -0.1870 },
  { name: 'Nine Elms', lat: 51.4800, lng: -0.1310 },
  { name: 'Roehampton', lat: 51.4505, lng: -0.2420 },
  { name: 'Tooting Bec', lat: 51.4355, lng: -0.1590 },
  { name: 'Furzedown', lat: 51.4270, lng: -0.1540 },
];

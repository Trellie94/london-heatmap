import type { POI } from '@/types';

import gailsData from './pois/gails.json';
import mandsData from './pois/mands.json';
import waitroseData from './pois/waitrose.json';
import sainsburysData from './pois/sainsburys.json';
import gymsData from './pois/gyms.json';
import stationsData from './pois/stations.json';
import parksData from './pois/parks.json';
import coffeeData from './pois/coffee.json';
import gastropubsData from './pois/gastropubs.json';

export const poiData: Record<string, POI[]> = {
  gails: gailsData as POI[],
  mands: mandsData as POI[],
  waitrose: waitroseData as POI[],
  sainsburys: sainsburysData as POI[],
  gyms: gymsData as POI[],
  stations: stationsData as POI[],
  parks: parksData as POI[],
  coffee: coffeeData as POI[],
  gastropubs: gastropubsData as POI[],
};

declare module '@mapbox/mapbox-sdk/services/geocoding' {
  import { MapiRequest } from '@mapbox/mapbox-sdk/lib/classes/mapi-request';
  import { Feature, Point } from 'geojson';

  interface GeocodingService {
    forwardGeocode(params: {
      query: string;
      types?: string[];
      limit?: number;
      proximity?: Point;
    }): MapiRequest;

    reverseGeocode(params: {
      query: number[];
      types?: string[];
      limit?: number;
    }): MapiRequest;
  }

  export = GeocodingService;
}

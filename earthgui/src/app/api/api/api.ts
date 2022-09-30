export * from './country.service';
import { CountryService } from './country.service';
export * from './earthquake.service';
import { EarthquakeService } from './earthquake.service';
export const APIS = [CountryService, EarthquakeService];

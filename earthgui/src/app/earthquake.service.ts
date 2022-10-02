import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IFeature, IAttributesTable } from './api';
import { Earthquake } from './earthquake';

@Injectable({
  providedIn: 'root'
})
export class EarthquakeLiveService {

  private earthQuakeMap = new Subject<IFeature>();
  mapEarthquake = this.earthQuakeMap.asObservable();

  private earthQuakeEditor = new Subject<Earthquake>();
  editorEarthquake = this.earthQuakeEditor.asObservable();

  constructor() { }

  mapNextEarthquake(feature: IFeature) {
    this.earthQuakeEditor.next(this.fromFeatureToEarthquake(feature));
  }

  fromFeatureToEarthquake(feature: any) :Earthquake{
    let eq:any =  feature.properties.earthquake;
    return eq as Earthquake;
  }

}

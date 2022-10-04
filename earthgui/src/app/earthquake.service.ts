import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IFeature, IAttributesTable, Feature } from './api';
import { Earthquake } from './earthquake';

@Injectable({
  providedIn: 'root'
})
export class EarthquakeLiveService {

  private earthQuakeMap = new Subject<any>();
  mapEarthquake = this.earthQuakeMap.asObservable();

  private earthQuakeDeleted = new Subject<any>();
  deleteEarthQuake = this.earthQuakeDeleted.asObservable();


  private earthQuakeEditor = new Subject<any>();
  editorEarthquake = this.earthQuakeEditor.asObservable();

  private earthQuakeSelection = new Subject<any[]>();
  selectionEarthquake = this.earthQuakeSelection.asObservable();

  constructor() { }

  mapNextEarthquake(feature: IFeature) {
    this.earthQuakeEditor.next(feature);
  }
  editorUpdateEarthquake(feature:any) {
    this.earthQuakeMap.next(feature);
  }
  mapDeletedEarthquake(id:any) {
    this.earthQuakeDeleted.next(id);
  }
  drawNextSelection(features: IFeature[]) {
    this.earthQuakeSelection.next(
      features.map((f:any) => { return {
          latitude: f.properties.earthquake.latitude,
          longitude: f.properties.earthquake.longitude,
          magnitude: f.properties.earthquake.magnitude,
          depth:f.properties.earthquake.depth,
          origintime: f.properties.earthquake.date + ' ' + f.properties.earthquake.time
      } as any;})
    );
  }

  fromFeatureToEarthquake(feature: any) :Earthquake{
    let eq:Earthquake =  feature.properties.earthquake as Earthquake;
    eq.id = feature.id as number;
    return eq;
  }
}

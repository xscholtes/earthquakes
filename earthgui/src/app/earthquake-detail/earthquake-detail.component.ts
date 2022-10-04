import { Component, Input, OnInit, Output } from '@angular/core';
import { Earthquake } from '../earthquake';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { Subscription } from 'rxjs';
import { EarthquakeLiveService } from '../earthquake.service';
import { ThisReceiver } from '@angular/compiler';
import { Coordinate, EarthquakeService } from '../api';

@Component({
  selector: 'app-earthquake-detail',
  templateUrl: './earthquake-detail.component.html',
  styleUrls: ['./earthquake-detail.component.scss']
})
export class EarthquakeDetailComponent implements OnInit {
  sources?: string[];
  status?: string[];
  private _editMode: boolean = false;
  @Output()
  public get editMode(): boolean {
    this._editMode = this.earthquake.hasOwnProperty("id") == true;
    return this._editMode;
  }
  public set editMode(value: boolean) {
    if (value == false) {
      this.earthquake = {} as Earthquake;
    }
    this._editMode = value;
  }

  earthquakeForm =this.fb.group({
    id: [0],
    source: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    latitude: [0, Validators.required],
    longitude: [0, Validators.required],
    depth: [0, Validators.required],
    magnitude: [0, Validators.required],
    magnitude_type: [''],
    status: ['', Validators.required],
  });

  editedFeature:any = null;

  private _earthquake: Earthquake;
  @Input()
  public get earthquake(): Earthquake {
    return this._earthquake;
  }
  public set earthquake(value: Earthquake) {
    value.date = new Date(value.date);
    this._earthquake = value;
    this.earthquakeForm.controls['id'].disable();
  }

  subscription: Subscription;

  constructor(private earthQuakeService: EarthquakeService, private dataService: EarthquakeLiveService,private fb: FormBuilder) {
    this._earthquake = {} as Earthquake;
    this.subscription = this.dataService.editorEarthquake.subscribe((feature:any) => {
      this.editedFeature = feature;
      this.earthquake = this.dataService.fromFeatureToEarthquake(feature);
      this.editEarthQuake()
    })
  }

  ngOnInit(): void {
    this.earthQuakeService.getSources().subscribe(s => this.sources = s);
    this.earthQuakeService.getStatus().subscribe(s => this.status = s);
   
  }

  emptyFeature() :any{
    let newFeature = {
      type: "Feature",
      id: null,
      geometry: {
        type: "Point",
        coordinates: [0, 0] as Coordinate[]
      },
      properties: {
        earthquake: {
          source: "",
          date: "",
          time: "01:01:01",
          latitude: 0,
          longitude: 0,
          depth: 0,
          magnitude: 0,
          magnitude_type: "MWW",
          status: "Reviewed",
          id: 0
        }
      }
    };
    return newFeature;
  }
  newFeature():void{
    this.dataService.mapNextEarthquake(this.emptyFeature());
  }
  editEarthQuake(): void {
    this.earthquakeForm.setValue(this.earthquake as any);
  }

  cancel() {
    this.earthquakeForm.reset(this.earthquake as any);
  }
  onSubmit() {
    if(this.editedFeature.id == null) {
      this.editedFeature  = this.emptyFeature();
      delete this.editedFeature["id"];
    } 
    this.editedFeature .properties.earthquake = this.earthquakeForm.value;
    this.earthQuakeService.earthquakePost(this.editedFeature).subscribe(feature => {
      this.editedFeature = feature; 
      this.earthquake = this.dataService.fromFeatureToEarthquake(feature);
      this.dataService.editorUpdateEarthquake(feature)
    });
  }
  delete() {
    this.editMode = false;
    this.earthQuakeService.earthquakeDelete(this.editedFeature).subscribe(feature => {
      this.dataService.mapDeletedEarthquake(this.editedFeature.id);
    });
  }
}


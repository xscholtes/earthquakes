import { Component, Input, OnInit } from '@angular/core';
import { Earthquake } from '../earthquake';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Subscription } from 'rxjs';
import { EarthquakeLiveService } from '../earthquake.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-earthquake-detail',
  templateUrl: './earthquake-detail.component.html',
  styleUrls: ['./earthquake-detail.component.scss']
})
export class EarthquakeDetailComponent implements OnInit {



  earthquakeForm = new FormGroup({
    source: new FormControl(),
    date: new FormControl<Date | null>(null),
    time: new FormControl(),
    latitude: new FormControl(),
    longitude: new FormControl(),
    depth: new FormControl(),
    magnitude: new FormControl(),
    magnitude_type: new FormControl(),
    status: new FormControl(),
  });

  @Input() earthquake?: Earthquake;
  subscription: Subscription;

  @Input()
  id: number = 1;
  @Input()
  source: string = 'TEST';
  @Input()
  date: Date = new Date();
  @Input()
  time: string = '';
  @Input()
  latitude: number = 0;
  @Input()
  longitude: number = 0;
  @Input()
  depth: number = 0;
  @Input()
  magnitude: number = 0;
  @Input()
  magnitude_type: string = '';
  @Input()
  status: string = '';

  constructor(private dataService: EarthquakeLiveService) {
    this.subscription = this.dataService.editorEarthquake.subscribe(eq => { this.earthquake = eq; this.editEarthQuake()})
  }

  ngOnInit(): void {
  }

  editEarthQuake(): void {
    if(this.earthquake != null){
      this.id = this.earthquake.id;
      this.source = this.earthquake.source;
      this.date = this.earthquake.date;
      this.time = this.earthquake.time;
      this.latitude = this.earthquake.latitude;
      this.longitude = this.earthquake.longitude;
      this.depth = this.earthquake.depth;
      this.magnitude = this.earthquake.magnitude;
      this.magnitude_type = this.earthquake.magnitude_type;
      this.status = this.earthquake.status;
    }
  }

  cancel() {
      this.earthquakeForm.reset(this.earthquake);
  }
}


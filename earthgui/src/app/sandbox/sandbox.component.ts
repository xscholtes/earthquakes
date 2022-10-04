import { Component, Input, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';
import * as d4 from 'd3-geo-projection';

import { Coordinate, CountryService, EarthquakeService, IFeature } from '../api';
import * as topojson from 'topojson-client';
import { HttpClient } from '@angular/common/http';
import { EarthquakeLiveService } from "../earthquake.service";
import { map, Observable, startWith, Subscription } from 'rxjs';
import { Earthquake } from '../earthquake';
import { D3DragEvent, least } from 'd3';
import { FormControl } from '@angular/forms';
import { SignalrService } from '../services/signalr.service';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {
  svg: any;
  height: number = 346;
  satelliteView: boolean = false;
  width: number = 928;
  graticule: any = d3.geoGraticule10();
  outline: any = ({ type: "Sphere" });
  countries: any;
  lowresCountries: any;
  projection: d3.GeoProjection = d3.geoOrthographic();
  outlinePath: any;
  graticulePath: any;

  highResolution: boolean = true;

  private _countryPath: any;
  @Input()
  public get countryPath() {
    return this._countryPath;
  }
  public set countryPath(value: any) {
    this._countryPath = value;
  }

  features: any[] = [];
  private _selectedFeatures: any[] = [];

  public get selectedFeatures() {
    return this._selectedFeatures
  }
  public set selectedFeatures(value: any[]) {

    this._selectedFeatures = value;
  }
  borderPath: any;
  borders: any;
  mousedownx: number = 0;
  mousedowny: number = 0;
  mousemoving: boolean = false;
  rotation: number = 1;
  slideLambda: number = 0;
  slidePhi: number = 0;
  slideGamma: number = 0;
  moving: any;
  altitude: number = 15000;
  cameraTilt: number = 0;
  cameraOpening: number = 35;
  orthoScale: number = 1;
  @Input() earthquake?: IFeature;
  subscription: Subscription;

  magnitudeRange: number[] = [7.5, 10];
  filteredOptions: any[] = [];
  selectedCountry: any = null;

  issInterval: any;


  constructor(private countryService: CountryService, private earthQuakeService: EarthquakeService, private dataService: EarthquakeLiveService, private httpClient: HttpClient,private signalRService:SignalrService) {
    this.subscription = this.dataService.mapEarthquake.subscribe(eq => {

      if (this.features.filter(f => f.id == eq.id).length == 0) {
        this.features.push(eq);
      } else {
        let eqs: any[] = [eq];
        //replace the element
        this.features = this.features.map(obj => eqs.find(o => o.id === obj.id) || obj);
      }
      this.render();
    });
    this.subscription = this.dataService.deleteEarthQuake.subscribe(eq => {
      this.features = this.features.filter(obj => obj.id != eq);
      this.render();
    });
  }

  ngOnInit(): void {
    this.initSvg();
    this.httpClient.get('assets/land110m.json').subscribe((data: any) => {
      this.lowresCountries = topojson.feature(data, data.objects.land);
      //this.borders = topojson.mesh(data, data.objects.countries, (a: any, b: any) => { return a !== b; });
    });
    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener();  

  }





  initSvg() {
    let me = this
    this.svg = d3.select('#svg_main').append('g');
    this.svg.on('wheel', function (e: WheelEvent) {
      let direction = (e.deltaY >= 1) ? -1 : 1;
      if (me.orthoScale >= 1 && direction == 1 && me.orthoScale <= 9.5) {
        me.orthoScale = me.orthoScale + 0.5;
        me.render();
      }
      if (me.orthoScale <= 10 && direction == -1 && me.orthoScale >= 1.5) {
        me.orthoScale = me.orthoScale - 0.5;
        me.render();
      }
    });
    this.countryService.getCountries().subscribe(countries => {
      this.countries = countries;
      this.render();
    });
    this.earthQuakeService.getEarthquakes().subscribe(earthquakes => {
      let eq: any = earthquakes;
      this.features = eq.features.filter((f: any) => f.geometry != null) as any[];
      this.selectedFeatures = this.features.filter(f => f.properties.earthquake.magnitude >= this.magnitudeRange[0]);
      this.render();
    });
  }
  render() {
    if (this.satelliteView == true) {
      const degrees: number = (180 / Math.PI);
      const earthRadius = 6371;
      const numPixelsY = this.width * 0.6;
      let dY = this.altitude * Math.sin(this.cameraTilt / degrees);
      let dZ = this.altitude * Math.cos(this.cameraTilt / degrees);
      let visibleYextent = 2 * dZ * Math.tan(0.5 * this.cameraOpening / degrees)
      let scale = earthRadius * numPixelsY / visibleYextent;
      let yShift = dY * numPixelsY / visibleYextent;
      let snyderP = 1.0 + this.altitude / earthRadius;
      this.projection = d4.geoSatellite()
        .scale(scale)
        .translate([this.width / 2, yShift + numPixelsY / 2])
        .rotate([-this.slideLambda, -this.slidePhi, this.slideGamma])
        .tilt(this.cameraTilt)
        .distance(snyderP)
        .preclip(this.preclip.apply(this))
        .precision(0.1)
    } else {
      this.projection = d3.geoOrthographic();
      this.projection.scale(this.orthoScale * 200).translate([this.width / 2, this.height / 1.5]).rotate([-this.slideLambda, -this.slidePhi, this.slideGamma]);
    }
    let path = d3.geoPath(this.projection);

    this.outlinePath = path(this.outline);
    this.graticulePath = path(this.graticule);
    let me = this;
    let proj: any = this.projection;
    if (this.highResolution == true) {
      this.svg.selectAll('circle').remove();
      this.selectedFeatures = this.features.filter(f => f.properties.earthquake.magnitude <= this.magnitudeRange[1] && f.properties.earthquake.magnitude >= this.magnitudeRange[0]);
      let circles = this.svg.selectAll('circle')
        .data(this.selectedFeatures.filter(f => {
          const visible = path({ type: 'Point', coordinates: [f.geometry.coordinates[0], f.geometry.coordinates[1]] });
          return visible ? true : false;
        }));
      circles.enter().append('circle')
        .merge(circles)
        .attr('cx', function (d: any) {
          return proj([d.geometry.coordinates[0], d.geometry.coordinates[1]])![0];
        })
        .attr('cy', function (d: any) {
          return proj([d.geometry.coordinates[0], d.geometry.coordinates[1]])![1];
        })
        .attr('r', function (d: any) {
          return d.properties.earthquake.magnitude - 3;
        })
        .style('fill', function (d: any) { return me.perc2color((d.properties.earthquake.magnitude - 5) * 50) })
        .style('opacity', 0.75)


      this.svg.selectAll('circle').on('click', function (e: any, d: IFeature) {
        let pos = d3.pointer(e);
        me.dataService.mapNextEarthquake(d);
        let coord = proj.invert(pos);
      });
    } else {
      this.svg.selectAll('circle').remove();
    }

    if (this.highResolution == true && ((this.orthoScale >= 3 && this.satelliteView == false) || (this.altitude <= 12000 && this.satelliteView == true))) {
      this.countryPath = path(this.countries);
    } else {
      //this.borderPath = path(this.borders);
      this.countryPath = path(this.lowresCountries);
    }
  }


  changeSlider($event: any) {
    this.highResolution = false;
    this.render();
    clearTimeout(this.moving);
    this.moving = setTimeout(() => {
      if (this.highResolution != true) {                           //<<<---using ()=> syntax
        this.highResolution = true;
        this.render();
      }
    }, 500);

  }
  changeSliderEnd($event: any) {
    if (this.highResolution != true) {
      this.highResolution = true;
      this.render();
    }
  }
  showStats() {
    this.dataService.drawNextSelection(this.selectedFeatures);
  }
  search(event: any) {
    this.filteredOptions = this.countries.features.filter((f: any) => f.properties.name.toLowerCase().includes(event.query.toLowerCase())).map((f: any) => { return { id: f.id, name: f.properties.name } });
  }

  countrySelect(value: any) {
    console.log(value);
    var p = d3.geoCentroid(this.countries.features.find((f: any) => f.id == value.id));
    this.orthoScale = 8;
    this.altitude = 3000;
    this.slideLambda = p[0];
    this.slidePhi = p[1];
    this.render();
  }
  reset() {
    this.slideGamma = 0;
    this.slidePhi = 0;
    this.slideLambda = 0;
    this.orthoScale = 1;
    this.altitude = 15000;
    this.cameraTilt = 0;
    this.cameraOpening = 35;
    this.magnitudeRange[1] = 10;
    this.magnitudeRange[0] = 7.5;
    this.render()
  }
  handleChangeGeo(event: any) {
    this.slideGamma = 0;
    this.slidePhi = 0;
    this.slideLambda = 0;
    this.orthoScale = 1;
    this.altitude = 15000;
    this.cameraTilt = 0;
    this.cameraOpening = 35;
    this.render();
  }

  handleChangeIss(event: any) {
    if (event.checked) {
      this.satelliteView = true;
      this.altitude = 7000;
      this.cameraOpening = 17;
      this.cameraTilt = 25;
      this.slideGamma = 0;
      this.issInterval = setInterval(() => {
        this.httpClient.get('http://api.open-notify.org/iss-now.json').subscribe((data: any) => {
          this.slideLambda = data.iss_position.longitude;
          this.slidePhi = data.iss_position.latitude;
          this.render();
        })
      }, 5000);
    } else {
      clearInterval(this.issInterval);
      this.render();
    }
  }

  download() {
    // fetch SVG-rendered image as a blob object
    const svg = document.querySelector('svg');
    if (svg) {
      let data = (new XMLSerializer()).serializeToString(svg);
      //add name spaces.
      if (!data.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        data = data.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!data.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        data = data.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }

      //add xml declaration
      data = '<?xml version="1.0" standalone="no"?>\r\n' + data;
      // convert the blob object to a dedicated URL
      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data);
      const a = document.createElement('a');
      a.download = 'image.svg';
      document.body.appendChild(a);
      a.href = url;
      a.click();
      a.remove();
    }
  }
  perc2color(perc: number) {
    var r, g, b = 0;
    if (perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    }
    else {
      g = 255;
      r = Math.round(510 - 5.10 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
  }

  preclip() {
    let me = this;
    const distance = 2; //camera.distance;
    const tilt = 0; //camera.tilt * Math.PI / 180;
    const alpha = Math.acos(distance * Math.cos(tilt) * 0.999);
    const clipDistance = me.geoClipCircle(Math.acos(1 / distance) - 1e-6);

    return alpha ? this.geoPipeline(
      clipDistance,
      me.geoRotatePhi(Math.PI + tilt),
      me.geoClipCircle(Math.PI - alpha - 1e-4),
      me.geoRotatePhi(-Math.PI - tilt)
    ) : clipDistance;
  }
  geoClipCircle = d3.geoClipCircle;
  geoPipeline(...transforms: any) {
    return (sink: any) => {
      for (let i = transforms.length - 1; i >= 0; --i) {
        sink = transforms[i](sink);
      }
      return sink;
    };
  }
  geoRotatePhi(deltaPhi: number) {
    const cosDeltaPhi = Math.cos(deltaPhi);
    const sinDeltaPhi = Math.sin(deltaPhi);
    return (sink: any) => ({
      point(lambda: number, phi: number) {
        const cosPhi = Math.cos(phi);
        const x = Math.cos(lambda) * cosPhi;
        const y = Math.sin(lambda) * cosPhi;
        const z = Math.sin(phi);
        const k = z * cosDeltaPhi + x * sinDeltaPhi;
        sink.point(Math.atan2(y, x * cosDeltaPhi - z * sinDeltaPhi), Math.asin(k));
      },
      lineStart() { sink.lineStart(); },
      lineEnd() { sink.lineEnd(); },
      polygonStart() { sink.polygonStart(); },
      polygonEnd() { sink.polygonEnd(); },
      sphere() { sink.sphere(); }
    });
  }
}


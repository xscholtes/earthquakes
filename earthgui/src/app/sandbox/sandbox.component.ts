import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { CountryService, EarthquakeService, IFeature } from '../api';

import { EarthquakeLiveService } from "../earthquake.service";
import { Subscription } from 'rxjs';
import { Earthquake } from '../earthquake';
import { least } from 'd3';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {
  svg: any;
  height:number = 452;
  width:number = 928;
  graticule:any = d3.geoGraticule10();
  outline:any = ({type: "Sphere"});
  countries:any;
  projection:d3.GeoProjection = d3.geoOrthographic();
  outlinePath:any;
  graticulePath:any;
  countryPath:any;

  @Input() earthquake?:IFeature;
  subscription: Subscription;

  constructor(private countryService:CountryService, private earthQuakeService:EarthquakeService, private dataService: EarthquakeLiveService) { 
    this.subscription = this.dataService.mapEarthquake.subscribe(eq => this.earthquake = eq)
  }

  ngOnInit(): void {
    
    this.initSvg()

  }

  initSvg() {
    this.svg = d3.select('#svg_main').append('g');
    
    let path = d3.geoPath(this.projection);
    this.outlinePath = path(this.outline);
    this.graticulePath = path(this.graticule);
    this.countryService.getCountries().subscribe(countries => {
      let co:any = countries;
      this.countryPath = path(co);
    });
    this.earthQuakeService.getEarthquakes().subscribe(earthquakes => {
      let eq:any = earthquakes;
      let proj:any = this.projection;
      this.svg.selectAll('circle')
		   .data(eq.features)
		   .enter().append('circle')
		   .attr('cx', function(d:any) {
		       return proj([d.geometry.coordinates[0], d.geometry.coordinates[1]])![0];
		   })
		  .attr('cy', function(d:any) {
			     return proj([d.geometry.coordinates[0], d.geometry.coordinates[1]])![1];
		   })
		  .attr('r', function(d:any) {
			    return d.properties.earthquake.magnitude /2;
		  })
		  .style('fill', 'red')
		  .style('opacity', 0.75);
      let me = this;
      this.svg.selectAll('circle').on('click',function(e:any,d:IFeature){
        
        let pos = d3.pointer(e);
        me.dataService.mapNextEarthquake(d);
        let coord = proj.invert(pos);
        console.log(coord);
      });
    });
  }
}

import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as dc from 'dc';
import * as d3Time from 'd3-time';

import * as crossfilter from 'crossfilter2/crossfilter';

import { EarthquakeLiveService } from '../earthquake.service';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss']
})
export class ChartViewComponent implements OnInit {

  constructor(private dataService: EarthquakeLiveService) { }

  ngOnInit(): void {
    this.dataService.selectionEarthquake.subscribe(data => this.render(data));
  }

  render(data:any[]) {
    console.log(data);
     // format our data
  data.forEach(function(d) { 
    d.dtg   = new Date(d.origintime); 
    d.lat   = +d.latitude;
    d.long  = +d.longitude;
    d.mag   = Math.round(+d.magnitude * 10) /10;
    d.depth = Math.round(+d.depth);
  });

/******************************************************
* Step1: Create the dc.js chart objects & ling to div *
******************************************************/

  var depthChart = dc.barChart("#dc-depth-chart");

/****************************************
* 	Run the data through crossfilter    *
****************************************/

  var facts = new crossfilter(data);  // Gets our 'facts' into crossfilter

/******************************************************
* Create the Dimensions                               *
* A dimension is something to group or filter by.     *
* Crossfilter can filter by exact value, or by range. *
******************************************************/

  // for Depth
  var depthValue = facts.dimension((d:any) => d.depth);
  var depthValueGroup = depthValue.group();
  
  // Depth bar graph
  depthChart.width(480)
    .height(150)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(depthValue)
    .group(depthValueGroup)
	.transitionDuration(500)
    .centerBar(true)	
	.gap(1)                    // bar width Keep increasing to get right then back off.
    .x(d3.scaleLinear().domain([0, 100]))
	.elasticY(true)
	.xAxis().tickFormat(function(v: any) {return v;});
			
  dc.renderAll();
  }
}

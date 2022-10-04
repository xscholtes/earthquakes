import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ApiModule, Configuration } from './api';
import { SandboxComponent } from './sandbox/sandbox.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialEarthModule } from '../material.module';
import {MatNativeDateModule} from '@angular/material/core';
import { EarthquakeDetailComponent } from './earthquake-detail/earthquake-detail.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TestNavComponent } from './test-nav/test-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';


import {SliderModule} from 'primeng/slider';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { ChartViewComponent } from './chart-view/chart-view.component';

const config = new Configuration();
//config.basePath = "https://demo.xavierscholtes.space/api";
config.basePath = "http://localhost:5224";
@NgModule({
  declarations: [
    AppComponent,
    SandboxComponent,
    EarthquakeDetailComponent,
    TestNavComponent,
    ChartViewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ApiModule.forRoot(() => config),
    NoopAnimationsModule,
    MaterialEarthModule,
    MatNativeDateModule,
    
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    SliderModule,
    ToggleButtonModule,
    AutoCompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

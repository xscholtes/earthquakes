import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ApiModule, Configuration } from './api';
import { SandboxComponent } from './sandbox/sandbox.component';

const config = new Configuration();
config.basePath = "http://localhost:5224" 
@NgModule({
  declarations: [
    AppComponent,
    SandboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ApiModule.forRoot(() => config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

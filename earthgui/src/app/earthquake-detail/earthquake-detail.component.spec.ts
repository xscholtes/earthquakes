import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarthquakeDetailComponent } from './earthquake-detail.component';

describe('EarthquakeDetailComponent', () => {
  let component: EarthquakeDetailComponent;
  let fixture: ComponentFixture<EarthquakeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarthquakeDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarthquakeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

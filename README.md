# Test application to visualize and modify earthquake data

## Features

- CRUD on earthquake data
- Othographic and Satellite projection of 3D Eath using d3js
- Earthquakes data projection on the map
- Rotate on 3 axes, reset to 0
- Zoom, Altitude
- Camera field view, camera tilt
- Goto a country
- Filter on earthquake magnitude
- Display depth statistics on filtered earthquake
- ISS position simulation

## Requirements

- Postgis database
- donetcore sdk 6
- npm, angular cli

## Performances

### Protocol
	- HTTP2
	- GUNZIP
	
### Client
	- Single Page application
	- Service Worker (countries prefetch)
	- Lower resolution geographic country data during calculation
	- SignalR (implementation pending)
	- Push modifications in geographic data (use data transformation object pattern), transform on fly the feature model
	- 
	
## Improvements 

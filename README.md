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

## Patterns 
	- Database First Model design (Entity Framework)
	- Swagger Open API3 (swagger UI)
	- swagger-code-gen to TypeScript with strict Model definition
	- Angular with routing, service worker
	- Angular material

## Performances

### API
	- dotnet core 6
	- MemoryStore (not used)
	- Feature as is CRUD
	- SignalR notification broadcast update to clients
	
### NGINX
	- HTTP2 (certificates and domain name required)
	- GUNZIP
	
### Client
	- Single Page application
	- Service Worker (countries prefetch)
	- Lower resolution geographic country data during calculation
	- SignalR (implementation pending)
	- Push modifications in geographic data (use data transformation object pattern), transform on fly the feature model
	- Rendering improvement by not calculating invisible items
	- Lazy rendering
	
## Improvements 
	- cache/invalidation on API
	- cache/invalidation on Web Server
	- cache headers for client
	- database windowing
	- client background calculation
	- client asynchronous call
	- api asynchronous call on all methods
	
	


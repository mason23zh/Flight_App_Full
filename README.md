# Flight Data

## This is an API to get data for the airports, runways, navaids and etc.

---

### Airports: */api/v1/airports*

**End Points**:

Get All Airports:\
Example: ***/api/v1/airports/all-airports***

Get Airports By ICAO:\
Example: ***/api/v1/airports/icao/cywg***

Get Airports By IATA:\
Example: ***/api/v1/airports/iata/ywg***

Get Airports By Type (large_airport, medium_airport, small_airport,heliport,seaplane_base,closed_airport)\
Example: ***/api/v1/airports/type/heliport***

Get Airports By Name (Able to partially match e.g. winnipeg would match 3 results)\
Example: ***/api/v1/airports/name/Winnipeg***

Get airports within certain radius (km for kilometers, nm or nautical miles )\
Example: ***/api/v1/airports/airports-within/icao/katl/distance/30/unit/nm***

Get distance between origin airport and destination airport (km for kilometers, nm or nautical miles)\
Example: ***/api/v1/airports/airports-distance/origin/katl/destination/kjax/unit/nm***

---

### Airports Query:

limitFields\
Example: ***/api/v1/airports/all-airports?fields=icao+type***

limitResults\n
Example: ***/api/v1/airports/all-airports?limitedResults=3***

paginate
Example: ***/api/v1/airports/all-airports?page=1&limit=3***

---

### Users: */api/v1/users*

**End Points**:

Signup: \
Example: ***/api/v1/users/signup***

Login:\
Example: ***/api/v1/users/login***

---

### Additional Features

METAR: Decoded + Raw METAR

ATIS: FAA published only

---

### ToDo List:

* ~~ILS~~
* ~~ATIS~~
* NOTAM

* Get Airports by Weather filter

* Geo data:
    * ~~Nearby airports from selected airport~~
    * ~~Distance between origin airports to destination airport(approximate ground distance)~~
    * *Distance between origin airports to destination airport (approximate air distance)
* ~~Protected Routes~~

* Zibo Updates Download (Patch Only, Azure CDN if time allowed)

* DB modification with Admin authorization.

* *Navigraph Navdata parser to update the Airports DB. DB Size reduce.

* Add Navigraph integration to allow registered user to access more data.

* Vatsim data display

    * Online regions
    * ATIS

*Require complete DB model and controllers refactor

*Need waypoints coordinates to preform graph search

---

### Credits

- [ FAA DATIS ](https://datis.clowd.io/) 

This is an API to get data for the airports, runway, navaids and etc.

Airports: http://localhost:8001/api/v1/airports

End Points:

Get All Airports
Example: http://localhost:8001/api/v1/airports/all-airports

Get Airports By ICAO
Example: http://localhost:8001/api/v1/airports/icao/cywg

Get Airports By IATA
Example: http://localhost:8001/api/v1/airports/iata/ywg

Get Airports By Type (large_airport, medium_airport, small_airport,heliport,seaplane_base,closed_airport)
Example: http://localhost:8001/api/v1/airports/type/heliport

Get Airports By Name (Able to partially match e.g. winnipeg would match 3 resutls)
Example: http://localhost:8001/api/v1/airports/name/Winnipeg

Query:

limitFields
Example: http://localhost:8001/api/v1/airports/all-airports?fields=icao+type

limitResults
Example:http://localhost:8001/api/v1/airports/all-airports?limitedResults=3

paginate
Example:http://localhost:8001/api/v1/airports/all-airports?page=1&limit=3

Users: http://localhost:8001/api/v1/users

Signup: http://localhost:8001/api/v1/users/signup

Login: http://localhost:8001/api/v1/users/login

ToDo List:

ILS

ATIS

METAR (Partially Done, decoded + original)

NOTAM

Get Airports by Weather filter

Protected Routes

Zibo Updates Download (Patch Only, Azure CDN if time allowed)

DB modification with Admin authorization.

*Navigraph Nadata parser to update the Airports DB. DB Size reduce.

*Require complete DB model and controllers refactor 

This is an API to get data for the airports, runway, navaids and etc.

http://localhost:8001/api/v1

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

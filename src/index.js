const express = require("express");
const fs = require("fs");

const app = express();

const airportTestString =
  '33,"Nanaimo Airport","Nanaimo","Canada","YCD","CYCD",49.054970224899996,-123.869862556,92,-8,"A","America/Vancouver","airport","OurAirports"';
const airportTestArray = airportTestString.split(",");
console.log(airportTestArray);
const airportObject = {};
airportObject.airportName = airportTestArray[1];
airportObject.country = airportTestArray[3];

console.log(airportObject);

app.get("/", function (req, res) {
  res.send("hello");
});

app.listen(3003);

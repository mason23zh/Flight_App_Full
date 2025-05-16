const { SitemapStream } = require("sitemap");
const { createWriteStream, readFileSync } = require("fs");
const path = require("path");

// Config
const hostname = "https://airportweather.org";
const staticRoutes = [
    "/",
    "/about",
    "/weather",
    "/extreme-weather",
    "/airport",
    "/map",
    "/changelog",
    "/vatsim/events",
];

// Load airport data from JSON
const airportDataPath = path.resolve(
    __dirname,
    "../src/assets/airport_data/airports_with_location.json"
);
const airportData = JSON.parse(readFileSync(airportDataPath, "utf-8"));

// Filter out airports with valid identifiers (some may be null or invalid)
const airportICAOs = airportData
    .map((a) => a.ident)
    .filter((ident) => ident && typeof ident === "string" && ident.length >= 3);

// Create sitemap
const sitemap = new SitemapStream({ hostname });
const outputPath = path.resolve(__dirname, "../public/sitemap.xml");
const writeStream = createWriteStream(outputPath);
sitemap.pipe(writeStream);

// Static pages
staticRoutes.forEach((url) => sitemap.write({ url }));

// Dynamic airport detail pages
airportICAOs.forEach((icao) => sitemap.write({ url: `/airport/detail/${icao}` }));

sitemap.end();

writeStream.on("finish", () => {
    console.log(`Sitemap written to ${outputPath} with ${airportICAOs.length} airport entries`);
});

const fs = require("fs");
const readline = require("readline");

function processLineByLine1() {
    const airports = [];
    let airportObj = {};
    let runwayObj = {};
    let runwayArray = [];

    const fileStream = fs.createReadStream("H:/node-js-project/Flight-Data/dev-data/GNS430_Data/Airports.txt");

    const rl = readline.createInterface({
        input: fileStream,
        /**removeHistoryDuplicates: true,**/
    });

    rl.on("line", (line) => {
        if (line.length > 0 && (line.startsWith("A") || line.startsWith("R"))) {
            if (line.startsWith("A")) {
                airportObj.ICAO = line.split(",")[1];
                airportObj.name = line.split(",")[2];
                airportObj.latitude = Number(line.split(",")[3]);
                airportObj.longitude = Number(line.split(",")[4]);
                airportObj.elevation = Number(line.split(",")[5]);
                airportObj.transitionAltitude = Number(line.split(",")[6]);
            } else if (line.startsWith("R")) {
                runwayObj.runway_id = line.split(",")[1];
                runwayObj.runwayHdg = Number(line.split(",")[2]);
                runwayObj.runwayWidth = Number(line.split(",")[3]);
                runwayObj.runwayLength = Number(line.split(",")[4]);
                runwayObj.runway_ils_avl = Number(line.split(",")[5]);
                runwayObj.ilsFreq = Number(line.split(",")[6]);
                runwayObj.ilsHdg = Number(line.split(",")[7]);
                runwayObj.thresholdLatitude = Number(line.split(",")[8]);
                runwayObj.thresholdLongitude = Number(line.split(",")[9]);
                runwayObj.thresholdElevation = Number(line.split(",")[10]);
                runwayObj.gsAngle = Number(line.split(",")[11]);
                runwayObj.thresholdOverflyAlt = Number(line.split(",")[12]);
                runwayObj.surfaceType = Number(line.split(",")[13]);
                runwayObj.runwayStatus = Number(line.split(",")[14]);
                runwayArray.push(runwayObj);
                runwayObj = {};
            }
        } else {
            airportObj.runways = runwayArray;
            runwayArray = [];
            airports.push(airportObj);
            airportObj = {};
            fs.writeFileSync(
                "H:/node-js-project/Flight-Data/dev-data/GNS430_Data/airports.json",
                JSON.stringify(airports)
            );
        }
    });
}

processLineByLine1();

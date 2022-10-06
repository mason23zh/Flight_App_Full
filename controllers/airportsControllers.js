// noinspection JSUnresolvedVariable,SpellCheckingInspection,ExceptionCaughtLocallyJS,JSCheckFunctionSignatures
const { Airports } = require("../models/airports/airportsModel");
const { Runways } = require("../models/airports/runwaysModel");
const { Navaids } = require("../models/airports/navaidsModel");
const BadRequestError = require("../common/errors/BadRequestError");
const NotFoundError = require("../common/errors/NotFoundError");
const APIFeatures = require("../utils/Data_Convert/apiFeatures");
const factory = require("./factoryController");
const { metarDecoder } = require("../utils/METAR/metarDecoder");
const { getMetar } = require("../utils/METAR/getMetar");
const { getFaaAtis } = require("../utils/ATIS/getFaaAtis");

module.exports.getAllAirports = factory.getAll(Airports);

module.exports.getAirportByICAO = async (req, res, next) => {
    try {
        const responseMetar = { data: [] };
        const airportFeatures = new APIFeatures(
            Airports.find({
                ident: `${req.params.icao.toUpperCase()}`,
            }),
            req.query
        ).limitFields();

        const runwayFeatures = new APIFeatures(
            Runways.find({
                airport_ident: `${req.params.icao.toUpperCase()}`,
            }),
            req.query
        ).limitFields();

        const responseATIS = await getFaaAtis(req.params.icao.toUpperCase());

        if (responseATIS.data.error) {
            responseATIS.data = `No ATIS found in ${req.params.icao.toUpperCase()}`;
        }
        const metarData = await getMetar("metar", req.params.icao.toUpperCase());

        if (metarData.data.length === 0) {
            responseMetar.data = `No METAR data found in ${req.params.icao.toUpperCase()}`;
        } else {
            responseMetar.data.push(metarDecoder(metarData.data[0]));
        }

        const airport = await airportFeatures.query;
        const runway = await runwayFeatures.query;

        if (!airport.length) {
            throw new BadRequestError(`Airport with ICAO: '${req.params.icao.toUpperCase()}' Not Found`);
        }

        res.status(200).json({
            status: "success",
            data: {
                airport,
                runways: runway,
                ATIS: responseATIS.data,
                METAR: responseMetar.data,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getAirportByIATA = async (req, res, next) => {
    try {
        const airportFeatures = new APIFeatures(
            Airports.find({
                iata_code: `${req.params.iata.toUpperCase()}`,
            }),
            req.query
        ).limitFields();

        const runwayFeatures = new APIFeatures(
            Runways.find({
                airport_ident: `${req.params.iata.toUpperCase()}`,
            }),
            req.query
        ).limitFields();

        const airport = await airportFeatures.query;
        if (airport.length === 0) {
            throw new BadRequestError(
                `Airport with IATA: '${req.params.iata.toUpperCase()}' Not Found ${
                    req.params.iata.length > 3 ? "(IATA code length is 3)" : ""
                }`
            );
        }
        const runway = await runwayFeatures.query;

        res.status(200).json({
            status: "success",
            data: {
                airport,
                runway,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getAirportByType = async (req, res) => {
    const airportsQueryObj = Airports.find({
        type: `${req.params.type}`,
    });

    const featuersQuery = new APIFeatures(airportsQueryObj, req.query).filter().limitFields().paginate().limitResults();

    const airports = await featuersQuery.query;

    res.status(200).json({
        status: "success",
        data: {
            airports,
        },
    });
};

module.exports.getAirportByName = async (req, res, next) => {
    try {
        const airportsQueryObj = Airports.find({
            name: { $regex: `${req.params.name}`, $options: "i" },
        });

        const featuersQuery = new APIFeatures(airportsQueryObj, req.query)
            .filter()
            .limitFields()
            .limitResults()
            .paginate();

        const airports = await featuersQuery.query;

        res.status(200).json({
            status: "success",
            data: {
                airports,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getAirportWithNavaids = async (req, res, next) => {
    try {
        const icao = req.params.icao.toUpperCase();
        const airport = Airports.findOne({ ident: icao });
        if (airport.length === 0) {
            throw new NotFoundError(`Airport with ICAO: ${icao} not found`);
        }
        const navaids = await Navaids.find({ associated_airport: icao });

        res.status(200).json({
            navaids,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getAirportWithRunways = async (req, res, next) => {
    try {
        const airport = await Airports.findOne({ ident: `${req.params.icao.toUpperCase()}` });
        if (airport.lenght === 0) {
            throw NotFoundError(`Airport with ICAO: ${req.params.icao.toUpperCase()} not found`);
        }
        const runways = await Runways.find({ airport_ident: airport.ident });

        res.status(200).json({
            airport,
            runways,
        });
    } catch (err) {
        next(err);
    }
};

// const startBrowser = async () => {
//     let browser;
//     try {
//         console.log("Opening the browser......");
//         browser = await puppeteer.launch({
//             headless: false,
//             args: ["--disable-setuid-sandbox"],
//             ignoreHTTPSErrors: true,
//         });
//     } catch (err) {
//         console.log("Could not create a browser instance => : ", err);
//     }
//     return browser;
// };

/**
 * FIXME: NOT WORKING, required Simbrief/Navigraph login. Required Simbrief/Navigraph Auth API ingretaion.
 * Simbrief does not provide NOTAM API, if logged in, required using puppeteer to launch a browswer and scraping
 * the rendered content.
 **/
module.exports.getNOTAM = async (req, res, next) => {
    //const url = `https://www.avdelphi.com/api/1.0/notam.svc?api_key=${process.env.AVDELPHI_API_KEY}&api_password=${process.env.AVDELPHI_API_PASSWORD}&cmd=latest&code_icao=lszh`;
    //const url2 = "https://notams.aim.faa.gov/notamSearch/search";
    //const url3 = "https://pilotweb.nas.faa.gov/PilotWeb/notamRetrievalByICAOAction.do?method=displayByICAOs";
    //const url4 = "https://www.simbrief.com/system/dbquery.php?target=notam&icao=ZSSS&print=1";
    const getUrl = (airportICAO) =>
        `https://www.simbrief.com/system/dbquery.php?target=notam&icao=${airportICAO}&print=1`;

    res.status(200).json({
        status: "success",
        data: {
            url: getUrl("ZSSS"),
        },
    });

    // const browser = await startBrowser();
    // const page = await browser.newPage();
    // await page.goto(getUrl("ZSSS"));

    //const htmlNOTAM = await axios.get(getUrl("ZSSS"));
    //console.log(htmlNOTAM);
    //const dom = new JSDOM(htmlNOTAM.data);
    //const title = dom.window.document.querySelectorAll("p");
    //const $ = cheerio.load(data);
    //res.status(200).send(data);
};

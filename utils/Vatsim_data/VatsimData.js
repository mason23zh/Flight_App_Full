const axios = require("axios");
const { VATSIM_DATA_URL } = require("../../config");
const BadRequestError = require("../../common/errors/BadRequestError");

class VatsimData {
    static async requestVatsimData() {
        try {
            return await axios.get(VATSIM_DATA_URL);
        } catch (e) {
            throw new BadRequestError("Vatsim API ERROR");
        }
    }

    async getVatsimGeneralInfo() {
        return await VatsimData.requestVatsimData();
    }

    async getTotalNumberOfPilots() {
        const vatsimData = await VatsimData.requestVatsimData();
        if (vatsimData.data) {
            return vatsimData.data.pilots.length;
        }
        return -1;
    }

    async getTotalNumberOfControllers() {
        const vatsimData = await VatsimData.requestVatsimData();
        if (vatsimData) {
            return vatsimData.data.controllers.length;
        }
        return -1;
    }

    async getATIS(icao) {
        const vatsimData = await VatsimData.requestVatsimData();
        const vatsimAtisList = vatsimData.data.atis;
        if (vatsimAtisList) {
            for (const atis of vatsimAtisList) {
                if (atis.callsign.includes(icao.toUpperCase())) {
                    return atis.text_atis;
                }
            }
            return `No Vatsim ATIS found in ${icao.toUpperCase()}`;
        }
        return "Vatsim API not available";
    }

    async onlineControllersInAirport(icao) {
        const vatsimData = await VatsimData.requestVatsimData();
        const controllerList = vatsimData.data.controllers;
        const controllerLists = controllerList.filter((controller) => {
            if (controller.callsign.includes(icao.toUpperCase())) {
                return controller;
            }
        });
        return controllerLists;
    }

    async displayControllerRange(icao) {
        const controllerList = await this.onlineControllersInAirport(icao);
        if (controllerList.length > 0) {
            controllerList.forEach((controller) => {
                console.log(controller.callsign + controller.visual_range);
            });
        }
    }
}

module.exports = VatsimData;

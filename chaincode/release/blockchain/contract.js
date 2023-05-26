"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contracts = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const __1 = require("..");
const logger_1 = require("../logger");
const asset_1 = require("./asset");
class Contracts extends fabric_contract_api_1.Contract {
    constructor() {
        super("ContractsContract");
        __1.Logger.write(logger_1.Prefix.WARNING, "Contract has been started.");
    }
    createTour(context, userId, tour) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Creating a tour with the given userId and tourId to fill it with waypoints.  */
            let data;
            __1.Logger.write(logger_1.Prefix.NORMAL, "Trying to create a tour for user id " + userId + ".");
            let bytes = yield context.stub.getState(userId);
            
	     if (bytes == undefined) {
                data = new asset_1.User(userId);
                __1.Logger.write(logger_1.Prefix.WARNING, "State data was empty on createTour, creating a new user instead and going on with procedure.");
            }
            try {
                data = JSON.parse(bytes.toString());
            }
            catch (e) {
                __1.Logger.write(logger_1.Prefix.WARNING, "User (" + userId + ") does not exist. Creating a new user.");
                __1.Logger.write(logger_1.Prefix.ERROR, "Exception catched: " + e + ".");
                data = new asset_1.User(userId);
            }
            let tour_data = JSON.parse(tour);
            tour_data.tourId = data.tours.length.toString();
            data.tours.push(tour_data);
            context.stub.putState(userId, Buffer.from(JSON.stringify(data)));
            __1.Logger.write(logger_1.Prefix.NORMAL, "The tour " + tour_data.tourId + " for user " + userId + " has been generated.");
            __1.Logger.write(logger_1.Prefix.NORMAL, tour);
            return JSON.stringify(tour_data);
        });
    }
    addWaypoint(context, userId, tourId, waypoint) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Adding a waypoint to the given tourId from the given user with userId */
            __1.Logger.write(logger_1.Prefix.NORMAL, "Trying to add Waypoint");
            let bytes = yield context.stub.getState(userId);
            if (bytes.length < 1) {
                __1.Logger.write(logger_1.Prefix.ERROR, "No such user with id" + userId);
                return false;
            }
            let data = JSON.parse(bytes.toString());
            let found = data.tours.find(element => element.tourId == tourId);
            if (!found) {
                __1.Logger.write(logger_1.Prefix.ERROR, "No such tour with id" + tourId);
                return false;
            }
            let waypoint_data = JSON.parse(waypoint);
            found.waypoints.push(waypoint_data);
            context.stub.putState(userId, Buffer.from(JSON.stringify(data)));
            __1.Logger.write(logger_1.Prefix.NORMAL, "The waypoint " + waypoint + " for tour " + tourId + " for user " + userId + " has been generated.");
            __1.Logger.write(logger_1.Prefix.NORMAL, JSON.stringify(data));
            return JSON.stringify(waypoint_data);
        });
    }
    getTour(context, userId, tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Request the tour with the given tourId from the given user with userId */
            __1.Logger.write(logger_1.Prefix.NORMAL, "Request entry with the id " + userId + " from the blockchain.");
            let bytes = yield context.stub.getState(userId);
            if (bytes.length <= 0) {
                __1.Logger.write(logger_1.Prefix.ERROR, "The required entry with id " + userId + " is not available.");
                return false;
            }
            let data = JSON.parse(bytes.toString());
            if(data.tour == undefined)
               __1.Logger.write(logger_1.Prefix.WARNING, "No tour object read")
              return false 
	let found = data.tours.find(element => element.tourId == tourId);
            if (!found)
                return false;
            __1.Logger.write(logger_1.Prefix.SUCCESS, "Tour " + tourId + " for user " + userId + " has been found and sent to the requester.");
            return JSON.stringify(found);
        });
    }

    getTours(context, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Request all tours from the given user with userId */
            __1.Logger.write(logger_1.Prefix.NORMAL, "Request entry with the id " + userId + " from the blockchain.");
            let bytes = yield context.stub.getState(userId);
            if (bytes.length <= 0) {
                __1.Logger.write(logger_1.Prefix.ERROR, "The required entry with id " + userId + " is not available.");
                return false;
            }
            let data = JSON.parse(bytes.toString());
            __1.Logger.write(logger_1.Prefix.SUCCESS, "Tours for user " + userId + " has been found and sent to the requester.");
            return JSON.stringify(data.tours);
        });
    }
}
exports.Contracts = Contracts;

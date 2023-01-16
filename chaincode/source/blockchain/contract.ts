import { ThreadAutoArchiveDuration } from 'discord.js';
import { Context, Contract } from 'fabric-contract-api';
import { Logger } from '..';
import { Prefix } from '../logger';
import { Tour, Waypoint, User } from './asset';

export class Contracts extends Contract {

    constructor() {
        super("ContractsContract");
        Logger.write(Prefix.WARNING, "Contract has been started.");
    }

    public async createTour(context: Context, userId: string, tour: string) {
        /* Creating a tour with the given userId and tourId to fill it with waypoints.  */

        Logger.write(Prefix.NORMAL, "Trying to create a tour for user id " + userId + ".");

        let bytes = await context.stub.getState(userId);

        if (bytes.length < 1)
            return false;

        let data: User = JSON.parse(bytes.toString());
        let tour_data: Tour = JSON.parse(tour);

        data.tours.push(tour_data);
        tour_data.tourId = data.tours.length.toString();

        context.stub.putState(userId, Buffer.from(JSON.stringify(data)));
        Logger.write(Prefix.NORMAL, "The tour " + tour_data.tourId + " for user " + userId + " has been generated.");

        return JSON.stringify(tour);
    }

    public async addWaypoint(context: Context, userId: string, tourId: string, waypoint: string) {
        /* Adding a waypoint to the given tourId from the given user with userId */

        let bytes = await context.stub.getState(userId);

        if (bytes.length < 1)
            return false;

        let data: User = JSON.parse(bytes.toString());
        let found = data.tours.find(element => element.tourId == tourId);

        if (!found)
            return false;

        let waypoint_data: Waypoint = JSON.parse(waypoint);
        found.waypoints.push(waypoint_data);

        context.stub.putState(userId, Buffer.from(JSON.stringify(data)));
        Logger.write(Prefix.NORMAL, "The waypoint " + waypoint + " for tour " + tourId + " for user " + userId + " has been generated.");

        return JSON.stringify(waypoint);
    }

    public async getTour(context: Context, userId: string, tourId: string) {
        /* Request the tour with the given tourId from the given user with userId */

        Logger.write(Prefix.NORMAL, "Request entry with the id " + userId + " from the blockchain.");

        let bytes = await context.stub.getState(userId);

        if (bytes.length <= 0) {
            Logger.write(Prefix.ERROR, "The required entry with id " + userId + " is not available.");
            return false;
        }

        let data: User = JSON.parse(bytes.toString());
        let found = data.tours.find(element => element.tourId == tourId);

        if (!found)
            return false;

        Logger.write(Prefix.SUCCESS, "Tour " + tourId + " for user " + userId + " has been found and sent to the requester.");

        return JSON.stringify(found);
    }

    public async getTours(context: Context, userId: string) {
        /* Request all tours from the given user with userId */

        Logger.write(Prefix.NORMAL, "Request entry with the id " + userId + " from the blockchain.");

        let bytes = await context.stub.getState(userId);

        if (bytes.length <= 0) {
            Logger.write(Prefix.ERROR, "The required entry with id " + userId + " is not available.");
            return false;
        }

        let data: User = JSON.parse(bytes.toString());
        Logger.write(Prefix.SUCCESS, "Tours for user " + userId + " has been found and sent to the requester.");

        return JSON.stringify(data.tours);
    }
}
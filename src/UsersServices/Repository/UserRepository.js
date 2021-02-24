const AWS = require("aws-sdk");
const User = require("../Models/User");
const BaseRepository = require("./BaseRepository");
const Constants = require("../../Common/Constants");

const LogHelper = require("../../Common/LogHelper");
const Log = new LogHelper.LogHelper();
const {
    v4: uuidv4
} = require('uuid');

AWS.config.update({
    region: "ap-southeast-2"
});

class UserRepository extends BaseRepository {
    async getUserByPK(pk) {
        let user = null;
        let dbItems = await super.getAllItems(pk);
        if (
            dbItems == null ||
            dbItems.length > 1 ||
            typeof dbItems.error != "undefined"
        ) {
            Log.Exception(
                "UserRepository",
                `Status Code: ${Constants.ResponseCode.RESOURCE_NOT_FOUND}
                Could not get user by pk as user is not found.`,
                "",
                `getUserByPK()`
            );
            return {
                statusCode: Constants.ResponseCode.RESOURCE_NOT_FOUND,
                error: `Could not get user by pk as user is not found.`
            };
        }
        if (dbItems) {
            user = new User();
            user.PushDbObjectRow(dbItem);
        }
        return user;
    }
    async getUserByEmail(email) {
        let user = null;
        let dbItems = await super.getAllItemsFromIndex(Constants.UserServiceIndex.GSI2KEYS.PK, email, Constants.UserServiceIndex.GSI2NAME);
        if (
            dbItems == null ||
            dbItems.length > 1 ||
            typeof dbItems.error != "undefined"
        ) {
            Log.Exception(
                "UserRepository",
                `Status Code: ${Constants.ResponseCode.RESOURCE_NOT_FOUND}
                Could not get user by id as user is not found.`,
                "",
                `getUserByEmail()`
            );
            return {
                statusCode: Constants.ResponseCode.RESOURCE_NOT_FOUND,
                error: `Could not get user by email as user is not found.`
            };
        }
        if (dbItems) {
            user = new User();
            user.PushDbObjectRow(dbItem);
        }
        return user;
    }

    async updateLoginState(id, version) {
        let params = {
            pk: id,
            version: version,
            eventCode: Constants.UserEventCode.LOGIN,
            timestamp: new Date().toUTCString()
        };
        return await super.putItem(params);
    }

    async createUser(userParams, userId) {
        if (!userId || typeof userId === undefined || userId === null) {
            userId = userParams.PK;
        }
        return await super.putItem(userParams, false, Constants.UserEventCode.CREATE, userId);
    }

    async getUserBySession(session) {
        let requestItems = {
            KeyConditionExpression: "#pkName = :pkey",
            ExpressionAttributeNames: {
                "#pkName": Constants.UserServiceIndex.GSI1KEYS.PK
            },
            ExpressionAttributeValues: {
                ":pkey": session,
            }
        };
        return await super.getAllItemsFromIndex(Constants.UserServiceIndex.GSI1KEYS.PK, session, Constants.UserServiceIndex.GSI1NAME)[0];
    }
}

module.exports = UserRepository;
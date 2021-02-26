/**
 * Base Repository is the base class for other repository
 */

const AWS = require("aws-sdk");
const Constants = require("../Common/Config/Constants");
const LogHelper = require("../Common/Helper/LogHelper");
const FormatResponse = require("../Common/Helper/ResponseHelper").formatResponse;

const dynamoDbclient = new AWS.DynamoDB.DocumentClient();
const Log = new LogHelper.LogHelper();
const tableName = process.env.TableName;

class BaseRepository {
    /**
     * getAllItems By Primary Key
     * @param {*} pk 
     */
    async getAllItems(pk) {

        // Query Item which matches Query string in AWS DynamoDB
        var requestItems = {
            TableName: tableName,
            KeyConditionExpression: "PK = :pk",
            ExpressionAttributeValues: {
                ":pk": pk
            }
        };

        // Getting data
        try {
            const data = await dynamoDbclient.query(requestItems).promise();

            // Logging information
            Log.Info(
                "BaseRepository",
                "DB query result:" + JSON.stringify(data),
                "getAllItems()"
            );

            //console.log("DB query result:" + JSON.stringify(data));
            if (data.Count > 0) {
                return data.Items;
            } else {
                return null;
            }

        } catch (error) {

            //Logging Exception
            Log.Exception(
                "BaseRepository",
                `Status Code: ${Constants.ResponseCode.RESOURCE_NOT_FOUND}
                Failed to query items by pk: ${error.stack}`,
                "",
                "getAllItems()"
            );

            return FormatResponse(Constant.ResponseCode.RESOURCE_NOT_FOUND, `Failed to  query items by pk: ${error.stack}`);
        }
    }

    /**
     * GetAllItemsByIndex
     * @param {*} pkName 
     * @param {*} pkVal 
     * @param {*} indexName 
     */
    async getAllItemsByIndex(pkName, pkVal, indexName) {

        //Define requestItesm Params
        var requestItems = {
            TableName: tableName,
            IndexName: indexName,
            KeyConditionExpression: "#PK = :pkey ",
            ExpressionAttributeValues: {
                ":pkey": pkVal
            },
            ExpressionAttributeNames: {
                "#PK": pkName
            }
        };

        // Getting data
        try {
            //Query Data
            const data = await dynamoDbclient.query(requestItems).promise();

            //Logging 
            Log.Info(
                "BaseRepository",
                "DB query result:" + JSON.stringify(data),
                "getAllItemsByIndex()"
            );

            //Return queried data
            //console.log("DB query result:" + JSON.stringify(data));
            if (data.Count > 0) {
                return data.Items;
            } else {
                return null;
            }

        } catch (error) {
            //Logging
            Log.Exception(
                "BaseRepository",
                `Status Code: ${Constants.ResponseCode.RESOURCE_NOT_FOUND}\n\r` +
                `Failed to query items by pk: ${error.stack}`,
                "",
                "getAllItemsByIndex()"
            );

            return FormatResponse(Constants.ResponseCode.RESOURCE_NOT_FOUND,
                `Failed query items by pk: ${error.stack}`);
        }
    }

    /**
     * GetItemByIndex
     * @param {*} pkName 
     * @param {*} pkVal 
     * @param {*} skName 
     * @param {*} skVal 
     * @param {*} indexName 
     */
    async getItemByIndex(pkName, pkVal, skName, skVal, indexName) {

        // Define Query string
        var requestItems = {
            TableName: tableName,
            IndexName: indexName,
            KeyConditionExpression: pkName + " = :pkey and #skName = :skey",

            ExpressionAttributeNames: {
                "#skName": skName
            },

            ExpressionAttributeValues: {
                ":pkey": pkVal,
                ":skey": skVal
            }
        };

        // Getting data
        try {
            //Try to query data
            const data = await dynamoDbclient.query(requestItems).promise();

            //Logogging
            Log.Verbose(
                "BaseRepository",
                "DB query result:" + JSON.stringify(data),
                "getItemByIndex()"
            );

            if (data.Count > 0) {
                //Logging
                Log.Verbose(
                    "BaseRepository",
                    "DB query index result:" + JSON.stringify(data.Items[0]),
                    "getItemByIndex()"
                );

                return data.Items[0];
            } else {
                return null;
            }
        } catch (error) {
            //Logging
            Log.Exception(
                "BaseRepository",
                `Status Code: ${Constants.ResponseCode.RESOURCE_NOT_FOUND}\n\r` +
                `Could not query index items by pk and name: ${error.stack}`,
                "",
                "getItemByIndex()"
            );

            return FormatResponse(Constants.ResponseCode.RESOURCE_NOT_FOUND,
                `Could not query index items by pk and name: ${error.stack}`);
        }
    }

    /**
     * Get Item by Primary Key and Sort Key
     * @param {*} pk 
     * @param {*} sk 
     */
    async getItem(pk, sk) {
        // Query String
        var requestItems = {
            TableName: tableName,
            KeyConditionExpression: "PK = :pkey and #Name = :skey",
            ExpressionAttributeNames: {
                "#Name": "Name"
            },
            ExpressionAttributeValues: {
                ":pkey": pk,
                ":skey": sk
            }
        };

        // Getting data
        try {
            const data = await dynamoDbclient.query(requestItems).promise();

            //console.log("DB query result:" + JSON.stringify(data));
            Log.Info(
                "BaseRepository",
                "DB query result:" + JSON.stringify(data),
                "getItem()"
            );

            if (data.Count > 0) {
                //  console.log(
                //    "DB query returns result:" + JSON.stringify(data.Items[0])
                //);
                Log.Info(
                    "BaseRepository",
                    "DB query result:" + JSON.stringify(data.Items[0]),
                    "getItem()"
                );

                return data.Items[0];
            } else {
                return null;
            }
        } catch (error) {
            //Logging
            Log.Exception(
                "BaseRepository",
                `Status Code: ${Constants.ResponseCode.RESOURCE_NOT_FOUND}\n\r` +
                `Could not query items by pk and name: ${error.stack}`,
                "",
                "getItem()"
            );

            return FormatResponse(Constants.ResponseCode.RESOURCE_NOT_FOUND,
                `Could not query items by pk and name: ${error.stack}`);
        }
    }

    /**
     * 
     * @param {*} pk 
     * @param {*} sk 
     * @param {*} userId 
     */
    async deleteItem(pk, sk, userId) {
        let isExists = false;
        isExists = await this.ifExistsInDb(params.Key.PK, params.Key.Name);

        if (isExists) {
            Log.Info(
                "BaseRepository",
                "DB query result:" + JSON.stringify(data),
                "deleteItem"
            );
            return true;

        } else {
            return false;

        }

    }

    /**
     * Put item to update existing or create new item
     * @param {*} Item 
     * @param {*} updateIfExist 
     * @param {*} EventCode 
     * @param {*} userPK 
     */
    async putItem(Item, updateIfExist, EventCode, userPK) {
        // Logging
        Log.Verbose(
            "BaseRepository",
            "Item :" + JSON.stringify(Item),
            "putItem()"
        );

        //Verify whether the item exists in the db
        let isItemExist = false;
        if (Item) {
            isItemExist = await this.isExistsInDb(Item.PK, Item.username);
        }

        var requestItems = {
            TableName: tableName,
            Item
        };

        Item.ActionUser = userPK;
        if (EventCode !== null) {
            Item.EventCode = EventCode;
        }

        // if Item does not exist or if item exists and updating item is true
        if (!isItemExist || (isItemExist && updateIfExist)) {
            try {
                //Logging
                Log.Verbose(
                    "BaseRepository",
                    "Item exists:" + isItemExist,
                    "putItem()"
                );

                //Update Data
                const data = await dynamoDbclient.put(requestItems).promise();

                //Logging
                Log.Info("BaseRepository", "Item saved:" + JSON.stringify(data), "putItem()");

                return data;
            } catch (error) {
                //Logging
                Log.Exception(
                    "BaseRepository",
                    `Status Code: ${Constants.ResponseCode.SERVICE_REQUEST_FAILURE}\n\rCould not put items: ${JSON.stringify(error)}`,
                    "",
                    "putItem()"
                );

                return FormatResponse(Constants.ResponseCode.SERVICE_REQUEST_FAILURE,
                    `Could not put items: ${JSON.stringify(error)}`);
            }
        } else {

            //Logging: Item does not exist 
            //Jennifer: Logic problem ???
            if (!isItemExist) {
                Log.Exception(
                    "BaseRepository",
                    `Status Code: ${Constants.ResponseCode.RESOURCE_NOT_FOUND}\n\rItem not found: ${Item.PK}`,
                    "",
                    "putItem()"
                );

                return FormatResponse(Constants.ResponseCode.RESOURCE_NOT_FOUND, `Item not found: ${Item.PK}`);
            } else {
                Log.Exception(
                    "BaseRepository",
                    `Status Code: ${Constants.ResponseCode.SERVICE_REQUEST_FAILURE}\n\rItem already exists and not allowed to be updated: ${Item.PK}`,
                    "",
                    "putItem()"
                );

                return FormatResponse(Constants.ResponseCode.SERVICE_REQUEST_FAILURE,
                    `Item already exists and not allowed to be updated: ${Item.PK}`);
            }
        }
    }

    /**
     * UpdateItem
     * @param {*} params 
     */
    async updateItem(params) {
        //verify whether item exists
        let itemExist = false;

        //Jennifer: Try Catch ????
        if (params) {
            itemExist = await this.ifExistsInDb(params.Key.PK, params.Key.Name);
        }

        //If Item Exists
        if (itemExist) {

            //Query string
            var requestItems = {
                TableName: tableName,
                ReturnConsumedCapacity: "TOTAL",
                ReturnItemCollectionMetrics: "SIZE",
                ReturnValues: "UPDATED_NEW"
            };

            //Query Item
            requestItems = Object.assign(requestItems, params);

            //Update Item
            try {
                Log.Verbose(
                    "BaseRepository",
                    "Item exists:" + itemExist,
                    "updateItem()"
                );

                const data = await dynamoDbclient.update(requestItems).promise();

                //Logging
                Log.Info(
                    "BaseRepository",
                    "Item saved:" + JSON.stringify(data),
                    "updateItem()"
                );

                //Verify whether Data exists or not
                if (data && data.Attributes) {
                    return data;
                } else {
                    //Logging
                    Log.Info(
                        "BaseRepository",
                        `Status Code: ${Constants.ResponseCode.SUCCEED_OK}\n\rNo attribute has been updated.`,
                        "updateItem()"
                    );

                    return FormatResponse(Constants.ResponseCode.SUCCEED_OK,
                        `No attribute has been updated`);
                }
            } catch (error) {
                //Logging
                Log.Exception(
                    "BaseRepository",
                    `Status Code: ${Constants.ResponseCode.SERVICE_REQUEST_FAILURE}\n\rCould not put items: ${JSON.stringify(error)}`,
                    "updateItem()"
                );

                return FormatResponse(Constants.ResponseCode.SERVICE_REQUEST_FAILURE,
                    `Could not put items: ${JSON.stringify(error)}`);
            }
        } else {
            //Logging
            Log.Exception(
                "BaseRepository",
                `Status Code: ${Constants.ResponseCode.RESOURCE_NOT_FOUND}\n\r` +
                "Item not found:" +
                params.Key.PK +
                ":" +
                params.Key.Name,
                "",
                "updateItem()"
            );

            return FormatResponse(Constants.ResponseCode.RESOURCE_NOT_FOUND,
                "Item not found:" + params.Key.PK + ":" + params.Key.Name);
        }
    }

    /**
     * isEcistsInDB to verify whether an item exists in DB or not.
     * @param {*} id 
     * @param {*} name 
     */
    async isExistsInDb(id, name) {
        let result = null;
        let dbResult = null;

        if (name) {
            dbResult = await this.getItem(id, name);

            Log.Info(
                "BaseRepository",
                "Found Item:" + JSON.stringify(dbResult),
                "isExistsInDb()"
            );

        } else {
            dbResult = await this.getAllItems(id);
        }

        if (dbResult) {
            Log.Verbose("BaseRepository", "Result is not null", "isExistsInDb()");

            if (!dbResult.error) {
                result = dbResult;
            }
        }
        return result;
    }

    /**
     * SearchItem in DB
     * @param {*} itemParams 
     */
    async searchItem(itemParams) {
        let result = null;

        try {
            const data = await dynamoDbclient.query(itemParams).promise();

            //Logging
            Log.Info(
                "BaseRepository",
                "DB search result:" + JSON.stringify(data),
                "searchItem()"
            );

            //Verify Data
            if (data.Count > 0) {
                Log.Info(
                    "BaseRepository",
                    "DB search returns result:" + JSON.stringify(data.Items[0]),
                    "searchItem()"
                );

                return data.Items[0];
            } else {
                return null;
            }
        } catch (error) {
            //Logging
            Log.Exception(
                "BaseRepository",
                `Status Code: ${Constants.ResponseCode.SERVICE_REQUEST_FAILURE}\n\r` +
                `Could not search items: ${JSON.stringify(error)} ` +
                "ItemParams: " +
                JSON.stringify(itemParams),
                "",
                "searchItem()"
            );

            return FormatResponse(Constants.ResponseCode.SERVICE_REQUEST_FAILURE,
                `Could not search items: ${JSON.stringify(error)} ` +
                "ItemParams: " +
                JSON.stringify(itemParams));
        }
        return result;
    }
}


module.exports = BaseRepository;
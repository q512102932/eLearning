const AWS = require("aws-sdk");
const Constant = require("../../Common/Constants");
const tableName = process.env.TableName;
const dynamoDbclient = new AWS.DynamoDB.DocumentClient();

const LogHelper = require("../../Common/LogHelper");
const Log = new LogHelper.LogHelper();
const FormatResponse = require("../../Common/ResponseHelper").formatResponse;

class BaseRepository {
	async getAllItems(pk) {
		var requestItems = {
			TableName: tableName,
			KeyConditionExpression: "PK = :pk",
			ExpressionAttributeValues: {
				":pk": pk
			}
		};
		try {
			const data = await dynamoDbclient.query(requestItems).promise();
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
			Log.Exception(
				"BaseRepository",
				`Status Code: ${Constant.ResponseCode.RESOURCE_NOT_FOUND}
                Could not query items by pk: ${error.stack}`,
				"",
				"getAllItems()"
			);
			return FormatResponse(Constant.ResponseCode.RESOURCE_NOT_FOUND, `Could not query items by pk: ${error.stack}`);
		}
	}
	async getAllItemsFromIndex(pkName, pkVal, indexName) {
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


		try {
			const data = await dynamoDbclient.query(requestItems).promise();
			Log.Info(
				"BaseRepository",
				"DB query result:" + JSON.stringify(data),
				"getAllItemsFromIndex()"
			);
			//console.log("DB query result:" + JSON.stringify(data));
			if (data.Count > 0) {
				return data.Items;
			} else {
				return null;
			}
		} catch (error) {
			Log.Exception(
				"BaseRepository",
				`Status Code: ${Constant.ResponseCode.RESOURCE_NOT_FOUND}\n\r` +
				`Could not query items by pk: ${error.stack}`,
				"",
				"getAllItemsFromIndex()"
			);
			return FormatResponse(Constant.ResponseCode.RESOURCE_NOT_FOUND,
				`Could not query items by pk: ${error.stack}`);
		}
	}

	async getItemFromIndex(pkName, pkVal, skName, skVal, indexName) {
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

		try {
			const data = await dynamoDbclient.query(requestItems).promise();
			Log.Verbose(
				"BaseRepository",
				"DB query result:" + JSON.stringify(data),
				"getItemFromIndex()"
			);
			if (data.Count > 0) {
				Log.Verbose(
					"BaseRepository",
					"DB query index result:" + JSON.stringify(data.Items[0]),
					"getItemFromIndex()"
				);

				return data.Items[0];
			} else {
				return null;
			}
		} catch (error) {
			Log.Exception(
				"BaseRepository",
				`Status Code: ${Constant.ResponseCode.RESOURCE_NOT_FOUND}\n\r` +
				`Could not query index items by pk and name: ${error.stack}`,
				"",
				"getItemFromIndex()"
			);
			return FormatResponse(Constant.ResponseCode.RESOURCE_NOT_FOUND,
				`Could not query index items by pk and name: ${error.stack}`);
		}
	}

	async getItem(pk, sk) {
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
			Log.Exception(
				"BaseRepository",
				`Status Code: ${Constant.ResponseCode.RESOURCE_NOT_FOUND}\n\r` +
				`Could not query items by pk and name: ${error.stack}`,
				"",
				"getItem()"
			);
			return FormatResponse(Constant.ResponseCode.RESOURCE_NOT_FOUND,
				`Could not query items by pk and name: ${error.stack}`);
		}
	}

	async deleteItem(pk, sk, userId) {
		//TODO
	}

	async putItem(Item, updateIfExist, EventCode, userPK) {
		Log.Verbose(
			"BaseRepository",
			"Item :" + JSON.stringify(Item),
			"putItem()"
		);
		let ifItemExist = false;
		if (Item) {
			ifItemExist = await this.ifExistsInDb(Item.PK, Item.username);
		}
		var requestItems = {
			TableName: tableName,
			Item
		};
		Item.ActionUser = userPK;
		if (EventCode !== null) {
			Item.EventCode = EventCode;
		}

		if (!ifItemExist || (ifItemExist && updateIfExist)) {
			try {
				Log.Verbose(
					"BaseRepository",
					"Item exists:" + ifItemExist,
					"putItem()"
				);
				const data = await dynamoDbclient.put(requestItems).promise();
				Log.Info("BaseRepository", "Item saved:" + JSON.stringify(data), "putItem()");
				return data;
			} catch (error) {
				Log.Exception(
					"BaseRepository",
					`Status Code: ${Constant.ResponseCode.SERVICE_REQUEST_FAILURE}\n\rCould not put items: ${JSON.stringify(error)}`,
					"",
					"putItem()"
				);
				return FormatResponse(Constant.ResponseCode.SERVICE_REQUEST_FAILURE,
					`Could not put items: ${JSON.stringify(error)}`);
			}
		} else {
			if (!ifItemExist) {
				Log.Exception(
					"BaseRepository",
					`Status Code: ${Constant.ResponseCode.RESOURCE_NOT_FOUND}\n\rItem not found: ${Item.PK}`,
					"",
					"putItem()"
				);
				return FormatResponse(Constant.ResponseCode.RESOURCE_NOT_FOUND, `Item not found: ${Item.PK}`);
			} else {

				Log.Exception(
					"BaseRepository",
					`Status Code: ${Constant.ResponseCode.SERVICE_REQUEST_FAILURE}\n\rItem already exists and not allowed to be updated: ${Item.PK}`,
					"",
					"putItem()"
				);
				return FormatResponse(Constant.ResponseCode.SERVICE_REQUEST_FAILURE,
					`Item already exists and not allowed to be updated: ${Item.PK}`);
			}
		}
	}

	async updateItem(params) {
		let itemExist;
		if (params) {
			itemExist = await this.ifExistsInDb(params.Key.PK, params.Key.Name);
		}

		if (itemExist) {
			var requestItems = {
				TableName: tableName,
				ReturnConsumedCapacity: "TOTAL",
				ReturnItemCollectionMetrics: "SIZE",
				ReturnValues: "UPDATED_NEW"
			};
			requestItems = Object.assign(requestItems, params);

			try {
				Log.Verbose(
					"BaseRepository",
					"Item exists:" + itemExist,
					"updateItem()"
				);
				const data = await dynamoDbclient.update(requestItems).promise();
				Log.Info(
					"BaseRepository",
					"Item saved:" + JSON.stringify(data),
					"updateItem()"
				);

				if (data && data.Attributes) {
					return data;
				} else {
					Log.Info(
						"BaseRepository",
						`Status Code: ${Constant.ResponseCode.SUCCEED_OK}\n\rNo attribute has been updated.`,
						"updateItem()"
					);
					return FormatResponse(Constant.ResponseCode.SUCCEED_OK,
						`No attribute has been updated`);
				}
			} catch (error) {
				Log.Exception(
					"BaseRepository",
					`Status Code: ${Constant.ResponseCode.SERVICE_REQUEST_FAILURE}\n\rCould not put items: ${JSON.stringify(error)}`,
					"updateItem()"
				);
				return FormatResponse(Constant.ResponseCode.SERVICE_REQUEST_FAILURE,
					`Could not put items: ${JSON.stringify(error)}`);
			}
		} else {
			Log.Exception(
				"BaseRepository",
				`Status Code: ${Constant.ResponseCode.RESOURCE_NOT_FOUND}\n\r` +
				"Item not found:" +
				params.Key.PK +
				":" +
				params.Key.Name,
				"",
				"updateItem()"
			);
			return FormatResponse(Constant.ResponseCode.RESOURCE_NOT_FOUND,
				"Item not found:" + params.Key.PK + ":" + params.Key.Name);
		}
	}

	async ifExistsInDb(id, name) {
		let result = null;
		let dbResult;
		if (name) {
			dbResult = await this.getItem(id, name);
			Log.Info(
				"BaseRepository",
				"Found Item:" + JSON.stringify(dbResult),
				"ifExistsInDb()"
			);
		} else {
			dbResult = await this.getAllItems(id);
		}

		if (dbResult) {
			Log.Verbose("BaseRepository", "Result is not null", "ifExistsInDb()");
			if (!dbResult.error) {
				result = dbResult;
			}
		}
		return result;
	}

	async searchItem(itemParams) {
		let result = null;
		try {
			const data = await dynamoDbclient.query(itemParams).promise();
			Log.Info(
				"BaseRepository",
				"DB search result:" + JSON.stringify(data),
				"searchItem()"
			);
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
			Log.Exception(
				"BaseRepository",
				`Status Code: ${Constant.ResponseCode.SERVICE_REQUEST_FAILURE}\n\r` +
				`Could not search items: ${JSON.stringify(error)} ` +
				"ItemParams: " +
				JSON.stringify(itemParams),
				"",
				"searchItem()"
			);
			return FormatResponse(Constant.ResponseCode.SERVICE_REQUEST_FAILURE,
				`Could not search items: ${JSON.stringify(error)} ` +
				"ItemParams: " +
				JSON.stringify(itemParams));
		}
		return result;
	}
}
module.exports = BaseRepository;
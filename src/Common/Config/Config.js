export const AWS = require("aws-sdk");

export const User = require("../../Models/User");
export const BaseRepository = require("../../Repository/BaseRepository");

export const Constants = require("./Constants");
export const LogHelper = require("../Helper/LogHelper");
export const FormatResponse = require("../Helper/ResponseHelper").formatResponse;

export const TableName = process.env.TableName;

export const DbClient = new AWS.DynamoDB.DocumentClient();
export const Logger = new LogHelper.LogHelper();
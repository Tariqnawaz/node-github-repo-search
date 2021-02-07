"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const redis_1 = __importDefault(require("redis"));
const redisConfig = {
    host: 'localhost',
    port: 6379,
    pass: ''
};
// creating redis client
const client = redis_1.default.createClient(redisConfig);
client.on('connect', () => {
    console.log('Connected to redis');
});
module.exports = client;

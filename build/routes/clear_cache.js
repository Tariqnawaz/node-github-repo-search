"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const redis_1 = __importDefault(require("../redis/redis"));
const router = express_1.default.Router();
/**
 * This method clears all data from redis store.
 * using flushAll for clearing data.
 */
const clearCacheApi = router.get('/', function (req, res) {
    redis_1.default.flushall((err, data) => {
        if (err) {
            return res.status(500).send('Internal Server Error, while flushing data from store.');
        }
        else {
            return res.status(200).json({
                'data': 'cache data cleared successfully.'
            });
        }
    });
});
module.exports = clearCacheApi;

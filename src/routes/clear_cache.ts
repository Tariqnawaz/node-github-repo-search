import express, {Request, Response} from 'express';
import client from '../redis/redis';

const router = express.Router();

/**
 * This method clears all data from redis store.
 * using flushAll for clearing data.
 */
const clearCacheApi = router.get('/', function (req, res) {
    client.flushall((err, data)=>{
        if(err){
            return res.status(500).send('Internal Server Error, while flushing data from store.');
        }else{
            return  res.status(200).json({
                'data': 'cache data cleared successfully.'
            })
        }
    })
})

export = clearCacheApi;
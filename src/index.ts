import express, {Application} from 'express';
import swaggerUI from 'swagger-ui-express'
import searchApi from './routes/search';
import clearCacheApi from './routes/clear_cache';
import * as swaggerDocument from './swagger.json';

const app: Application = express();
const port: Number = 3000;

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

/** 
 * API post call for searhing data. 
 */
app.use('/api/search', searchApi);

/** 
 * API get call for clearing cache data. 
 */
app.use('/api/clear-cache', clearCacheApi);

/** 
 * swagger step up
 * url: http://localhost:3000/swagger/
 */
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});
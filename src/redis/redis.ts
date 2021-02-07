import redis from 'redis';

const redisConfig= {
    host: 'localhost',
    port: 6379,
    pass: ''
}
// creating redis client
const client = redis.createClient(redisConfig);

client.on('connect', () => {
    console.log('Connected to redis');
});
export = client;
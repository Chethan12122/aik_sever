
const Redis = require('ioredis');

const redisClient = new Redis({
  host: 'aikyamrediscache.redis.cache.windows.net',
  port: 6380,
  password: 'OT4smnPzSO9tyd1rBtRzcCSVifnomrxK2AzCaJD8snE=',
  tls: { rejectUnauthorized: true },
  connectTimeout: 10000
});

async function testRedis() {
  try {
    console.log('Attempting to connect to Azure Redis...');
    await redisClient.set('testKey', 'Hello from Azure Redis!');
    console.log('✅ Value set in Redis');
    const value = await redisClient.get('testKey');
    console.log('✅ Value from Redis:', value);
    await redisClient.quit();
    console.log('✅ Disconnected from Redis');
  } catch (err) {
    console.error('❌ Redis error:', err);
  }
}

testRedis();

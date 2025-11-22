// const { createClient } = require('redis');

// const redisClient = createClient({
//   url: process.env.REDIS_URL || 'redis://localhost:6379', 
// });
// console.log(process.env.REDIS_URL);

// redisClient.on('error', (err) => {
//   console.error('❌ Redis Client Error:', err);
// });

// (async () => {
//   try {
//     await redisClient.connect();
//     console.log('✅ Connected to Redis');
//   } catch (err) {
//     console.error('❌ Failed to connect to Redis:', err);
//   }
// })();

// module.exports = redisClient;

const { createClient } = require('redis');

// Use environment variable REDIS_URL or fall back to default for local Redis connection
const redisClient = createClient({
  url: process.env.REDIS_URL || 'rediss://localhost:6379',  // Redis URL with SSL/TLS (use your actual Redis URL)
  socket: {
    tls: true,  // Enable TLS for secure connection (SSL)
    rejectUnauthorized: false,  // Allow self-signed certificates (adjust as per your Redis service requirements)
    connectTimeout: 20000,  // Set connection timeout to 20 seconds
  },
});

// Error handling for Redis client
redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err.message || err);
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Connected to Redis');
    
    // Test: Set a key-value pair in Redis
    await redisClient.set('testKey', 'Hello from Redis!');
    console.log('✅ Value set in Redis');

    // Test: Get the value back from Redis
    const value = await redisClient.get('testKey');
    console.log('✅ Value from Redis:', value);

    // Disconnect from Redis
    // await redisClient.quit();
    // console.log('✅ Disconnected from Redis');
  } catch (err) {
    console.error('❌ Failed to connect to Redis:', err.message || err);
  }
})();

// Export redis client to use in other parts of the application
module.exports = redisClient;


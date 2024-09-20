import { createClient } from 'redis';

const client = createClient({
  host: 'localhost',
  port: 6379
});
await client.connect();


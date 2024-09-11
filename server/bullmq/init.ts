import { Queue } from 'bullmq'

// Create a new connection in every instance
const myQueue = new Queue('myqueue', {
  connection: {
    host: 'localhost',
    port: 6379
  }
});


export default myQueue

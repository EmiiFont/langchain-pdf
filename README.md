# First Time Setup

## Using Bun [Recommended]

```
# Install dependencies
bun install

# Initialize the database
bunx prisma migrate dev

```

# Running the app [Pipenv]

There are three separate processes that need to be running for the app to work: the server, the worker, and Redis.

If you stop any of these processes, you will need to start them back up!

Commands to start each are listed below. If you need to stop them, select the terminal window the process is running in and press Control-C

### To run the Python server

Open a new terminal window and create a new virtual environment:


run under server directory
```
bun run dev
```

### To run the worker

Open a new terminal window and create a new virtual environment:

under file-server directory
```
bun run index.ts
```

### To run Redis

```
redis-server
```

### to run the client

Open a new terminal window and create a new virtual environment:

under client directory
```
bun run dev
```
### To reset the database

Open a new terminal window 

```
bunx prisma migrate dev
```

# Running the app [Venv]


There are three separate processes that need to be running for the app to work: the server, the worker, and Redis.

If you stop any of these processes, you will need to start them back up!

Commands to start each are listed below. If you need to stop them, select the terminal window the process is running in and press Control-C



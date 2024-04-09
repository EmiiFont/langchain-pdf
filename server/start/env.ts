/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),
  // SESSION_PERMANENT = True
  // SECRET_KEY: Env.schema.string(),
  // SQLALCHEMY_DATABASE_URI: Env.schema.string(),
  // UPLOAD_URL: Env.schema.string(),
  // // CELERY = {
  //     "broker_url": os.environ.get("REDIS_URI", False),
  //     "task_ignore_result": True,
  //     "broker_connection_retry_on_startup": False,
  // }

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const)
})

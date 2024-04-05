/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const UsersController = () => import('#controllers/users_controller')
const ConversationsController = () => import('#controllers/conversations_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const ClientsController = () => import('#controllers/clients_controller')

router.get('/:path?', [ClientsController, 'catchAll'])

router.get('users', [UsersController, 'getUser'])
router.post('users', [UsersController, 'signUp'])
router.post('users', [UsersController, 'signOut'])
router.post('users', [UsersController, 'signIn'])

router.get('api/conversations', [ConversationsController, 'index']).use(middleware.auth())
router
  .post('api/conversations', [ConversationsController, 'createConversation'])
  .use(middleware.auth())

router
  .post('api/conversations/:conversation_id/messages', [ConversationsController, 'createMessage'])
  .use(middleware.auth())

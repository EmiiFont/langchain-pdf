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
const ClientsController = () => import('#controllers/clients_controller')
import { middleware } from '#start/kernel'
const PdfsController = () => import('#controllers/pdfs_controller')

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

router
  .post('api/pdfs', [PdfsController, 'uploadFile'])
  .use(middleware.auth())
  .use(middleware.handleFileUpload())
router.get('api/pdfs', [PdfsController, 'list']).use(middleware.auth())
router.get('api/pdfs/:pdf_id', [PdfsController, 'show']).use(middleware.auth())

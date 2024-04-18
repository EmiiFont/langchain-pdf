/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

// const ConversationsController = () => import('#controllers/conversations_controller')
import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/users_controller')
import { middleware } from '#start/kernel'
const ClientsController = () => import('#controllers/clients_controller')
const ConversationsController = () => import('#controllers/conversations_controller')
const PdfsController = () => import('#controllers/pdfs_controller')

router.get('api/', () => {
  return 'Hello world from the home page.'
})

router.get('api/auth/user', [AuthController, 'index'])
router.post('api/auth', [AuthController, 'signUp'])
router.post('api/auth/signOut', [AuthController, 'signOut'])
router.post('api/auth/signin', [AuthController, 'signIn'])

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
router.get('api/:path?', [ClientsController, 'catchAll'])

/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const UsersController = () => import('#controllers/users_controller')
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('users', [UsersController, 'getUser'])
router.post('users', [UsersController, 'signUp'])
router.post('users', [UsersController, 'signOut'])
router.post('users', [UsersController, 'signIn'])

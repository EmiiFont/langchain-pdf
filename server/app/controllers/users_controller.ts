import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async signIn({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)

    response.redirect('/dashboard')
  }

  async signOut({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect('/')
  }

  async signUp({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.create({ email, password })
    await auth.use('web').login(user)
    response.json(user.asDict())
  }

  async getUser({ auth, response }: HttpContext) {
    const user = auth.use('web').user
    response.json(user?.asDict())
  }
}

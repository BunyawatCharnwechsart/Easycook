import { Hono } from 'hono'
import users from './users'
import menu from './menu'
import category from './category'
import { auth } from './auth'

const routes = new Hono()

routes.route('/users', users)
routes.route('/menu', menu)
routes.route('/category', category)
routes.route('/auth', auth)

export default routes
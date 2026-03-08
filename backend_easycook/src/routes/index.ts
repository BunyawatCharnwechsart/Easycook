import { Hono } from 'hono'
import users from './users'
import menu from './menu'
import category from './category'

const routes = new Hono()

routes.route('/users', users)
routes.route('/menu', menu)
routes.route('/category', category)

export default routes
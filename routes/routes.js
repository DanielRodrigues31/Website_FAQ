
import Router from 'koa-router'

import publicRouter from './public.js'
import faqRouter from './faq.js'

const mainRouter = new Router()

const nestedRoutes = [publicRouter, faqRouter]
for (const router of nestedRoutes) {
	mainRouter.use(router.routes())
	mainRouter.use(router.allowedMethods())
}

console.log(mainRouter.stack.map(i => i.path));

export default mainRouter

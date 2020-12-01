
import Router from 'koa-router'

const router = new Router({ prefix: '/faq' })

import Questions from '../modules/questions.js'
const dbName = 'website.db' 

async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/faq')
	await next()
}

router.use(checkAuth)

router.get('/', async ctx => {
  const questions = await new Questions(dbName)
	try {
    const records = await questions.all()
    console.log(records)
    ctx.hbs.records = records
		await ctx.render('faq', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

router.get('/post' , async ctx =>{
  await ctx.render('post', ctx.hbs)
})

router.post('/post', async ctx =>{
  console.log('posting a new question')
  return ctx.redirect('/faq?msg=new question posted')
})

export default router

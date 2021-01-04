
import Router from 'koa-router'
import bodyParser from 'koa-body'

const router = new Router()
router.use(bodyParser({multipart: true}))

import Accounts from '../modules/accounts.js'
import Questions from '../modules/questions.js'
import Keywords from '../modules/keywords.js'
const dbName = 'website.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	const questions = await new Questions(dbName) // stores Questions with the database inputted as a const
	const keywords = await new Keywords(dbName)
	try {
		const records = await questions.all()
		let keys
		await keywords.all().then(k => {
			keys = k.map(e => {
				questions.getNum(e.keyword).then(a => e.occurances = a[0].occurances)
				return e
			})
		})
		//const occurances = await questions.getNum(keys)
		console.log(records)
		//console.log(occurances)
		ctx.hbs.records = records // sets the handlebars to records
		ctx.hbs.keys = keys
		await ctx.render('index', ctx.hbs) // renders index page
	} catch(err) {
		await ctx.render('error', ctx.hbs) // renders error page
	}
})

/**
 * Unique keyword homepage that filters non relevant questions
 *
 * @name keyword page
 * @route {GET} /keyword/:keyword
 */

router.get('/keyword/:keyword', async ctx => {
	const questions = await new Questions(dbName) // stores Questions with the database inputted as a const
	const keywords = await new Keywords(dbName)
	try {
		const records = await questions.getFiltered(ctx.params.keyword)
		console.log(`t:${ records.length}`)
		const keys = await keywords.all()
		ctx.hbs.records = records
		ctx.hbs.keys = keys
		console.log(records)
		console.log('route2')
		console.log(ctx.params)
		console.log(keys)
		await ctx.render('keyword', ctx.hbs) // renders index page
	} catch(err) {
		await ctx.render('error', ctx.hbs) // renders error page
	}
})


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', async ctx => {
	const account = await new Accounts(dbName)
	try {
		// call the functions in the module
		await account.register(ctx.request.body.user, ctx.request.body.pass, ctx.request.body.email)
		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		account.close()
	}
})

/**
 * Renders login page
 *
 * @name login Script
 * @route {get} /login
 */

router.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})

/**
 * posts login page information
 *
 * @name login Script
 * @route {post} /login
 */

router.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		const id = await account.login(body.user, body.pass)
		ctx.session.authorised = true //sets authorisation to true
		ctx.session.user = body.user //stores current userid
		ctx.session.userid = id
		const referrer = body.referrer || '/faq'
		return ctx.redirect(`${referrer}?msg=you are now logged in...`)
	} catch(err) {
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		account.close()
	}
})

/**
 * Renders logout page
 *
 * @name login Script
 * @route {get} /logout
 */

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	delete ctx.session.user
	delete ctx.session.userid
	ctx.redirect('/?msg=you are now logged out')
})


export default router

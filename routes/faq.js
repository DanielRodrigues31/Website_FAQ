
import Router from 'koa-router'

const router = new Router({ prefix: '/faq' })

import Questions from '../modules/questions.js'
import Answers from '../modules/answers.js'
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
	//stores an instance of the classes as variables
	try {
		console.log('testA')
		const records = await questions.all()
		console.log(records)
		ctx.hbs.records = records
		await ctx.render('faq', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

router.get('/post' , async ctx => {
	await ctx.render('post', ctx.hbs)
})

router.post('/post', async ctx => {
	const questions = await new Questions(dbName)
	//stores an instance of the classes as variables
	try {
		ctx.request.body.account = ctx.session.userid
		if(ctx.request.files.photo.name) {
			ctx.request.body.filePath = ctx.request.files.photo.path
			//requests photos path
			ctx.request.body.fileName = ctx.request.files.photo.name
			//requests photos name
			ctx.request.body.fileType = ctx.request.files.photo.type
			//request photos file format
		}
		await questions.post(ctx.request.body)
		return ctx.redirect('/faq?msg=new question posted')
	} catch(err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	} finally{
		questions.close()
	}
})

router.get('/answer/:id' , async ctx => {
	const questions = await new Questions(dbName)
	const answers = await new Answers(dbName)
	//stores an instance of the classes as variables
	try{
		const faqans = await answers.getAns(ctx.params.id)
		ctx.hbs.faqans = faqans
		//creates a reference point in the hbs to the faqans cookie
		ctx.hbs.question = await questions.getByID(ctx.params.id) //adds question ID to handlebar
		ctx.hbs.answer = await answers.getByID(ctx.params.id) //adds answer ID to handlebar
		ctx.session.questionid = await questions.getQuestionID(ctx.params.id) // gets the question id
		ctx.hbs.id = ctx.params.id
		ctx.hbs.display = false
		if (ctx.hbs.question.userid === ctx.session.userid) ctx.hbs.display = true
		await ctx.render('answer', ctx.hbs)
		return ctx.session.questionid
	} catch(err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	}
})

router.post('/answer/:id' , async ctx => {
	// outputs information from the question specific answer handlebar
	const questions = await new Questions(dbName)
	// stores Questions as question, this creates a body for it
	const answers = await new Answers(dbName)
	// stores Answers as answer, this creates a body for it
	try{
		ctx.request.body.account = ctx.session.userid
		// gets all the information from the body.account and sets it to the userid
		ctx.request.body.questionid = ctx.session.questionid
		// gets all the information from the body.questionid and sets it to the questionid
		await answers.postans(ctx.request.body)
		// triggers the postans function in answers with the information from the body
		await questions.answered(ctx.request.body)
		console.log('ctx.request.body : ', ctx.request.body)
		// triggers the answered function in the questions class with the information from the body
		return ctx.redirect('/faq?msg=newanswerposted')
		// displays message when redirected
	} catch(err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	} finally{
		answers.close()
	}
})


router.post('/answer/:id/flag' , async ctx => {
	const questions = await new Questions(dbName)
	// stores Questions as question, this creates a body for it
	const answers = await new Answers(dbName)
	// stores Answers as answer, this creates a body for it
	try{
		console.log(`record: ${ctx.params.id}`)
		ctx.request.body.account = ctx.session.userid
		// gets all the information from the body.account and sets it to the userid
		ctx.request.body.questionid = ctx.session.questionid
		// gets all the information from the body.questionid and sets it to the questionid
		await questions.solved(ctx.request.body)
		// triggers the answered function in the questions class with the information from the body
		console.log('ctx.request.body : ', ctx.request.body)
		//redirects to the /faq page with a message posted notifying the user the question is set to solved
		return ctx.redirect('/faq?msg=questionsolved')
	} catch(err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
		// catches an error then renders error page
	} finally{
		answers.close()
	}
})


export default router

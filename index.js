
import Koa from 'koa'
import serve from 'koa-static'
import views from 'koa-views'
import session from 'koa-session'

import Questions from './modules/questions.js'
import Answers from './modules/answers.js'
import Accounts from './modules/accounts.js'

import router from './routes/routes.js'

const app = new Koa()
app.keys = ['darkSecret']

const defaultPort = 8080
const port = process.env.PORT || defaultPort

async function getHandlebarData(ctx, next) {
	console.log(`${ctx.method} ${ctx.path}`)
	ctx.hbs = {
		authorised: ctx.session.authorised, // sets the cookie of authorised
		user: ctx.session.user, // sets the cookie of the user
		userid: ctx.session.userid, // sets the cookie of the userid
		questionid: ctx.session.questionid, // sets the cookie of the questionid
		host: `https://${ctx.host}`
	}
	for(const key in ctx.query) ctx.hbs[key] = ctx.query[key]
	await next()
}

//Initialise Questions_Data
const dbName = 'website.db'

async function Init(){
  
  const questions = await new Questions(dbName)
  try {
    questions.setQuestion()
  } catch(err) {
    console.log(err)
  }

  const answers = await new Answers(dbName)
  try {
    answers.setAnswer()
  } catch(err) {
    console.log(err)
  }
  
  const accounts = await new Accounts(dbName)
  try {
    accounts.setAccount()
  } catch(err) {
    console.log(err)
  }
}
Init()
app.use(serve('public'))
app.use(session(app))
app.use(views('views', { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

app.use(getHandlebarData)

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(port, async() => console.log(`listening on port ${port}`))

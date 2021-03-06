import test from 'ava'
import Questions from '../modules/questions.js'

test('INSERTING QUESTIONS : insert question into sql', async test => {
	//arrange
	test.plan(1)
	const question = await new Questions()
	//act
	try {
		const InsertQuestion = await question.post({
			account: 1,
			firstname: 'Jonas',
			lastname: 'Djondo',
			title: 'Covid Testing',
			summary: 'Where can we get this done?',
			description: 'Hi im currently wanting to get tested before I go home for christmas,\
                    where do i get this service?',
			status: 'unanswered'})
		//assert
		test.is(InsertQuestion, true, 'Question failed to insert')
	} catch(err) {
		console.log(err)
		test.fail('error thrown')
	} finally {
		question.close()
	}
})

test('Update Answers : updating question information to answered', async test => {
	//arrange
	test.plan(1)
	const question = await new Questions()
	//act
	try {
		await question.post({
			account: 1,
			firstname: 'Jonas',
			lastname: 'Djondo',
			title: 'Covid Testing',
			summary: 'Where can we get this done?',
			description: 'Hi im currently wanting to get tested before I go home for christmas,\
                    where do i get this service?',
			status: 'unanswered'})

		const GetQuestion = await question.answered({
			account: 1,
			questionid: 1
		})
		//assert
		test.is(GetQuestion.status, 'answered' , 'question not updated')
	} catch(err) {
		console.log(err)
		test.fail('error thrown')
	} finally {
		question.close()
	}

})

test('Update Answers : updating question information to solved', async test => {
	//arrange
	test.plan(1)
	const question = await new Questions()
	//act
	try {
		await question.post({
			account: 1,
			firstname: 'Jonas',
			lastname: 'Djondo',
			title: 'Covid Testing',
			summary: 'Where can we get this done?',
			description: 'Hi im currently wanting to get tested before I go home for christmas,\
                    where do i get this service?',
			status: 'unanswered'})

		const GetQuestion = await question.solved({
			account: 1,
			questionid: 1
		})
		//assert
		test.is(GetQuestion.status, 'solved' , 'question not updated')
	} catch(err) {
		console.log(err)
		test.fail('error thrown')
	} finally {
		question.close()
	}

})

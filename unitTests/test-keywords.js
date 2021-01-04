import test from 'ava'
import Keywords from '../modules/keywords.js'
import Answers from '../modules/answers.js'

test.only('INSERTING QUESTIONS : insert keyword into sql', async test => {
	//arrange
	test.plan(1)
	const keyword = await new Keywords()
	const answer = await new Answers()
	// stores instance of function as answer
	//act
	try {
		const InsertKeyword = await keyword.postkeyword({
			id: 1,
			questionid: 1,
			user: 'Yes'}) //inserts test elements examples into sql table
		//assert
		test.is(InsertKeyword, true, 'Keyword failed to insert')
		// function tested, expected result, output message
	} catch(err) {
		console.log(err)
		test.fail('error thrown')
	} finally {
		answer.close()
	}
})

import test from 'ava'
import Answers from '../modules/answers.js'

test('INSERTING QUESTIONS : insert question into sql', async test => {
	//arrange
	test.plan(1)
	const answer = await new Answers() // stores instance of function as answer
	//act
	try {
		const InsertAnswer = await answer.postans({
			id: 1,
			questionid: 1,
			answer: 'Yes'}) //inserts test elements examples into sql table
		//assert
		test.is(InsertAnswer, true, 'Answer failed to insert')
		// function tested, expected result, output message
	} catch(err) {
		console.log(err)
		test.fail('error thrown')
	} finally {
		answer.close()
	}
})

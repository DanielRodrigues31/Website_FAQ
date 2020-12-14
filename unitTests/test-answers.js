import test from 'ava'
import Answers from '../modules/answers.js'

test('INSERTING QUESTIONS : insert question into sql', async test =>{
  //arrange
  test.plan(1)
  const answer = await new Answers();
  //act
  try {
    const InsertAnswer = await answer.postans({
      id: 1,
      questionid: 'Jonas',
      answer: 'Djondo',
      title: 'Covid Testing',
    //assert
    test.is(InsertAnswer, true, 'Question failed to insert')
  } catch(err) {
    console.log(err)
    test.fail('error thrown')
  } finally {
    question.close()
  }  
})
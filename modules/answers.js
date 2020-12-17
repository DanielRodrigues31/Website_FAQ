/** @module Questions */

import sqlite from 'sqlite-async'
import mime from 'mime-types'
import fs from 'fs-extra'

/**
 * Accounts
 * ES6 module that handles registering accounts and logging in.
 */
class Answers {
	/**
   * Create an account object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
    return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS answers\
				(id INTEGER PRIMARY KEY AUTOINCREMENT,\
         questionid INTEGER,\
         answer TEXT,\
         FOREIGN KEY(questionid) REFERENCES questions(id)\
        );'
			await this.db.run(sql)
			return this
		})()
	}
  
  //async all()
    //{
      //const sql = `SELECT answers.answer, questions.* FROM questions WHERE questions.id = answers.id`
      //const answers = await this.db.all(sql)
      
     // return answers
    //}
  
  async getByID(id)
  {
    try 
    {
      const sql = `SELECT users.user, answers.* FROM answers, users WHERE answers.id = users.id AND questionid = ${id};`
      console.log(sql)
      const answer = await this.db.get(sql) //gets sql query
      return answer // all fields within a single record
    } catch(err){
      console.log(err)
      throw err
    }
  }
  
  async getAns(id)
  {
    try 
    {
      const sql = `SELECT answers.answer FROM answers WHERE answers.questionid = ${id};`
      console.log("getAns", sql)
      const answer = await this.db.all(sql) //gets sql query
      console.log("Answer", await this.db.all(sql))
      return answer // all fields within a single record
    } catch(err){
      console.log(err)
      throw err
    }
  }
  
  async postans(data)
  {
    console.log('POSTANS')
    console.log(data)
    try{
      const sql = `INSERT INTO answers(questionid, answer)\
                   Values(${data.questionid}, "${data.answer}")`
      console.log(sql)
      await this.db.run(sql)
      return true
    }
    catch(err)
    {
      console.log(err)
      throw(err)
    }
  }
  
  
  
  async close()
  {
    await this.db.close()
  }
}

export default Answers

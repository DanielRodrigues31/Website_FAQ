/** @module Questions */

import sqlite from 'sqlite-async'
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

	/**
    *Returns all fields within a single record from answers table
    *@function getByID
    *@param {integer} enters id integer number
    *@returns {string} returns row of elements depending on the ID that matches questionid and user.id
  */
	async getByID(id) {
		try {
			const sql = `SELECT users.user, answers.* FROM answers, users\
                   WHERE answers.id = users.id AND questionid = ${id};`
			console.log(sql)
			const answer = await this.db.get(sql) //gets sql query
			return answer // all fields within a single record
		} catch(err) {
			console.log(err)
			throw err
		}
	}

	/**
    *Returns all fields within a single record from answers table
    *@function getAns
    *@param {integer} enters id integer number
    *@returns {datatype} returns row of elements depending on the ID that matches questionid
  */
	async getAns(id) {
		try {
			const sql = `SELECT answers.answer FROM answers WHERE answers.questionid = ${id};`
			console.log('getAns', sql)
			const answer = await this.db.all(sql) //gets sql query from answers with the row relevant to the selected id
			console.log('Answer', await this.db.all(sql))
			return answer // all fields within a single record
		} catch(err) {
			console.log(err)
			throw err
		}
	}

	/**
    *Inserts data.questionid and data.answer into the answers sql table
    *@function postans
    *@param {string} data can be anything from the questionid or the answer, it usually has a context
    *@returns {boolean} returns true if the postans function has run successfully
  */

	async postans(data) {
		console.log('POSTANS')
		console.log(data)
		try{
			const sql = `INSERT INTO answers(questionid, answer)\
                   Values(${data.questionid}, "${data.answer}")`
			//inserts into the sql table of answers the question id and the answer inserted by the handlebars
			console.log(sql) // for test purposes
			await this.db.run(sql) // awaits the sql input before running
			return true
		} catch(err) {
			console.log(err)
			throw err
		}
	}

	/**
    *Reads from the database if the sql table is undefined
    *@function setAnswer()
    *@param {void} describe parameter
    *@returns {boolean} returns true if the function has run successfully
  */

	async setAnswer() {
		const sql = 'SELECT * FROM answers;'
		const AnswerNull = await this.db.get(sql)
		console.log('test1')
		if (AnswerNull === undefined) {
			await fs.readFile('DataBase/Answers_Data.txt', 'utf-8', (err, data) => {
				if (err) throw err
				this.db.run(data)
				return true
			})
		}
	}


	async close() {
		await this.db.close()
	}
}

export default Answers

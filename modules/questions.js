/** @module Questions */

import sqlite from 'sqlite-async'
import mime from 'mime-types'
import fs from 'fs-extra'


/**
 * Accounts
 * ES6 module that handles registering accounts and logging in.
 */
class Questions {
	/**
   * Create an account object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS questions\
				(id INTEGER PRIMARY KEY AUTOINCREMENT,\
         userid INTEGER,\
         photo TEXT,\
         firstname TEXT NOT NULL,\
         lastname TEXT NOT NULL,\
         title TEXT,\
         summary TEXT,\
         description TEXT,\
         status TEXT,\
         FOREIGN KEY(userid) REFERENCES users(id)\
        );'
			await this.db.run(sql)
			return this
		})()
	}

	/**
      *Selects all questions from question sql table
      *@function all
      *@returns {datatype} returns all questions
    */

	async all() {
		const sql = 'SELECT questions.* FROM questions;'
		const questions = await this.db.all(sql)
		for(const index in questions) {
			if(questions[index].photo === null) questions[index].photo = 'placeholder.jpg'
		}
		return questions
	}

	/**
    *Returns all fields within a single record from answers table
    *@function getByID
    *@param {integer} enters id integer number
    *@returns {string} returns row of elements depending on the ID that matches questionid
  */

	async getByID(id) {
		try {
			const sql = `SELECT questions.* FROM questions WHERE questions.id = ${id};`
			// gets all elements from questions where the ID is equal to the inputted id
			console.log(sql)
			const question = await this.db.get(sql) //gets sql query
			return question // all fields within a single record
		} catch(err) {
			console.log(err)
			throw err
		}
	}

	/**
    *Returns all fields within a single record from answers table
    *@function getQuestionID
    *@param {integer} enters id integer number
    *@returns {string} returns row of elements depending on the ID that matches questionid and user.id
  */

	async getQuestionID(id) {
		try {
			const sql = `SELECT users.user, questions.* FROM questions, users\ 
                   WHERE questions.userid = users.id AND questions.id = ${id};`
			// gets all elements from questions and users where the ID is equal to the inputted id
			console.log(sql)
			const question = await this.db.get(sql) //gets sql query
			return question.id // all fields within a single record
		} catch(err) {
			console.log(err)
			throw err
		}
	}

	async getFiltered(keyword) {
		try {
			const sql = `SELECT questions.* FROM questions\
                   WHERE questions.description LIKE '%'|| ${`'${keyword}'`} || '%'`

			// gets all elements from questions and users where the ID is equal to the inputted id
			console.log(sql)
			const question = await this.db.all(sql) //gets sql query
			return question // all fields within a single record
		} catch(err) {
			console.log(err)
			throw err
		}
	}

	async getNum(keyword) {
		try {
			const sql = `SELECT COUNT (questions.id) AS occurances FROM questions\
                   WHERE questions.description LIKE '%'|| ${`'${keyword}'`} || '%'`

			// gets all elements from questions and users where the ID is equal to the inputted id
			console.log(sql)
			const question = await this.db.all(sql) //gets sql query
			return question // all fields within a single record
		} catch(err) {
			console.log(err)
			throw err
		}
	}

	/**
    * Updates status to answered depending on if the status is unanswered and the row id matches the questionid
    *@function answered
    *@param {integer} data can be anything from the questionid or the answer, it usually has a context
    *@returns {string} returns row of elements depending on the ID that matches questionid
  */

	async answered(data) {
		try {
			const sql = `UPDATE questions SET status = "answered"\
                   WHERE status = "unanswered" AND id = "${data.questionid}"`
			//updates the status to answer where the column in status is equal to unanswered and the question id matches
			console.log(sql)
			await this.db.run(sql)
			const sql2 = `SELECT questions.* FROM questions WHERE id = "${data.questionid}"`
			// gets all elements from questions where the ID is equal to the inputted questionid
			console.log(sql2)
			const resultsql2 = await this.db.get(sql2) // for unit testing purposes
			return resultsql2

		} catch(err) {
			console.log(err)
			throw err
		}
	}

	/**
    * Updates status to solved depending on where the row id matches the questionid
    *@function solved
    *@param {integer} data can be anything from the questionid or the answer, it usually has a context
    *@returns {string} returns row of elements depending on the ID that matches questionid
  */

	async solved(data) {
		try {
			const sql = `UPDATE questions SET status = "solved" WHERE id = "${data.questionid}"`
			//updates questions table, gets the questionid, matches it and sets status column to solved
			console.log(sql)
			await this.db.run(sql)
			const sql2 = `SELECT questions.* FROM questions WHERE id = "${data.questionid}"`
			// gets all elements from questions where the ID is equal to the inputted questionid
			console.log(sql2)
			const resultsql2 = await this.db.get(sql2) // for unit testing purposes
			return resultsql2

		} catch(err) {
			console.log(err)
			throw err
		}
	}

	/**
    *Inserts the stated data sets into the sql table, filename is the photo and by default status is set to unanswered
    *@function post
    *@param {string} data can be anything from the questionid or the answer, it usually has a context
    *@returns {boolean} returns true if the postans function has run successfully
  */

	async post(data) {
		console.log('POST')
		console.log(data)
		let filename
		try{
			if(data.fileName) {
				filename = `${Date.now()}.${mime.extension(data.fileType)}` //current time
				console.log(filename)
				await fs.copy(data.filePath, `public/avatars/${filename}`)
			}
			const sql = `INSERT INTO questions(userid, photo, firstname, lastname, title, summary, description, status)\
                    Values(${data.account}, "${filename}", "${data.firstname}", "${data.lastname}",\
                            "${data.title}", "${data.summary}", "${data.description}", "unanswered")`
			// inserts into questions table the following elements ->
			// with the data from the handlebars body, unanswered is added by default
			await this.db.run(sql)
			return true
		} catch(err) {
			console.log(err)
			throw err
		}

	}

	/**
    *Reads from the database if the sql table is undefined
    *@function setQuestion()
    *@returns {boolean} returns true if the function has run successfully
  */

	async setQuestion() {
		const sql = 'SELECT * FROM questions;'
		const QuestionNull = await this.db.get(sql)
		console.log('test1')
		if (QuestionNull === undefined) {
			await fs.readFile('DataBase/Questions_Data.txt', 'utf-8', (err, data) => {
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

export default Questions

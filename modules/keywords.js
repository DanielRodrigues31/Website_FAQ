
import sqlite from 'sqlite-async'
import fs from 'fs-extra'

class Keywords {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS keywords\
				(id INTEGER PRIMARY KEY AUTOINCREMENT,\
         questionid INTEGER,\
         keyword TEXT,\
         FOREIGN KEY(questionid) REFERENCES questions(id)\
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
		console.log('all')
		try{
			const sql = 'SELECT keywords.* FROM keywords;'
			const keywords = await this.db.all(sql)
			console.log(keywords)
			return keywords
		} catch(err) {
			console.log(err)
			throw err
		}
	}

	/**
    *Inserts data.questionid and data.keyword into the answers sql table
    *@function postkeyword
    *@param {string} data can be anything from the questionid or the answer, it usually has a context
    *@returns {boolean} returns true if the postkeyword function has run successfully
  */

	async postkeyword(data) {
		console.log('POSTKEYWORD')
		console.log(data)
		try{
			const sql = `INSERT INTO keywords(questionid, keyword)\
                   Values(${data.questionid}, "${data.user}")`
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
    *generates 5 words depending on the data.description and will insert into keywords sql table
    *@function generate
    *@param {string} data can be anything from the questionid or the answer, it usually has a context
    *@returns {string} update is an array full of strings
  */

	async generate(data, questionid) {
		try{
			const input = data.description.split(' ')
			const list = []
			let x = 0
			const condition = 5
			for (let i=0; i < input.length; i++) {
				if (x < condition) {
					list.push(input[i])
					x++
				}
			}
			for (const x in list) {
				const sql = `INSERT INTO keywords(questionid, keyword) Values(${questionid}, "${list[x]}")`
				await this.db.run(sql)
			}
			return list
		} catch(err) {
			//throw err
		}
	}

	/**
    *Returns all fields within a single record from keywords table
    *@function getKeyword
    *@param {integer} enters id integer number
    *@returns {datatype} returns row of elements depending on the ID that matches questionid
  */

	async getKeyword(id) {
		try {
			const sql = `SELECT keywords.* FROM keywords WHERE keywords.questionid = ${id};`
			console.log('getkeyword', sql)
			const keyword = await this.db.all(sql) //gets sql query from answers with the row relevant to the selectedid
			console.log('Keyword', await this.db.all(sql))
			return keyword // all fields within a single record
		} catch(err) {
			console.log(err)
			throw err
		}
	}

	/**
    *Reads from the database if the sql table is undefined
    *@function setKeywords()
    *@returns {boolean} returns true if the function has run successfully
  */

	async setKeywords() {
		const sql = 'SELECT * FROM keywords;'
		const KeywordNull = await this.db.get(sql)
		console.log('test1')
		if (KeywordNull === undefined) {
			await fs.readFile('DataBase/Keywords_Data.txt', 'utf-8', (err, data) => {
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

export default Keywords

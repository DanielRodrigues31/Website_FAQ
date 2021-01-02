
import sqlite from 'sqlite-async'
import fs from 'fs-extra'

function rndgenerate(list) {
	const update = []
	const num = 5
	for (const i=0; i < num; i++) {
		update.push(list[Math.floor( Math.random() * list.length)])
	}
	return update
}

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

	async postkeyword(data) {
		console.log('POSTKEYWORD')
		console.log(data)
		try{
			const sql = `INSERT INTO keywords(questionid, keyword)\
                   Values(${data.questionid}, "${data.keyword}")`
			//inserts into the sql table of answers the question id and the answer inserted by the handlebars
			console.log(sql) // for test purposes
			await this.db.run(sql) // awaits the sql input before running
			return true
		} catch(err) {
			console.log(err)
			throw err
		}
	}

	async generate(data) {
		try{
			const input = data.description.split()
			const exception = ['.',',',':',';','?','!','(',')','[',']','\'','-','*','/','@','{','}']
			const list = []
			for(const x in input) {
				if (exception.include(x) === false) {
					list.push(x)
				}
			}
			const update = rndgenerate(list)

			for (const x in update) {
				const sql = `INSERT INTO keywords(questionid, keyword) Values(${data.questionid}, "${x}")`
				await this.db.run(sql)
			}
			return update
		} catch(err) {
			throw err
		}
	}

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

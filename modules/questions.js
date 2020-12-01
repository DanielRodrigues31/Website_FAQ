 /** @module Questions */

import sqlite from 'sqlite-async'


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
         firstname TEXT NOT NULL,\
         lastname TEXT NOT NULL,\
         title TEXT,\
         summary TEXT,\
         status TEXT,\
         FOREIGN KEY(userid) REFERENCES users(id)\
        );'
			await this.db.run(sql)
			return this
		})()
	}


  async all()
    {
      const sql = 'SELECT users.user, questions.*FROM questions, users\
                     WHERE questions.userid = users.id;'
      const questions = await this.db.all(sql)
      for(const index in questions)
      {
        if(questions[index].photo === null) questions[index].photo = 'placeholder.jpg'
      }
      return questions
    }
}

export default Questions

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
  
  async getByID(id)
  {
    try 
    {
      const sql = `SELECT users.user, questions.* FROM questions, users\ 
                   WHERE questions.userid = users.id AND questions.id = ${id};`
      
      console.log(sql)
      const question = await this.db.get(sql) //gets sql query
      if(question.photo === null) question.photo = 'placeholder.jpeg' // if no picture default to this
      const dateTime = new Date(question.lastcontact * 1000) //converts to from milliseconds
      const date = `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`
      question.lastcontact = date // stores as date
      return question // all fields within a single record
    } catch(err){
      console.log(err)
      throw err
    }
  }
  
  async post(data)
  {
    console.log('POST')
    console.log(data)
    let filename
    try{
      if(data.fileName)
      {
        filename = `${Date.now()}.${mime.extension(data.fileType)}` //current time 
        console.log(filename)
        await fs.copy(data.filePath, `public/avatars/${filename}`)
      }
      const sql = `INSERT INTO questions(userid, photo, firstname, lastname, title, summary, description)\
                    Values(${data.account}, "${filename}", "${data.firstname}", "${data.lastname}",\
                            "${data.title}", "${data.summary}", "${data.description}")`
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

export default Questions

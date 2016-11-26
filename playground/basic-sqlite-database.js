'use strict'
const Sequelize = require('sequelize');
const sequelize = new Sequelize(undefined,undefined, undefined,{
  'dialect': 'sqlite',
  'storage': __dirname+ '/basic-sqlite-database.sqlite'
})

let Todo = sequelize.define('todo',{
  description:{
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [2,300]
    }
  },
  completed:{
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
})

sequelize.sync().then(function(){
  console.log('Everything is synced.');

  Todo.create({
    description: 'Fish Friend'
  }).then(todo=>{
    console.log('Finished!');
    return Todo.create({
      description: 'Clean office',
      completed: true
    })
  })
  .then().catch(e =>{
    console.error(e);
  })
})

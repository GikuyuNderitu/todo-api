"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
const db = require('./db.js');


const app = express();
const port = process.env.PORT || 3000
let todoNextId = 1;
let todos = [

]

//FUNCTIONS
app.use(bodyParser.json())


app.get('/', (req, res)=>{
  res.send('Todo API Root')
})

//GET /todos
app.get('/todos', (req, res)=>{
  let query = req.query
  let where = {}

  if(query.hasOwnProperty('completed')) {
    if(query.completed === 'true') where.completed = true
    else if (query.completed === 'false') where.completed = false
  }
  if(query.hasOwnProperty('q')){
    where.description = {}
    where.description.$like = '%'+query.q+'%'
  }

  console.log('Where object is: ',where);

  db.todo.findAll({where})
  .then( todos =>{
    if(!!todos) res.json(todos)
    else res.status(404).send('<h1>The Requested To Do Does Not Exist</h1>')
  })
  .catch(e =>{
    res.status(500).send('<h1>Unnexpected Error Occurred</h1>')
  })
})

//GET /todos/:id
app.get('/todos/:id', (req,res)=>{

  db.todo.findById(req.params.id)
  .then(todo=>{
    if(!!todo) res.json(todo)
    else res.status(404).send('<h1>Data Requested does not exist</h1>')
  })
  .catch(e=>{
    res.status(500).send()
  })
  // let todo = todos.find(val =>{return val.id === parseInt(req.params.id, 10)})
  //
  // if(typeof todo == 'undefined'){
  //   res.status(404).send()
  // }else{
  //   res.json(todo)
  //}
})


//DELETE /todos/:id
app.delete('/todos/:id',(req, res)=>{
  let reqId = parseInt(req.params.id, 10)
  let todo = todos.find(val =>{return val.id === reqId})

  if(typeof todo == 'undefined'){
    console.log('Invalid id request');
    res.status(404).send('Request with id '+reqId+' requested not found')
  }else{
    todos = _.reject(todos, val =>{return val === todo})

    console.log('Deleted: ', todo);
    res.status(200).send('Request with id '+reqId+' successfully deleted.')
  }
})


// POST /todos
app.post('/todos',(req, res)=>{
  let body = _.pick(req.body, 'description', 'completed')

  db.todo.create(body)
  .then(todo =>{
    console.log(todo);
    res.json(todo)
  })
  .catch( e =>{
    console.error(e);
    res.status(400).json(e)
  })
})


//PUT(update) /todos/:id
app.put('/todos/:id',(req, res)=>{
  let body = _.pick(req.body, 'description', 'completed')

  let validAttributes = {};

  if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0 ) validAttributes.description = body.description
  else if(body.hasOwnProperty('description')){
    console.log('Malformed description');
    return res.status(400).send('Malformed description')
  }
  if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) validAttributes.completed = body.completed
  else if (body.hasOwnProperty('completed')) {
    console.log('Malformed completion status');
    return res.status(400).send('Malformed description')
  }

  let reqId = parseInt(req.params.id, 10)
  let todo = todos.find(val =>{return val.id === reqId})

  if(typeof todo == 'undefined'){
    console.log('Invalid id request');
    res.status(404).send('Request with id '+reqId+' requested not found')
  }else{
    let previous = _.clone(todo)
    todo.description = validAttributes.description
    todo.completed = validAttributes.completed
    console.log('Todo with id '+reqId+' was updated.\nWas: ', previous,'\n Now: ',todo);
    res.status(200).json(todo)
  }
})

db.sequelize.sync()
.then(
  app.listen(port, ()=>{
    console.log('Express lisening on port '+port +'.');
  })
)

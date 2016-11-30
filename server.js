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
  let queryParams = req.query
  let resToDos = _.clone(todos)
  if(queryParams.hasOwnProperty('completed')){
    if(queryParams.completed === 'true'){
      resToDos = _.where(resToDos,{completed: true})
    }else if(queryParams.completed === 'false'){
      resToDos = _.where(resToDos,{completed: false})
    }else{
      return res.status(400).send('Improper query. Use true or false')
    }
  }

  if(queryParams.hasOwnProperty('q')){
    if(queryParams.q.length>0){
      resToDos = resToDos.filter(val =>{return val.description.indexOf(queryParams.q) >= 0})
      console.log(resToDos);
    }
    else{
      console.log('Malformed search for description');
      return res.status(400).send('Improper description search query. Use 1 or more characters')
    }
  }

  // resToDos = _.where(todos,queryParams )

  console.log(queryParams,resToDos);

  res.json(resToDos)
})

//GET /todos/:id
app.get('/todos/:id', (req,res)=>{
  let todo = todos.find(val =>{return val.id === parseInt(req.params.id, 10)})

  if(typeof todo == 'undefined'){
    res.status(404).send()
  }else{
    res.json(todo)
  }
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



  if(typeof body.description === 'string' && body.description.trim().length > 0 && typeof body.completed === 'boolean'){
    body.description = body.description.trim()
    console.log('Description: '+ body.description);
    console.log('Status: '+body.completed);

    body.id = todoNextId
    todoNextId += 1
    todos.push(body)

    res.json(body)
  }else{

    console.log('Not a valid request')
    res.send("Invalid input")
  }
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

db.sequelize().sync()
.then(
  app.listen(port, ()=>{
    console.log('Express lisening on port '+port +'.');
  })
)

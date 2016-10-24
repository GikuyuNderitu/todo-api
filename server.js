"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');


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
  res.json(todos)
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

app.listen(port, ()=>{
  console.log('Express lisening on port '+port +'.');
})

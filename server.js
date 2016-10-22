"use strict";
const express = require('express');
const app = express();
const port = process.env.PORT || 3000
let todoNextId = 1;
let todos = [

]

app.get('/', (req, res)=>{
  res.send('Todo API Root')
})

//GET /todos
app.get('/todos', (req, res)=>{
  res.json(todos)
})

//GET /todos/:id
app.get('/todos/:id', (req,res)=>{
  let todo = todos.find(val =>{
    return val.id === parseInt(req.params.id, 10)
  })

  if(typeof todo == 'undefined')
    res.status(404).send()
  else
    res.json(todo)
})

// POST /todos
app.post('/todos',(req, res)=>{

})

app.listen(port, ()=>{
  console.log('Express lisening on port '+port +'.');
})

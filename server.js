"use strict";
const express = require('express');
const app = express();
const port = process.env.PORT || 3000
let todos = [
  {
    id: 1,
    description: 'Meet mom for lunch',
    completed: false
  },
  {
    id: 2,
    description: 'Make wife "happy"',
    completed: false
  },
  {
    id: 3,
    description: 'Find out how to make camera work from vlc player',
    completed: true
  }
]

app.get('/', (req, res)=>{
  res.send('Todo API Root')
})

app.get('/todos', (req, res)=>{
  res.json(todos)
})

app.get('/todos/:id', (req,res)=>{
  let todo = todos.find(val =>{
    return val.id === parseInt(req.params.id, 10)
  })

  if(typeof todo == 'undefined')
    res.status(404).send()
  else
    res.json(todo)
})

app.listen(port, ()=>{
  console.log('Express lisening on port '+port +'.');
})

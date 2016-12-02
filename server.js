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
  db.todo.findById(req.params.id)
  .then(todo =>{
    if(!!todo){
      db.todo.destroy({
        where:{
          id: req.params.id
        }
      })
      .then( row => {
        res.send('You deleted '+row+' with the following content:\n'+JSON.stringify(todo))
      })
    }else res.status(404).send('<h1>The Id of the Record You Requested to Delete Does Not Exist.</h1>')
  })
  .catch(e => {
    res.status(500).send('<h1>Something Funky Happened!</h1>')
  })


  // let todo = todos.find(val =>{return val.id === reqId})
  //
  // if(typeof todo == 'undefined'){
  //   console.log('Invalid id request');
  //   res.status(404).send('Request with id '+reqId+' requested not found')
  // }else{
  //   todos = _.reject(todos, val =>{return val === todo})
  //
  //   console.log('Deleted: ', todo);
  //   res.status(200).send('Request with id '+reqId+' successfully deleted.')
  // }
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
  let reqId = parseInt(req.params.id, 10)
  let body = _.pick(req.body, 'description', 'completed')
  let attributes = {};

  if(body.hasOwnProperty('description'))
    attributes.description = body.description
  if(body.hasOwnProperty('completed'))
    attributes.completed = body.completed

  db.todo.findById(reqId)
  .then(todo =>{
    if(!!todo)
      return todo.update(attributes)
    else
      res.status(404).send('<h1>Record with id '+reqID+' could not be found. Update cancelled.</h1>')
  })
  .then(todo =>{
    res.json(todo)
  }, e=>{
    res.status(400).json('<h1>Your request included invalid syntax.</h1>',e.toJSON())
  })
  .catch(e =>{
    res.status(500).send('<h1>Something Funky Happned!</h1>')
  })
})

// POST /users
app.post('/users', (req, res) =>{
  let body = _.pick(req.body, 'email', 'password')

  db.user.create(body)
  .then(user =>{
    res.status(200).send("<div><h1>CONGRATULATIONS</h1></div><div><h3>You've created the user "+body.email+"! </h3></div>")
  })
  .catch(e =>{
    res.status(400).send("<h1>FIX YO USER REQUEST MAN</h1>\n"+JSON.stringify(e))
  })
})


db.sequelize.sync({force: true})
.then(
  app.listen(port, ()=>{
    console.log('Express lisening on port '+port +'.');
  })
)

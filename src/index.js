const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const users = {}; // O(1)

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users[username];

  if(user) {
    return next();
  }
  else {
    return response.status(400).json({ error: "Usuário inválido (￢_￢)" });
  }
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const uuid = uuidv4();

  users[username] = { 
    name, 
    username, 
    todos: [], 
    id: uuidv4() 
  };

  response.status(201).json({ uuid, username, message: "Usuário criado °˖✧◝(⁰▿⁰)◜✧˖°"});
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  return response.status(200).json({ todos: users[username].todos });
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body;

  const uuid = uuidv4();

  users[username].todos.push({ 
    id: uuid,
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  })

  response.status(201).json({ uuid, message: "To-Do criado (*￣▽￣)b"});
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todoIndex = users[username].todos.findIndex((todo) => todo.id === id);

  users[username].todos[todoIndex].deadline = new Date(deadline);
  users[username].todos[todoIndex].title = title;

  response.sendStatus(204);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const todoIndex = users[username].todos.findIndex((todo) => todo.id === id);
  users[username].todos[todoIndex].done = true;

  response.sendStatus(204);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const todoIndex = users[username].todos.findIndex((todo) => todo.id === id);
  users[username].todos.splice(todoIndex, 1);

  response.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port} <(￣︶￣)>`)
})

module.exports = app;
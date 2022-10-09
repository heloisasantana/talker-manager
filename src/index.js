const express = require('express');
const bodyParser = require('body-parser');
const { 
  readTalkerDataBase,
  readTalkerFromID, 
  writeNewTalker,
  updateTalkerFromID, 
  deleteTalkerFromID,
} = require('./utils/fsUtils');
const { 
  validateEmail,
  validatePassword,
  validateToken,
  validateName,
  validateAge, 
  validateTalk,
  validateWatchedAt,
  validateRate,
} = require('./utils/middlewares');
const generateToken = require('./utils/generateToken');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_CREATE_201 = 201;
const HTTP_DELETE_204 = 204;
const HTTP_ERROR_404 = 404;
const PORT = '3000';

app.get('/talker', async (request, response) => {
  const talkers = await readTalkerDataBase();
  return response.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/:id', async (request, response) => {
  const { id } = request.params;
  const talkerFromID = await readTalkerFromID(Number(id));
  if (talkerFromID) { return response.status(HTTP_OK_STATUS).json(talkerFromID); } 
  return response.status(HTTP_ERROR_404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', validateEmail, validatePassword, (_request, response) => {
  const token = generateToken();
  return response.status(HTTP_OK_STATUS).json({ token }); 
});

app.post('/talker', validateToken, validateName, validateAge, validateTalk, validateWatchedAt,
validateRate, async (request, response) => {
  const newTalker = request.body;
  const newTalkerWithId = await writeNewTalker(newTalker);
  return response.status(HTTP_CREATE_201).json(newTalkerWithId); 
});

app.put('/talker/:id', validateToken, validateName, validateAge, validateTalk, validateWatchedAt,
validateRate, async (request, response) => {
  const { id } = request.params;
  const updatedTalkerData = request.body;
  const updatedTalker = await updateTalkerFromID(Number(id), updatedTalkerData);
  return response.status(HTTP_OK_STATUS).json(updatedTalker); 
});

app.delete('/talker/:id', validateToken, async (request, response) => {
  const { id } = request.params;
  await deleteTalkerFromID(Number(id));
  return response.status(HTTP_DELETE_204).end(); 
});

app.listen(PORT, () => {
  console.log('Online');
});

module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');
const { readTalkerDataBase, readTalkerFromID } = require('./utils/fsUtils.js');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_ERROR_400 = 400;
const HTTP_ERROR_404 = 404;
const PORT = '3000';

const generateToken = () => {
  // Referência para construir a função: https://acervolima.com/como-gerar-uma-senha-aleatoria-usando-javascript/;
  let token = '';
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let index = 0; index < 16; index += 1) {
    const char = Math.floor(Math.random() * chars.length);
    token += chars.charAt(char);
  }
  return token;
};

const validateEmail = (request, response, next) => {
  const { email } = request.body;
  const FORMAT_EMAIL = /\S+@\S+\.\S+/;
  const validEmail = FORMAT_EMAIL.test(email);
  if (!email) { 
    return response.status(HTTP_ERROR_400).json({ message: 'O campo "email" é obrigatório' });
  } 
  if (!validEmail) {
    return response.status(HTTP_ERROR_400)
    .json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};

const validatePassword = (request, response, next) => {
  const { password } = request.body;
  if (!password) {
    return response.status(HTTP_ERROR_400).json({ message: 'O campo "password" é obrigatório' });
  } 
  if (password.length < 6) {
    return response.status(HTTP_ERROR_400)
    .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

// não remova esse endpoint, e para o avaliador funcionar
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

app.post('/login', validateEmail, validatePassword, (request, response) => {
  const token = generateToken();
  return response.status(HTTP_OK_STATUS).json({ token }); 
});

app.listen(PORT, () => {
  console.log('Online');
});

module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');
const { readTalkerDataBase, readTalkerFromID, writeNewTalker } = require('./utils/fsUtils.js');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_CREATE_201 = 201;
const HTTP_ERROR_400 = 400;
const HTTP_ERROR_401 = 401;
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

const validateToken = (request, response, next) => {
  const { authorization } = request.headers;
  if (!authorization) {
    return response.status(HTTP_ERROR_401).json({ message: 'Token não encontrado' });
  } 
  if (authorization.length !== 16) {
    return response.status(HTTP_ERROR_401).json({ message: 'Token inválido' });
  }
  next();
};

const validateName = (request, response, next) => {
  const { name } = request.body;
  if (!name) {
    return response.status(HTTP_ERROR_400).json({ message: 'O campo "name" é obrigatório' });
  } 
  if (name.length < 3) {
    return response.status(HTTP_ERROR_400)
    .json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const validateAge = (request, response, next) => {
  const { age } = request.body;
  if (!age) {
    return response.status(HTTP_ERROR_400).json({ message: 'O campo "age" é obrigatório' });
  } 
  if (Number(age) < 18) {
    return response.status(HTTP_ERROR_400)
    .json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const validateTalk = (request, response, next) => {
  const { talk } = request.body;
  if (!talk) {
    return response.status(HTTP_ERROR_400).json({ message: 'O campo "talk" é obrigatório' });
  } 
  next();
};

const validateWatchedAt = (request, response, next) => {
  const { talk: { watchedAt } } = request.body;
  const FORMAT_DATE = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const validDate = FORMAT_DATE.test(watchedAt);
  if (!watchedAt) {
    return response.status(HTTP_ERROR_400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!validDate) {
    return response.status(HTTP_ERROR_400)
    .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const validateRate = (request, response, next) => {
  const { talk: { rate } } = request.body;
  if (!rate) {
    return response.status(HTTP_ERROR_400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (Number(rate) < 1 || Number(rate) > 5) {
    return response.status(HTTP_ERROR_400)
    .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
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

app.listen(PORT, () => {
  console.log('Online');
});

module.exports = app;
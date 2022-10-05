const express = require('express');
const bodyParser = require('body-parser');
const { readTalkerDataBase, readTalkerFromID } = require('./utils/fsUtils.js');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_ERROR_STATUS = 404;
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

// não remova esse endpoint, e para o avaliador funcionar
app.get('/talker', async (request, response) => {
  const talkers = await readTalkerDataBase();
  return response.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/:id', async (request, response) => {
  const { id } = request.params;
  const talkerFromID = await readTalkerFromID(Number(id));
  if (talkerFromID) { return response.status(HTTP_OK_STATUS).json(talkerFromID); } 
  return response.status(HTTP_ERROR_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', (request, response) => {
  const { email, password } = request.body;
  const token = generateToken();
  if (email && password) { return response.status(HTTP_OK_STATUS).json({ token }); }
});

app.listen(PORT, () => {
  console.log('Online');
});

module.exports = app;
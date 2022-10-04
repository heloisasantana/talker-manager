const express = require('express');
const bodyParser = require('body-parser');
const readTalkerDataBase = require('./utils/fsUtils.js');
 
const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/talker', async (request, response) => {
  const talkers = await readTalkerDataBase();
  response.status(HTTP_OK_STATUS).json(talkers);
});

app.listen(PORT, () => {
  console.log('Online');
});

module.exports = app;
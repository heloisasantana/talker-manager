const fs = require('fs').promises;
const path = require('path');

const TALKER_PATH = '../talker.json';

async function readTalkerDataBase() {
  try {
  const dataBase = await fs.readFile(path.resolve(__dirname, TALKER_PATH));
  const talkers = JSON.parse(dataBase);
  return talkers;
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
  }
}

async function readTalkerFromID(id) {
  const talkers = await readTalkerDataBase();
  const talkerFromID = talkers.find((talker) => talker.id === id);
  return talkerFromID;
}

module.exports = {
  readTalkerDataBase,
  readTalkerFromID,
};

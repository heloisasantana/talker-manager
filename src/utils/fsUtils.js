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

async function writeNewTalker(newTalker) {
  try {
    const oldTalkers = await readTalkerDataBase();
    const newTalkerWithId = { id: oldTalkers.length + 1, ...newTalker };
    const allTakers = JSON.stringify([...oldTalkers, newTalkerWithId]);
    await fs.writeFile(path.resolve(__dirname, TALKER_PATH), allTakers);
    return newTalkerWithId;
  } catch (error) {
    console.error(`Erro na escrita dos dados: ${error}`);
  }
}

module.exports = {
  readTalkerDataBase,
  readTalkerFromID,
  writeNewTalker,
};

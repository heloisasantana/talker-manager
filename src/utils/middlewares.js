const HTTP_ERROR_400 = 400;
const HTTP_ERROR_401 = 401;

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
    if (rate === undefined) {
      return response.status(HTTP_ERROR_400).json({ message: 'O campo "rate" é obrigatório' });
    }
    if (Number(rate) < 1 || Number(rate) > 5) {
      return response.status(HTTP_ERROR_400)
      .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
    }
    next();
  };

  module.exports = {
    validateEmail,
    validatePassword,
    validateToken, 
    validateName, 
    validateAge, 
    validateTalk, 
    validateWatchedAt,
    validateRate,
  };

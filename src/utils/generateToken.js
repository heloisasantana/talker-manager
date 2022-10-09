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

  module.exports = generateToken;
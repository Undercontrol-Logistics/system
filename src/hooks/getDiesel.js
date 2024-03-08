// Importando o módulo 'axios' para fazer requisições HTTP
const axios = require("axios");

async function getDiesel(userId) {
  try {
    const url = "http://diesel.api.undercontrol.tech/diesel";
    const body = { userId };

    // Configurando os headers da requisição
    const headers = {
      "Content-Type": "application/json",
    };

    // Fazendo a requisição GET com os headers configurados
    const response = await axios.get(url, body, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Ocorreu um erro:", error);
    return null;
  }
}

module.exports = getDiesel;

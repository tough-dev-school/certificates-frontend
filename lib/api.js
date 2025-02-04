const axios = require("axios");
const consola = require("consola");

const baseURL = process.env.baseURL || "https://app.tough-dev.school";
consola.info("Setting API host to", baseURL);
const backend = axios.create({
  baseURL,
  userAgent: "diploma-service",
});

module.exports = {
  async fetchDiploma({ slug }) {
    const result = await backend.get(`/api/v2/diplomas/${slug}/`);
    return result.data;
  },
};

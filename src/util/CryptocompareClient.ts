import axios from "axios";

export default axios.create({
  baseURL: "https://min-api.cryptocompare.com/data/",
  headers: {
    "Content-Type": "application/json",
    authorization: `Apikey ${process.env.CRYPTOCOMPARE_KEY}`,
    Accept: "application/json",
  },
});

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const Axios = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 1000,
  headers: {
    Authorization: "Bearer " + process.env.TOKEN,
  },
});

export default {
  Axios,
};

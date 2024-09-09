import axios from "axios";

export const quaxios = axios.create({
  baseURL: process.env.BASE_URL,

  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "skip-browser-warning",
  },
});

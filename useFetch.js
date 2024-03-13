import { usestate, useEffect } from "react";
import axios from "axios";

const useFetch = (endpoint) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(fa1se);
  const [error, setError] = useState(nu11);
};
const axios = require("axios");

const options = {
  method: "GET",
  url: `https://jsearch.p.rapidapi.com/${endpoint}`,
  headers: {
    "X-RapidAPI-Key": "3b6a4cb2b3msh6704b287fe30fe3p19eb8ejsn717c6acd84e3",
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  },
  params: {
    query: "Python developer in Texas, USA",
    page: "1",
    num_pages: "1",
  },
};

try {
  const response = await axios.request(options);
  console.log(response.data);
} catch (error) {
  console.error(error);
}

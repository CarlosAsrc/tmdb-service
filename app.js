require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const rateLimit = require("express-rate-limit");
var cors = require("cors");
const app = express();
const port = 3000;

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1, // limit each IP to 1 requests per windowMs
});

app.use(limiter);
app.use(cors());



const API_KEY = process.env.TMDB_API_KEY
const API_BASE = 'https://api.themoviedb.org/3'


const basicFetch = async (endpoint) => {
  const req = await fetch(`${API_BASE}${endpoint}`)
  const json = await req.json()
  return json
}

const getHomeList = async () => {
  return [
    {
      slug: 'originals',
      title: 'Originais da Netflix',
      items: await basicFetch(`/discover/tv?with_network=213&language=pt-BR&api_key=${API_KEY}`)
    },
    {
      slug: 'trending',
      title: 'Recomendados para você',
      items: await basicFetch(`/trending/all/week?language=pt-BR&api_key=${API_KEY}`)
    },
    {
      slug: 'toprated',
      title: 'Em Alta',
      items: await basicFetch(`/movie/top_rated?language=pt-BR&api_key=${API_KEY}`)
    },
    {
      slug: 'action',
      title: 'Ação',
      items: await basicFetch(`/discover/movie?with_genres=28&language=pt-BR&api_key=${API_KEY}`)
    },
    {
      slug: 'comedy',
      title: 'Comédia',
      items: await basicFetch(`/discover/movie?with_genres=35&language=pt-BR&api_key=${API_KEY}`)
    },
    {
      slug: 'horror',
      title: 'Terror',
      items: await basicFetch(`/discover/movie?with_genres=27&language=pt-BR&api_key=${API_KEY}`)
    },
    {
      slug: 'romance',
      title: 'Romance',
      items: await basicFetch(`/discover/movie?with_genres=10749&language=pt-BR&api_key=${API_KEY}`)
    },
    {
      slug: 'documentary',
      title: 'Documentários',
      items: await basicFetch(`/discover/movie?with_genres=99&language=pt-BR&api_key=${API_KEY}`)
    },
    {
      slug: 'sci-fi',
      title: 'Ficção Científica',
      items: await basicFetch(`/discover/movie?with_genres=878&language=pt-BR&api_key=${API_KEY}`)
    }
  ]
}


const getMovieInfo = async (movieId, type) => {
  let info = {}

  if (movieId) {
    switch (type) {
      case 'movie':
        info = await basicFetch(`/movie/${movieId}?language=pt-BR&api_key=${API_KEY}`)
        break
      case 'tv':
        info = await basicFetch(`/tv/${movieId}?language=pt-BR&api_key=${API_KEY}`)
        break
      default:
        info = null
        break
    }
  }

  return info
}







app.get("/", (req, res) => res.send("Hello World!"));

app.get("/api/home-list", async (req, res) => {
  try {
    const response = await getHomeList()

    return res.json({
      success: true,
      response,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/api/movie-info", async (req, res) => {
  try {
    const response = await getMovieInfo(req.query.movieId, req.query.type)

    return res.json({
      success: true,
      response,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
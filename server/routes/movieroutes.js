const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router();

const { addMovie, getAllMovies, getMovieById, deleteMovie,getRecommendedMovies} = require('../controllers/movieControllers');
// Public routes (later you can protect these with JWT)
router.post('/addmovie',addMovie);
router.get('/movies', getAllMovies);
router.get('/movies/:id', getMovieById);
router.delete('/movies/:id', deleteMovie);
router.get('/recommend/me', getRecommendedMovies);
module.exports = router;

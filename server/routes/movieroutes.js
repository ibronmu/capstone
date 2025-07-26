const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router();

const { addMovie, getAllMovies, getMovieById, deleteMovie,getRecommendedMovies} = require('../controllers/movieControllers');
// Public routes (later you can protect these with JWT)
router.post('/',addMovie);
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.delete('/:id', deleteMovie);
router.get('/recommend/me', getRecommendedMovies);
module.exports = router;

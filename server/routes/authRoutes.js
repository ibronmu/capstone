const express = require('express');
const router = express.Router();

const {
  addMovie,
  getAllMovies,
  getMovieById,
  deleteMovie,
  likeMovie,
  rateMovie
} = require('../controllers/movieControllers');
const authMiddleware = require('../middlewares/authMiddleware')

// Public
router.get('/', getAllMovies);
router.get('/:id', getMovieById);

// Admin-like
router.post('/', addMovie);
router.delete('/:id', deleteMovie);

// Protected (require login)
router.post('/:id/like', authMiddleware, likeMovie);
router.post('/:id/rate', authMiddleware, rateMovie);

module.exports = router;

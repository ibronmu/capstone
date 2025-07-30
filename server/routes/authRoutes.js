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
const {login , register} = require('../controllers/authController')
//user
router.post('/register',register)
router.post('/login',login)
// Public
router.get('/', getAllMovies);
router.get('/:id', getMovieById);

// Admin-like
router.post('/', addMovie);
router.delete('/:id', deleteMovie);

// Protected (require login)
router.post('/:id/like', likeMovie);
router.post('/:id/rate', rateMovie);

// // GET /api/user/me
// router.get('/me', authMiddleware, async (req, res) => {
//   const user = await User.findById(req.user.userId).select('-password');
//   res.json(user);
// });

// // PUT /api/user/me
// router.put('/me', authMiddleware, async (req, res) => {
//   const { username, email } = req.body;
//   const user = await User.findByIdAndUpdate(req.user.userId, { username, email }, { new: true });
//   res.json(user);
// });


module.exports = router;

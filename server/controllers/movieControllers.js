const Movie = require('../models/movie');

const addMovie = async (req, res) =>{
   try {
    const movie = new Movie(req.body);
    await movie.save();
     res.status(201).json(movie);

}catch(err){
    res.status(500).json({msg:err.message})
}
};

const getAllMovies = async (req, res) => {
  try {
    // Add a search parameter - OMDB requires one
    const response = await fetch('http://www.omdbapi.com/?apikey=77e30a1d&s=movie');
    const data = await response.json();
    
    if (data.Response === 'True') {
      res.json({ data: data.Search });
    } else {
      res.status(404).json({ message: 'No movies found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ msg: 'Movie not found' });
    res.json({ msg: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const likeMovie = async (req,res)=>{
  try {
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).json({msg:'Movie Not Found'})
      movie.likes += 1;
    res.json({msg:'Movie Liked',likes:movie.likes})
  } catch (error) {
    res.status(500).json({msg: error.message});


  }
}
const rateMovie = async (req,res) => {
  const {score } = req.body;
const userId = req.user.id; 
if(!score || score < 1 || score > 5) {
  return res.status(400).json({msg:'Score must be between 1 and 5'})
} 

try {
  const movie = await Movie.findById(req.params.id)
  if (!movie) return res.status(404).json({ msg: 'Movie not found' });
const existingRating = movie.ratings.find(r=>r.userId.toString() === user.id);
if(existingRating){
  existingRating.score = score;
}else{
  movie.ratings.push({userId,score})
}
await movie.save()
res.json({msg: 'Ratings Submitted',ratings:movie.ratings})
} catch (err) {
  res.status(500).json({msg:err.message})
}
};
const getRecommendedMovies = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Fetch movies rated >= 4 by this user
    const highRatedMovies = await Movie.find({ 'ratings.userId': userId });

    const likedGenres = new Set();

    highRatedMovies.forEach(movie => {
      const rating = movie.ratings.find(r => r.userId.toString() === userId && r.score >= 4);
      if (rating && movie.genre) {
        likedGenres.add(movie.genre);
      }
    });

    if (likedGenres.size === 0) {
      return res.json({
        status: "success",
        message: "No strong preferences found. Like or rate more movies.",
        data: { recommendations: [] }
      });
    }

    // Step 2: Recommend similar-genre movies not yet rated by user
    const recommendations = await Movie.find({
      genre: { $in: Array.from(likedGenres) },
      'ratings.userId': { $ne: userId }
    }).limit(10);

    // Optional: Calculate average rating
    const formatted = recommendations.map(movie => {
      const total = movie.ratings.reduce((sum, r) => sum + r.score, 0);
      const avg = movie.ratings.length > 0 ? (total / movie.ratings.length).toFixed(1) : null;

      return {
        _id: movie._id,
        title: movie.title,
        genre: movie.genre,
        description: movie.description,
        posterUrl: movie.posterUrl,
        likes: movie.likes,
        averageRating: avg
      };
    });

    res.json({
      status: "success",
      message: "Recommendations fetched successfully",
      data: { recommendations: formatted }
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message
    });
  }
};

module.exports = {
  addMovie,
  getAllMovies,
  getMovieById,
  deleteMovie,
  likeMovie,
  rateMovie,
  getRecommendedMovies
};
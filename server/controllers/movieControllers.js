const Movie = require('../models/movie');

const addMovie = async (req, res) => {
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
    // Option 1: Get movies from database (if you have any)
    const dbMovies = await Movie.find();
    
    if (dbMovies.length > 0) {
      return res.status(200).json({
        status: 'success',
        count: dbMovies.length,
        data: dbMovies
      });
    }
    
    // Option 2: If no database movies, fetch sample movies from OMDB and save them
    console.log('No movies in database, fetching from OMDB...');
    
    const movieIds = [
      'tt3896198', // Guardians of the Galaxy Vol. 2
      'tt4154756', // Avengers: Infinity War
      'tt4154796', // Avengers: Endgame
      'tt0848228', // The Avengers
      'tt0468569', // The Dark Knight
    ];
    
    const movies = [];
    
    for (const imdbId of movieIds) {
      try {
        const response = await fetch(`http://www.omdbapi.com/?i=${imdbId}&apikey=77e30a1d`);
        const omdbData = await response.json();
        
        if (omdbData.Response === 'True') {
          // Convert OMDB data to your database format
          const movieData = {
            title: omdbData.Title,
            year: omdbData.Year,
            genre: omdbData.Genre,
            description: omdbData.Plot,
            posterUrl: omdbData.Poster,
            imdbID: omdbData.imdbID,
            director: omdbData.Director,
            actors: omdbData.Actors,
            runtime: omdbData.Runtime,
            rated: omdbData.Rated,
            likes: 0,
            ratings: []
          };
          
          // Save to database
          const movie = new Movie(movieData);
          await movie.save();
          movies.push(movie);
        }
      } catch (fetchError) {
        console.log(`Failed to fetch movie ${imdbId}:`, fetchError.message);
      }
    }
    
    res.status(200).json({
      status: 'success',
      count: movies.length,
      data: movies,
      message: `Fetched and saved ${movies.length} movies from OMDB`
    });
    
  } catch (err) {
    res.status(500).json({ 
      status: 'error',
      message: err.message 
    });
  }
};

// Alternative version if you want to return movies directly as array
const getAllMoviesSimple = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies); // Returns array directly
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'Invalid movie ID format' });
    }
    
    const movie = await Movie.findById(id);
    
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    
    // Calculate average rating
    const totalRatings = movie.ratings.reduce((sum, rating) => sum + rating.score, 0);
    const averageRating = movie.ratings.length > 0 ? 
      (totalRatings / movie.ratings.length).toFixed(1) : null;
    
    // Return movie with additional computed fields
    const movieWithStats = {
      ...movie.toObject(),
      averageRating,
      totalRatings: movie.ratings.length,
      totalLikes: movie.likes
    };
    
    res.json({
      status: 'success',
      data: movieWithStats
    });
    
  } catch (err) {
    res.status(500).json({ 
      msg: 'Server error while fetching movie',
      error: err.message 
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'Invalid movie ID format' });
    }
    
    const movie = await Movie.findByIdAndDelete(id);
    
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    
    res.json({ 
      msg: 'Movie deleted successfully',
      deletedMovie: {
        id: movie._id,
        title: movie.title,
        genre: movie.genre
      }
    });
    
  } catch (err) {
    res.status(500).json({ 
      msg: 'Server error while deleting movie',
      error: err.message 
    });
  }
};

const likeMovie = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'Invalid movie ID format' });
    }
    
    const movie = await Movie.findById(id);
    
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    
    // Optional: Prevent multiple likes from same user (if you have user auth)
    // You can implement this based on your authentication system
    
    movie.likes += 1;
    await movie.save();
    
    res.json({ 
      msg: 'Movie liked successfully',
      movieTitle: movie.title,
      totalLikes: movie.likes,
      movieId: movie._id
    });
    
  } catch (error) {
    res.status(500).json({ 
      msg: 'Server error while liking movie',
      error: error.message 
    });
  }
};

const rateMovie = async (req, res) => {
  const { score } = req.body;
  
  // Check if user is authenticated (you might need to adjust this based on your auth middleware)
  if (!req.user || !req.user.id) {
    return res.status(401).json({ msg: 'Authentication required' });
  }
  
  const userId = req.user.id; 
  
  if (!score || score < 1 || score > 5) {
    return res.status(400).json({ msg: 'Score must be between 1 and 5' });
  } 

  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: 'Movie not found' });
    
    const existingRating = movie.ratings.find(r => r.userId.toString() === userId);
    
    if (existingRating) {
      existingRating.score = score;
    } else {
      movie.ratings.push({ userId, score });
    }
    
    await movie.save();
    
    // Calculate new average rating
    const totalRatings = movie.ratings.reduce((sum, rating) => sum + rating.score, 0);
    const averageRating = (totalRatings / movie.ratings.length).toFixed(1);
    
    res.json({ 
      msg: 'Rating submitted successfully', 
      ratings: movie.ratings,
      averageRating: averageRating,
      totalRatings: movie.ratings.length
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getRecommendedMovies = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Authentication required' 
      });
    }
    
    const userId = req.user.id;

    // Step 1: Fetch movies rated >= 4 by this user
    const highRatedMovies = await Movie.find({ 
      'ratings.userId': userId,
      'ratings.score': { $gte: 4 }
    });

    const likedGenres = new Set();

    highRatedMovies.forEach(movie => {
      const rating = movie.ratings.find(r => 
        r.userId.toString() === userId && r.score >= 4
      );
      if (rating && movie.genre) {
        // Split genres if they're comma-separated (like "Action, Adventure, Comedy")
        const genres = movie.genre.split(',').map(g => g.trim());
        genres.forEach(genre => likedGenres.add(genre));
      }
    });

    if (likedGenres.size === 0) {
      return res.json({
        status: "success",
        message: "No strong preferences found. Rate some movies with 4 or 5 stars to get recommendations!",
        data: { recommendations: [] }
      });
    }

    // Step 2: Find movies with similar genres that user hasn't rated yet
    const recommendations = await Movie.find({
      $and: [
        { 
          $or: Array.from(likedGenres).map(genre => ({
            genre: { $regex: genre, $options: 'i' }
          }))
        },
        { 'ratings.userId': { $ne: userId } }
      ]
    }).limit(10);

    // Step 3: Calculate average ratings and format response
    const formatted = recommendations.map(movie => {
      const total = movie.ratings.reduce((sum, r) => sum + r.score, 0);
      const avg = movie.ratings.length > 0 ? (total / movie.ratings.length).toFixed(1) : null;

      return {
        _id: movie._id,
        title: movie.title,
        genre: movie.genre,
        description: movie.description,
        posterUrl: movie.posterUrl,
        year: movie.year,
        director: movie.director,
        actors: movie.actors,
        likes: movie.likes,
        averageRating: avg,
        totalRatings: movie.ratings.length
      };
    });

    res.json({
      status: "success",
      message: `Found ${formatted.length} recommendations based on your preferences for: ${Array.from(likedGenres).join(', ')}`,
      data: { 
        recommendations: formatted,
        basedOnGenres: Array.from(likedGenres),
        userHighRatedMovies: highRatedMovies.length
      }
    });

  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching recommendations",
      error: err.message
    });
  }
};

// Additional utility functions

// Get movies by genre
const getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    
    const movies = await Movie.find({
      genre: { $regex: genre, $options: 'i' } // Case-insensitive search
    });
    
    if (movies.length === 0) {
      return res.status(404).json({ 
        msg: `No movies found for genre: ${genre}` 
      });
    }
    
    // Add average ratings to each movie
    const moviesWithRatings = movies.map(movie => {
      const totalRatings = movie.ratings.reduce((sum, rating) => sum + rating.score, 0);
      const averageRating = movie.ratings.length > 0 ? 
        (totalRatings / movie.ratings.length).toFixed(1) : null;
      
      return {
        ...movie.toObject(),
        averageRating,
        totalRatings: movie.ratings.length
      };
    });
    
    res.json({
      status: 'success',
      genre: genre,
      count: movies.length,
      data: moviesWithRatings
    });
    
  } catch (err) {
    res.status(500).json({ 
      msg: 'Server error while fetching movies by genre',
      error: err.message 
    });
  }
};

// Search movies by title
const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ msg: 'Search query is required' });
    }
    
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { actors: { $regex: query, $options: 'i' } },
        { director: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.json({
      status: 'success',
      query: query,
      count: movies.length,
      data: movies
    });
    
  } catch (err) {
    res.status(500).json({ 
      msg: 'Server error while searching movies',
      error: err.message 
    });
  }
};

// Get top rated movies
const getTopRatedMovies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const movies = await Movie.find({ 'ratings.0': { $exists: true } }); // Movies with at least 1 rating
    
    // Calculate average ratings and sort
    const moviesWithAvgRating = movies.map(movie => {
      const totalRatings = movie.ratings.reduce((sum, rating) => sum + rating.score, 0);
      const averageRating = totalRatings / movie.ratings.length;
      
      return {
        ...movie.toObject(),
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalRatings: movie.ratings.length
      };
    }).sort((a, b) => b.averageRating - a.averageRating).slice(0, limit);
    
    res.json({
      status: 'success',
      message: `Top ${limit} rated movies`,
      count: moviesWithAvgRating.length,
      data: moviesWithAvgRating
    });
    
  } catch (err) {
    res.status(500).json({ 
      msg: 'Server error while fetching top rated movies',
      error: err.message 
    });
  }
};

module.exports = {
  addMovie,
  getAllMovies,
  getAllMoviesSimple, // Alternative version
  getMovieById,
  deleteMovie,
  likeMovie,
  rateMovie,
  getRecommendedMovies,
  getMoviesByGenre,
  searchMovies,
  getTopRatedMovies
};
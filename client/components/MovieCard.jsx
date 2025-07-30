import { useState } from 'react';

const MovieCard = ({ movie, onRate }) => {
  const [currentRating, setCurrentRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Handle different data structures (OMDB vs your database)
  const movieTitle = movie.title || movie.Title || 'Unknown Title';
  const movieGenre = movie.genre || movie.Genre || 'Unknown Genre';
  const moviePoster = movie.posterUrl || movie.Poster || 'https://via.placeholder.com/300x450?text=No+Image';
  const movieYear = movie.year || movie.Year || 'Unknown Year';
  const moviePlot = movie.description || movie.Plot || 'No description available';
  const movieId = movie._id || movie.id || movie.imdbID;
  const movieLikes = movie.likes || 0;
  const movieRatings = movie.ratings || movie.Ratings || [];


<select onChange={(e) => handleAddToWatchlist(e.target.value)}>
  <option>Select Watchlist</option>
  {/* {watchlists.map(list => (
    <option key={list.name} value={list.name}>{list.name}</option>
  ))} */}
</select>

const handleAddToWatchlist = async (listName) => {
  await axios.post(
    `http://localhost:5000/api/user/watchlist/${listName}/add/${movie._id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};


  // Calculate average rating
  const calculateAverageRating = () => {
    if (Array.isArray(movieRatings) && movieRatings.length > 0) {
      // Handle your database ratings format
      if (movieRatings[0].score !== undefined) {
        const total = movieRatings.reduce((sum, rating) => sum + rating.score, 0);
        return (total / movieRatings.length).toFixed(1);
      }
      // Handle OMDB ratings format
      else if (movieRatings[0].Source && movieRatings[0].Value) {
        const imdbRating = movieRatings.find(r => r.Source === "Internet Movie Database");
        if (imdbRating) {
          return imdbRating.Value.split('/')[0]; // Extract rating from "7.6/10"
        }
      }
    }
    return 'N/A';
  };

  const handleLike = async () => {
    try {
      // Only proceed if we have a valid movie ID from your database
      if (movie._id) {
        const response = await fetch(`/api/movies/${movie._id}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsLiked(true);
          // You might want to update the likes count in parent component
        }
      } else {
        alert('Can only like movies saved in our database');
      }
    } catch (error) {
      console.error('Error liking movie:', error);
    }
  };

  const handleRate = async (rating) => {
    try {
      if (movie._id) {
        const response = await fetch(`/api/movies/${movie._id}/rate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ score: rating })
        });
        
        if (response.ok) {
          setCurrentRating(rating);
          if (onRate) onRate(); // Refresh recommendations
        }
      } else {
        alert('Can only rate movies saved in our database');
      }
    } catch (error) {
      console.error('Error rating movie:', error);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        onClick={() => handleRate(star)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '20px',
          color: star <= currentRating ? '#ffd700' : '#ddd',
          cursor: 'pointer',
          padding: '2px'
        }}
        disabled={!movie._id} // Only allow rating for database movies
      >
        ★
      </button>
    ));
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      display: 'flex',
      gap: '16px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      
      {/* Movie Poster */}
      <div style={{ flexShrink: 0 }}>
        <img 
          src={moviePoster}
          alt={movieTitle}
          style={{
            width: '150px',
            height: '225px',
            objectFit: 'cover',
            borderRadius: '4px'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150x225?text=No+Image';
          }}
        />
      </div>

      {/* Movie Details */}
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
          {movieTitle} ({movieYear})
        </h3>
        
        <p style={{ margin: '4px 0', color: '#666', fontWeight: 'bold' }}>
          <strong>Genre:</strong> {movieGenre}
        </p>
        
        <p style={{ margin: '8px 0', color: '#555', lineHeight: '1.4' }}>
          {moviePlot}
        </p>
        
        <div style={{ margin: '12px 0' }}>
          <strong>Average Rating:</strong> {calculateAverageRating()}
        </div>

        {/* Like Button */}
        <div style={{ margin: '12px 0' }}>
          <button
            onClick={handleLike}
            disabled={!movie._id}
            style={{
              background: isLiked ? '#ff6b6b' : '#fff',
              color: isLiked ? '#fff' : '#ff6b6b',
              border: '2px solid #ff6b6b',
              borderRadius: '20px',
              padding: '8px 16px',
              cursor: movie._id ? 'pointer' : 'not-allowed',
              marginRight: '12px',
              opacity: movie._id ? 1 : 0.5
            }}
          >
            ❤️ Like ({movieLikes})
          </button>
          
          {!movie._id && (
            <small style={{ color: '#999' }}>
              (Save to database to like/rate)
            </small>
          )}
        </div>

        {/* Rating */}
        <div style={{ margin: '12px 0' }}>
          <span style={{ marginRight: '8px' }}>Rate:</span>
          {renderStars()}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
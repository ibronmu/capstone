// src/components/MovieCard.jsx
import api from '../services/api';
import { useState } from 'react';

const MovieCard = ({ movie, onRate }) => {
  const [likes, setLikes] = useState(movie.likes || 0);
  const [rating, setRating] = useState(null);

  const handleLike = async () => {
    try {
      const res = await api.post(`/movies/${movie._id}/like`);
      setLikes(res.data.likes);
    } catch (err) {
      alert('You must be logged in to like a movie');
    }
  };

  const handleRate = async (score) => {
    try {
      await api.post(`/movies/${movie._id}/rate`, { score });
      setRating(score);
      if (onRate) onRate(); // refresh recommendations if needed
    } catch (err) {
      alert('You must be logged in to rate a movie');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem' }}>
      <h3>{movie.title}</h3>
      <p><strong>Genre:</strong> {movie.genre}</p>
      <p>{movie.description}</p>
      <p><strong>Average Rating:</strong> {movie.averageRating || "N/A"}</p>
      <img src={movie.posterUrl} alt={movie.title} style={{ width: '200px' }} />
      <div>
        <button onClick={handleLike}>❤️ Like ({likes})</button>
      </div>
      <div>
        <label>Rate:</label>
        {[1, 2, 3, 4, 5].map((num) => (
          <button key={num} onClick={() => handleRate(num)}>{num}</button>
        ))}
        {rating && <span> — You rated it {rating}</span>}
      </div>
    </div>
  );
};

export default MovieCard;

import { useEffect, useState } from 'react';
import api from '../services/api';
import MovieCard from '../components/Moviecard';

const Home = () => {
    if (!localStorage.getItem('token')) {
  return <p>Please log in to view movies.</p>;
}

  const [allMovies, setAllMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const fetchMovies = async () => {
    try {
      const res = await api.get('/movies');
      setAllMovies(res.data.data || res.data); // fallback
    } catch (err) {
      console.error('Failed to fetch movies', err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await api.get('/movies/recommend/me');
      setRecommendations(res.data.data.recommendations || []);
    } catch (err) {
      console.error('No recommendations found or not logged in.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
    fetchMovies();
    fetchRecommendations();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🎬 All Movies</h2>
      {allMovies.length === 0 && <p>Loading movies...</p>}
      {allMovies.map(movie => (
        <MovieCard key={movie._id} movie={movie} onRate={fetchRecommendations} />
      ))}

      <h2>⭐ Recommended For You</h2>
      {recommendations.length === 0 && <p>No recommendations yet. Rate some movies!</p>}
      {recommendations.map(movie => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  );
};

export default Home;

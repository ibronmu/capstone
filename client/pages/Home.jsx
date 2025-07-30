import { useEffect, useState } from 'react';
import {api} from '../services/api';
import MovieCard from '../components/Moviecard';

const Home = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchMovies = async() => {
    try {
      setLoading(true);
      const res = await api.get('/movies');
      console.log('Full response:', res);
      console.log('Response data:', res.data);
      console.log('Response data structure:', JSON.stringify(res.data, null, 2));
      console.log('Object keys:', Object.keys(res.data));
      console.log('Is res.data an array?', Array.isArray(res.data));
      
      // Handle the actual API response structure
      if (Array.isArray(res.data)) {
        // If API returns array directly
        setAllMovies(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        // If API returns { data: [...] }
        setAllMovies(res.data.data);
      } else if (res.data && Array.isArray(res.data.movies)) {
        // If API returns { movies: [...] }
        setAllMovies(res.data.movies);
      } else if (res.data && res.data.data && typeof res.data.data === 'object') {
        // If API returns single movie object in { data: {...} }
        console.log('Single movie detected, converting to array');
        setAllMovies([res.data.data]);
      } else {
        console.log('Unexpected API response structure:', res.data);
        setAllMovies([]);
      }
    } catch (err) {
      console.log('Error fetching movies:', err.message);
      setAllMovies([]); // Ensure it stays an array on error
    } finally {
      setLoading(false);
    }
  };

  // const fetchRecommendations = async () => {
  //   try {
  //     const res = await api.get('/movies/recommend/me');
  //     setRecommendations(res.data.data.recommendations || []);
  //   } catch (err) {
  //     alert(err)
  //   }
  // };

  useEffect(() => {
    fetchMovies();
    //fetchRecommendations();
  }, []);

  // Debug effect to see state changes
  useEffect(() => {
    console.log('allMovies state updated:', allMovies);
    console.log('allMovies length:', allMovies.length);
  }, [allMovies]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🎬 All Movies</h2>
      
      {/* Debug information */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
        <strong>Debug Info:</strong><br />
        Loading: {loading.toString()}<br />
        Movies count: {allMovies.length}<br />
        Movies data: {JSON.stringify(allMovies.slice(0, 2), null, 2)}
      </div>

      {/* Loading state */}
      {loading && <p>Loading movies...</p>}
      
      {/* No movies found */}
      {!loading && allMovies.length === 0 && <p>No movies found.</p>}
      
      {/* Movies list */}
      {!loading && allMovies.length > 0 && allMovies.map(movie => (
        <MovieCard 
          key={movie.imdbID || movie.id || movie._id || movie.Title} 
          movie={movie} 
          /*onRate={fetchRecommendations}*/ 
        />
      ))}

      <h2>⭐ Recommended For You</h2>
      {recommendations.length === 0 && <p>No recommendations yet. Rate some movies!</p>}
      {recommendations.map(movie => (
        <MovieCard key={movie._id || movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default Home;
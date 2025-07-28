import { useEffect, useState } from 'react';
import {api,omdb} from '../services/api';
import MovieCard from '../components/Moviecard';

const Home = () => {
   const [omdbMovies, setOmdbMovies] = useState([])
  const [allMovies, setAllMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
const fetchOmdbMovies = async()=>{
  try{
      // Default search for popular movies
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=77e30a1d&s=action`
        );
        const data = await response.json();
        
        if (data.Response === 'True') {
          setOmdbMovies(data.Search);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        
      }
}  

  

  // const fetchRecommendations = async () => {
  //   try {
  //     const res = await api.get('/movies/recommend/me');
  //     setRecommendations(res.data.data.recommendations || []);
  //   } catch (err) {
  //     alert(err)
  //   }
  // };

  useEffect(() => {
  //  fetchMovies();
    fetchOmdbMovies()
    //fetchRecommendations();
  }, []);

  return (
    // <div style={{ padding: '2rem' }}>
    //   <h2>🎬 All Movies</h2>
    //   {omdMovies.map(movie => (
    //     <MovieCard key={movie.id} movie={movie} /*onRate={fetchRecommendations}*/ />
    //   ))}
    //   {allMovies.length === 0 && <p>Loading movies...</p>}
    //   {allMovies.map(movie => (
    //     <MovieCard key={movie.id} movie={movie} /*onRate={fetchRecommendations}*/ />
    //   ))}

    //   <h2>⭐ Recommended For You</h2>
    //   {recommendations.length === 0 && <p>No recommendations yet. Rate some movies!</p>}
    //   {recommendations.map(movie => (
    //     <MovieCard key={movie._id} movie={movie} />
    //   ))}
    // </div>
     <div className="movie-grid">
      {omdbMovies.map(movie => (
        <div key={movie.imdbID} className="movie-card">
          <img 
            src={movie.Poster !== 'N/A' ? movie.Poster : 'placeholder-image.jpg'} 
            alt={movie.Title} 
          />
          <h3>{movie.Title}</h3>
          <p>{movie.Year}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;

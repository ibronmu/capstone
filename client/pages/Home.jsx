import { useEffect, useState } from 'react';
import {api} from '../services/api';
import MovieCard from '../components/Moviecard';

const Home = () => {
   const [Movies, setMovies] = useState([])
  const [allMovies, setAllMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
const fetchMovies = async()=>{
  try{
     const res = await api.get('/movies');
      setAllMovies(res.data.search);
    } catch (err) {
      console.log(err.message)
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
  //  fetchMovies();
    fetchMovies()
    //fetchRecommendations();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🎬 All Movies</h2>
      {Movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} /*onRate={fetchRecommendations}*/ />
      ))}
      {/allMovies.length === 0 && <p>Loading movies...</p>}
      {allMovies.map(movie => (
        <MovieCard key={movie.id} movie={movie} /*onRate={fetchRecommendations}*/ />
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

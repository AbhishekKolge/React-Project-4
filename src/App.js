import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(
        'https://react-project---4---movies-default-rtdb.firebaseio.com/movies.json'
      );
      if (response.status !== 200) {
        throw new Error('Something Went Wrong.');
      }

      const data = await response.json();

      let fetchedMovies = [];

      for (const key in data) {
        fetchedMovies.push({
          id: key,
          title: data[key].title,
          releaseDate: data[key].releaseDate,
          openingText: data[key].openingText,
        });
      }
      setMovies(fetchedMovies);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  }, []);

  const addMovieHandler = async (movie) => {
    try {
      const response = await fetch(
        'https://react-project---4---movies-default-rtdb.firebaseio.com/movies.json',
        {
          method: 'POST',
          body: JSON.stringify(movie),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Something Went Wrong.');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content = <p>Fetch Movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (errorMessage) {
    content = <p>{errorMessage}</p>;
  }

  if (isLoading) {
    content = <p>Loading Movies.</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WatchList from "./Component/WatchList";
import MovieList from "./Component/MovieList";
import Navbar from "./Component/Navbar";
import SearchBar from "./Component/SearchBar";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [watchList, setWatchList] = useState([]);

  useEffect(() => {
    if (searchTerm.length < 3) return;

    fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=817f7a73`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Search) setMovies(data.Search);
      });
  }, [searchTerm]);

  const addToWatchList = (movie) => {
    if (!watchList.find((m) => m.imdbID === movie.imdbID)) {
      setWatchList([...watchList, movie]);
      alert(`${movie.Title} added to watchlist!`);
    }
  };

  const removeFromWatchList = (movieId) => {
    setWatchList(watchList.filter((movie) => movie.imdbID !== movieId));
    alert("Movie removed from watchlist!");
  };

  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <WatchList
                watchList={watchList}
                removeFromWatchList={removeFromWatchList}
              />
            }
          />
          <Route
            path="/add"
            element={
              <>
                <SearchBar setSearchTerm={setSearchTerm} />{" "}
                <MovieList
                  movies={movies}
                  addToWatchList={addToWatchList}
                />{" "}
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

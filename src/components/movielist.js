import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, setMovie } from "../actions/movieActions";
import { Link } from 'react-router-dom';
import { Image, Nav, Carousel } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';

function MovieList() {
    const dispatch = useDispatch();
    const movies = useSelector(state => state.movie.movies);

    // Memoize the movies array
    const memoizedMovies = useMemo(() => {
        return movies || []; // Safe fallback to empty array
    }, [movies]);

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);

    const handleSelect = (selectedIndex) => {
        dispatch(setMovie(memoizedMovies[selectedIndex]));
    };

    const handleClick = (movie) => {
        dispatch(setMovie(movie));
    };

    if (!movies || movies.length === 0) { 
        return <div>Loading....</div>;
    }

    return (
        <Carousel onSelect={handleSelect} className="bg-dark text-light p-4 rounded">
          {memoizedMovies.map((movie) => (
            <Carousel.Item key={movie._id}>
              <Nav.Link
                as={Link}
                to={`/movie/${movie._id}`}
                onClick={() => handleClick(movie)}
              >
                <Image 
    className="image" 
    src={movie.imageUrl ? movie.imageUrl : "https://placehold.co/300x450/212529/FFF?text=No+Poster"} 
    thumbnail 
    style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
/>
              </Nav.Link>
              <Carousel.Caption>
                <h3>{movie.title}</h3>
                {/* Format the rating so it looks clean */}
                <BsStarFill /> {movie.avgRating ? Number(movie.avgRating).toFixed(1) : 'No Ratings'} &nbsp;&nbsp; {movie.releaseDate}
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      );
}

export default MovieList;
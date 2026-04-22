import React, { useEffect, useState } from 'react';
import { fetchMovie } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image, Form, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams();
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading); 
  const error = useSelector(state => state.movie.error); 

  // Local state for the Review Form
  const [reviewQuote, setReviewQuote] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  // Handle submitting the new review to your Render API
  const submitReview = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                movieId: selectedMovie._id,
                review: reviewQuote,
                rating: Number(rating)
            })
        });

        if(response.ok) {
            // Re-fetch the movie to instantly show the new review and updated average!
            dispatch(fetchMovie(movieId)); 
            setReviewQuote(''); // Clear the form
            setRating(5);
        } else {
            alert('Failed to submit review. Are you logged in?');
        }
    } catch (err) {
        console.error("Error submitting review: ", err);
    }
  };

  // --- THE FIX IS HERE ---
  // We removed the "DetailInfo" inner component and handle the checks directly here.
  if (loading) return <div>Loading....</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedMovie) return <div>No movie data available.</div>;

  // We return the JSX directly from the main component!
  return (
    <Card className="bg-dark text-dark p-4 rounded">
      <Card.Header className="text-white"><h4>Movie Detail</h4></Card.Header>
      <Card.Body>
        <Image 
          className="image" 
          src={selectedMovie.imageUrl || "https://placehold.co/300x450/212529/FFF?text=No+Poster"} 
          thumbnail 
          style={{ maxWidth: '300px' }} 
        />
      </Card.Body>
      <ListGroup>
        <ListGroupItem><h3>{selectedMovie.title}</h3></ListGroupItem>
        <ListGroupItem>
          <h5>Actors:</h5>
          {(selectedMovie.actors || []).map((actor, i) => (
            <p key={i} className="mb-0">
              <b>{actor.actorName}</b> as {actor.characterName}
            </p>
          ))}
        </ListGroupItem>
        <ListGroupItem>
          <h4>
            <BsStarFill className="text-warning"/> {selectedMovie.avgRating ? Number(selectedMovie.avgRating).toFixed(1) : 'No Ratings Yet'}
          </h4>
        </ListGroupItem>
      </ListGroup>

      <Card.Body className="card-body bg-light mt-3 rounded">
        <h5>Reviews:</h5>
        {(selectedMovie.reviews || []).length > 0 ? (
          selectedMovie.reviews.map((review, i) => (
            <div key={i} className="mb-3 border-bottom pb-2">
              <b>{review.username}</b> &nbsp; <BsStarFill className="text-warning"/> {review.rating}/5
              <p className="mb-0 mt-1">"{review.review}"</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first!</p>
        )}

        <div className="mt-4 border-top pt-3">
          <h5>Leave a Review</h5>
          <Form onSubmit={submitReview}>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control 
                  as="select" 
                  value={rating} 
                  onChange={(e) => setRating(e.target.value)}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Review</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="What did you think of the movie?"
                value={reviewQuote}
                onChange={(e) => setReviewQuote(e.target.value)} // This will now work perfectly!
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </Form>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MovieDetail;
import { useState, useEffect } from 'react';

function ReviewSection({ mealId }) {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`reviews-${mealId}`);
    if (stored) {
      setReviews(JSON.parse(stored));
    }
  }, [mealId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newReview = { name, comment, date: new Date().toLocaleString() };
    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem(`reviews-${mealId}`, JSON.stringify(updated));

    setName('');
    setComment('');
  };

  return (
    <div className="review-section">
      <h4>💬 Reviews</h4>
      <form onSubmit={handleSubmit} className="review-form">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>

      <div className="reviews">
        {reviews.map((rev, idx) => (
          <div key={idx} className="review">
            <strong>{rev.name}</strong> <em>({rev.date})</em>
            <p>{rev.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && <p>No reviews yet.</p>}
      </div>
    </div>
  );
}

export default ReviewSection;

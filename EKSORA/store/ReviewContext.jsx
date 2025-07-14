import React, { createContext, useContext, useState } from 'react';

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviewData, setReviewData] = useState({
  reviews: [],
  rating: 0,
  count: 0,
});


  return (
    <ReviewContext.Provider value={{ reviewData, setReviewData }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviewContext = () => useContext(ReviewContext);

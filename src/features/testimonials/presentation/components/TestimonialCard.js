import React from 'react';
import { Star } from 'lucide-react';

// Pequeño componente para renderizar las estrellas
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const starNumber = index + 1;
        return (
          <Star
            key={starNumber}
            size={16}
            className={
              starNumber <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-stone-300 dark:text-stone-600 fill-current'
            }
          />
        );
      })}
    </div>
  );
};

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="flex-shrink-0 w-80 sm:w-96 bg-white dark:bg-stone-800 rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name} 
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <p className="font-semibold text-stone-900 dark:text-white">{testimonial.name}</p>
          <p className="text-sm text-stone-500 dark:text-stone-400">{testimonial.location}</p>
        </div>
      </div>
      
      {/* Calificación con estrellas */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>

      <p className="text-stone-600 dark:text-stone-300 flex-grow">"{testimonial.text}"</p>
    </div>
  );
};

export default TestimonialCard;

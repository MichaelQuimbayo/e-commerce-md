import React, { useRef, useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection = ({ testimonials }) => {
  const scrollContainer = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainer.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = scrollContainer.current.clientWidth * 0.8;
      scrollContainer.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const currentContainer = scrollContainer.current;
    if (currentContainer) {
      checkScroll();
      currentContainer.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);

      return () => {
        currentContainer.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [testimonials]);

  return (
    <div className="py-16 sm:py-20  dark:bg-gray-900" > {/* Removed bg-stone-50 dark:bg-gray-900 */}
      <div className="max-w-8xl mx-auto bg-stone-50 border-2 rounded-2xl">
        <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl mt-6 MT font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
            Lo que dicen nuestros Clientes
          </h2>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center z-10">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2 rounded-full bg-white/80 dark:bg-stone-900/80 shadow-md disabled:opacity-0 disabled:cursor-not-allowed transition-opacity ml-4"
              aria-label="Anterior"
            >
              <ChevronLeft className="text-stone-800 dark:text-white" />
            </button>
          </div>

          <div
            ref={scrollContainer}
            className="flex overflow-x-auto space-x-8 py-8 scrollbar-hide px-4 sm:px-6 lg:px-8"
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center z-10">
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2 rounded-full bg-white/80 dark:bg-stone-900/80 shadow-md disabled:opacity-0 disabled:cursor-not-allowed transition-opacity mr-4"
              aria-label="Siguiente"
            >
              <ChevronRight className="text-stone-800 dark:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const HeroCarousel = ({ slides, autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (autoPlayInterval) {
      const timer = setTimeout(goToNext, autoPlayInterval);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoPlayInterval]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative h-[80vh] min-h-[200px] w-full overflow-hidden">
      {/* Slide Content */}
      <div className="w-full h-full relative">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out" style={{ backgroundImage: `url(${currentSlide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        {/*<div className="absolute inset-0 bg-black opacity-50"></div>*/}

        {/* Text Content */}
        {/*<div className="relative h-full flex flex-col items-center justify-center text-center text-white z-10 p-4">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold">
            {currentSlide.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-stone-200">
            {currentSlide.subtitle}
          </p>
          <div className="mt-8">
            <Link href={currentSlide.link || '/shop'} className="inline-block bg-white text-stone-900 font-semibold px-8 py-3 rounded-lg hover:bg-stone-200 transition-colors">
              {currentSlide.cta}
            </Link>
          </div>
        </div>*/}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-5 z-20">
        <button onClick={goToPrevious} className="p-2 rounded-full bg-white/50 hover:bg-white/80 text-stone-800 transition-colors">
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-5 z-20">
        <button onClick={goToNext} className="p-2 rounded-full bg-white/50 hover:bg-white/80 text-stone-800 transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-white scale-110' : 'bg-white/50'}`}
            aria-label={`Ir a la diapositiva ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;

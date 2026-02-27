import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ModelingCarousel = ({ products: productGroups }) => { // Renamed for clarity
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
      checkScroll(); // Initial check
      currentContainer.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);

      return () => {
        currentContainer.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [productGroups]); // Re-run effect if productGroups change

  if (!productGroups || productGroups.length === 0) {
    return null;
  }

  return (
    <div className="py-16 sm:py-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 border-2 rounded-2xl bg-stone-50 dark:bg-stone-900">
      <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white mb-8">#ATHLOSenlaCalle</h2>
      <div className="relative mt-8">
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
          className="flex overflow-x-auto space-x-6 py-2 scrollbar-hide snap-x snap-mandatory "
        >
          {productGroups.map((group) => ( // Changed 'product' to 'group'
            <div key={group.groupCode} className="w-full md:w-1/4 flex-shrink-0 snap-center rounded-lg overflow-hidden shadow-lg"> {/* Changed key and reference */}
              <img src={group.mainImage || 'https://via.placeholder.com/400'} alt={`${group.name} - Modelo`} className="w-full h-full object-cover" /> {/* Changed src */}
            </div>
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
  );
};

export default ModelingCarousel;

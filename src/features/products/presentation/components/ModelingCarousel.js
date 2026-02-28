import React from 'react';

const ModelingCarousel = ({ products: productGroups }) => {
  if (!productGroups || productGroups.length === 0) {
    return null;
  }

  // Duplicate the items for a seamless loop
  const duplicatedGroups = [...productGroups, ...productGroups];

  return (
    <div className="py-16 sm:py-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 border-2 rounded-2xl bg-stone-50 dark:bg-stone-900">
      <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white mb-8 text-center">#AVSTOREenlaCalle</h2>
      <div className="relative mt-8 w-full overflow-hidden">
        <div className="flex animate-scroll">
          {duplicatedGroups.map((group, index) => (
            <div key={`${group.groupCode}-${index}`} className="w-1/2 md:w-1/4 flex-shrink-0 p-2">
              <div className="rounded-lg snap-center overflow-hidden shadow-lg aspect-[3/4]">
                <img src={group.mainImage || 'https://via.placeholder.com/400'} alt={`${group.name} - Modelo`} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelingCarousel;

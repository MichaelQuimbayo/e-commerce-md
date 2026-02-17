import React from 'react';
import { Gem, Tag, ShieldCheck } from 'lucide-react';

const guarantees = [
  {
    name: 'Calidad Premium',
    description: 'Utilizamos los mejores materiales para asegurar durabilidad, comodidad y un rendimiento superior en cada prenda.',
    icon: Gem,
  },
  {
    name: 'Precios Justos',
    description: 'Ofrecemos equipamiento de alta gama a un valor accesible, eliminando intermediarios innecesarios.',
    icon: Tag,
  },
  {
    name: 'Compra Segura',
    description: 'Tu satisfacción es nuestra prioridad. Disfruta de un proceso de compra seguro y devoluciones sencillas.',
    icon: ShieldCheck,
  },
];

const GuaranteesSection = () => {
  return (
    <div className="bg-stone-50 dark:bg-gray-900 py-12 sm:py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 text-center lg:grid-cols-3">
          {guarantees.map((guarantee) => (
            <div 
              key={guarantee.name} 
              className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-lg flex flex-col items-center"
            >
              <guarantee.icon className="h-12 w-12 text-blue-600 mb-5" aria-hidden="true" />
              <h3 className="text-lg font-semibold leading-7 text-stone-900 dark:text-white">
                {guarantee.name}
              </h3>
              <p className="mt-2 text-base leading-7 text-stone-600 dark:text-stone-400">
                {guarantee.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuaranteesSection;

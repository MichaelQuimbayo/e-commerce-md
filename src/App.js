import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import BenefitsSection from './components/BenefitsSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Navbar />
      <main>
        <HeroSection />
        <ProductGrid />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;

import React from 'react';
import ProductList from "../features/products/components/ProductList";
import NavBar from "./NavBar";
import Hero from "./Hero";
import AboutUs from "./AboutUs";
import Contact from "./Contact";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-white selection:text-black scroll-smooth">
      <NavBar />
      <main>
        <Hero />
        <AboutUs />
        <div id="products">
          <ProductList />
        </div>
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
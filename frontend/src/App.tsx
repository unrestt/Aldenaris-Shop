import './App.css'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import ProductDetails from './features/products/components/ProductDetails'
import NavBar from './layout/NavBar'
import Footer from './layout/Footer'
import CartPage from './features/cart/components/CartPage'
import { CustomToaster } from './components/CustomToaster'
import { ScrollToTop } from './components/ScrollToTop'

function App() {
  return (
    <>
      <ScrollToTop />
      <CustomToaster />
      <Routes>
        <Route path='/' element={<MainLayout />} />
        <Route path='/product/:id' element={
          <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-white selection:text-black">
            <NavBar />
            <main>
              <ProductDetails />
            </main>
            <Footer />
          </div>
        } />
        <Route path='/cart' element={<CartPage />} />
        <Route path="*" element={
          <div className="bg-neutral-950 min-h-screen text-white flex items-center justify-center text-sm uppercase tracking-widest font-bold">
            Strona nie istnieje
          </div>
        } />
      </Routes>
    </>
  )
}

export default App

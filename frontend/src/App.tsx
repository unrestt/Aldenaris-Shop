import './App.css'
import {Routes, Route} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import MainLayout from './layout/MainLayout'

function App() {


  return (
    <>
      <Toaster position='top-center' />
      <Routes>
        <Route path='/' element={<MainLayout/>} />
        {/* <Route path='/product/:id' element={<ProductDetails />} /> */}

        <Route path="*" element={<div>Strona nie istnieje</div>} />
      </Routes>
    </>
  )
}

export default App

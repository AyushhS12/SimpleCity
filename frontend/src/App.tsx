import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { Toaster } from 'react-hot-toast'
import World from './pages/World'
import { PlayerContextProvider } from './context/PlayerContextProvider'

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<PlayerContextProvider>{<Auth />}</PlayerContextProvider>} />
          <Route path='/world' element={<PlayerContextProvider>{<World />}</PlayerContextProvider>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

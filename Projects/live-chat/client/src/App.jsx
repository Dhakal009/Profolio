import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/SignUp.jsx'
import Chat from './pages/Chat.jsx'



function App() {
  const {token} = useContext(AuthContext)
  return(
      <BrowserRouter>
        <Routes>
          <Route path='/' element={token ? <Navigate to="/chat"/> : <Navigate to="/login"/>}/>
          <Route path='/login' element={token ? <Navigate to="/chat"/> : <Login/>}/>
          <Route path='/register' element={token ? <Navigate to="/chat"/> : <Register/>}/>
          <Route path='/chat' element={token ? <Chat/> : <Navigate to="/login"/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App

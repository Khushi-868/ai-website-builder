import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Guestlayout, Authlayout } from './pages/Layout'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import BuilderPage from './pages/BuilderPage'
import PreviewPage from './pages/PreviewPage'
import PublishPage from './pages/PublishPage'
function App() {
  return (
    <Routes>
      <Route element={<Guestlayout />}>
        <Route path='/login' element={<AuthPage mode="login" />} />
        <Route path='/register' element={<AuthPage mode="register" />} />
      </Route>

      {/*Protected Routes*/}
      <Route element={<Authlayout />}>
        <Route path='/' element={<HomePage  />} />
        <Route path='/builder/:id' element={<BuilderPage />} />
        <Route path='/preview/:id' element={<PreviewPage />} />
      </Route>

    </Routes>

  )
}

export default App
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Blog from './Pages/Blog'
import Layout from './Pages/Admin/Layout'
import Dashboard from './Pages/Admin/Dashboard'
import AddBlog from './Pages/Admin/AddBlog'
import ListBlog from './Pages/Admin/ListBlog'
import Comment from './Pages/Admin/Comment'
import Login from './Components/Admin/Login'
import 'quill/dist/quill.snow.css'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './Context/AppContext.jsx'

const App = () => {

  const { token } = useAppContext();

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='/admin' element={token ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path='addblog' element={<AddBlog />} />
          <Route path='listblog' element={<ListBlog />} />
          <Route path='comments' element={<Comment />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App

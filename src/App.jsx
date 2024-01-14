import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog/Blog'
import blogService from './services/blogs'
import loginSerice from './services/login'
import CreateBlogForm from './components/CreateBlog/CreateBlog'
import Message from './components/Message'
import Toggable from './components/Togglable'

const App = () => {
  const [user, setUser ] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)

  const createBlogFormRef = useRef()

  useEffect(() => {
    const fetchData = async () => {
      const blgosResponse = await blogService.getAll()
      updateBlogs(blgosResponse)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loginData = await loginSerice.login({ username, password })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(loginData)
      )
      setUsername('')
      setPassword('')
      setUser(loginData)
      blogService.setToken(loginData.token)
    } catch(err) {
      createMessage({ type: 'error', text: err.response.data.error })
    }
  }

  const createBlog = async (newBlog) => {
    try {
      const response = await blogService.create(newBlog)
      updateBlogs([...blogs, response])
      createMessage({ type: 'success', text: `A new blog ${response.title} by ${response.author} created` })
      createBlogFormRef.current.toggleVisibility()
    } catch (err) {
      createMessage({ type: 'error', text: err.response.data.message })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const createMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), 5000)
  }

  const handdleLike = async (id) => {
    try {
      const response = await blogService.like(id)
      const newBlogs = blogs.map(blog => blog.id === response.id ? response : blog)
      updateBlogs(newBlogs)
    } catch (err) {
      createMessage({ type: 'error', text: 'could not like' })
    }
  }

  const handleRemove = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      createMessage({ type: 'success', text: 'Blog deleted successfully' })
    } catch(err) {
      createMessage({ type: 'error', text: err.response.data.error })
    }
  }

  const updateBlogs = (newBlogs) => {
    newBlogs.sort((a,b) => b.likes - a.likes )
    setBlogs(newBlogs)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        { message && <Message text={message.text} type={message.type} /> }
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      { message && <Message text={message.text} type={message.type} /> }
      <div>{user.name} logged in</div> <button onClick={handleLogout}>logout</button>
      <br />
      <br />
      <Toggable showLabel="new blog" ref={createBlogFormRef} >
        <CreateBlogForm createBlog={createBlog} />
      </Toggable>
      <br />
      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} like={handdleLike} remove={handleRemove} loggedUsername={user.username}/>
      )}
    </div>
  )
}

export default App
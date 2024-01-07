import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginSerice from './services/login'
import CreateBlogForm from './components/CreateBlog'
import Message from './components/Message'

const App = () => {
  const [user, setUser ] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const blgosResponse = await blogService.getAll()
      setBlogs(blgosResponse)
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
      const loginData = await loginSerice.login({username, password})
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(loginData)
      )
      setUsername('')
      setPassword('')
      setUser(loginData)
      blogService.setToken(loginData.token)
    } catch(err) {
      createMessage({type: 'error', text: err.response.data.error})
    }
  }

  const createBlog = async (newBlog) => {
    try {
      const response = await blogService.create(newBlog)
      setBlogs([...blogs, response])
      createMessage({type: 'success', text: `A new blog ${response.title} by ${response.author} created`})
    } catch (err) {
      createMessage({type: 'error', text: err.response.data.message})
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
          <button type="submit">login</button>
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
      <CreateBlogForm createBlog={createBlog} />
      <br />
      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
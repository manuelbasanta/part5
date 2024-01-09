import Toggable from './Togglable'

const Blog = ({ blog, like, remove, loggedUsername }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleRemove = (id) => {
    if(confirm('Are you shure you want to remove the blog?')) {
      remove(id)
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <Toggable showLabel="view" hideLabel="hide" >
        {blog.url}
        <br />
        {blog.likes} <button onClick={() => like(blog.id)}>like</button>
        <br />
        {blog.user && blog.user.name}
        <br />
        {loggedUsername === blog.user.username && <><button onClick={() => handleRemove(blog.id)}>remove</button>  <br /></>}

      </Toggable>
    </div>
  )
}

export default Blog
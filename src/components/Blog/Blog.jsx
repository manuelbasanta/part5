import Toggable from '../Togglable'

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
        <div>{blog.url}</div>
        <div>{blog.likes}</div> <button onClick={() => like(blog.id)}>like</button>
        {blog.user && <div>{blog.user.name}</div>}
        {loggedUsername === blog.user.username && <><button onClick={() => handleRemove(blog.id)}>remove</button>  <br /></>}
      </Toggable>
    </div>
  )
}

export default Blog
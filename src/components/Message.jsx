import './message.css'

const Message = ({ type, text }) => {
  return (
    <div className={`message ${type === 'error' ? 'error' : 'success'}`}>
      {text}
    </div>
  )
}

export default Message
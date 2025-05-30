import robot from '../assets/robot.png';
import human from '../assets/human-icon.png';

const ChatHistory = ({messages}) => {

  const uiMessage = (messages) => {
    if(messages && messages.length > 0) {
    return (
        <ul className="chat-history">
          { messages.map((message, index) => (
              <li key={index}>
                <span>
                  <img src={message.sender === 'server' ? robot : human } alt="robot" /> 
                  {message.text}
                  <br/>
                  <strong>{message.time}</strong>
                </span>
                
              </li>
            ))}
        </ul>
        )
    } else {
      return null
    }
  }
  
    return (
      <>
        {uiMessage(messages)}
      </>
)}

export default ChatHistory
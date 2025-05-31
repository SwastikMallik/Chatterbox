import { memo } from 'react';
import robot from '../assets/robot.png';
import human from '../assets/human-icon.png';

const ChatHistory = memo(({messages}) => {
console.log(messages, "messages")
  const uiMessage = (messages) => {
    if(messages && messages.length > 0) {
    return (
        <ul className="chat-history">
          { messages.map((message, index) => (
              <li key={index} className={message.sender}>
                <span>
                  <img className="avatar" src={message.sender === 'server' ? robot : human } alt="robot" /> 
                  <p>{message.text}</p>
                  {message.file && message.file.type.startsWith('image/') && (
                    <img width="32px" src={message.file.data} alt={message.file.name} className="chat-image" />
                  )}
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
)})

export default ChatHistory
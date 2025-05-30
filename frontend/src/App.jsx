// App.jsx
import { useEffect, useRef, useState } from 'react';
import ChatHistory from './components/ChatHistory';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import socket from './socket';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const [debouncedValue, setDebouncedValue] = useState(input);

  const getCurrentTimeIn24Format = () => {
    const now = new Date();
    const formattedTime = new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(now);
    return formattedTime
  }

  useEffect(() => {
    console.log(getCurrentTimeIn24Format)
    const handler = setTimeout(() => {
      setDebouncedValue(input);
    }, 200);

    return () => clearTimeout(handler);
  }, [input]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: 'server', time: getCurrentTimeIn24Format() },
      ]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleOnChange = (e) => setInput(e.target.value);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!debouncedValue.trim()) {
      toast('Please add some text to send a message');
      inputRef.current.focus();
      return;
    }

    socket.emit('message', debouncedValue);
    setMessages((prev) => [
      ...prev,
      { text: debouncedValue, sender: 'client', time: getCurrentTimeIn24Format() },
    ]);
    setInput('');
  };

  return (
    <div className="chat-box">
      <h2>Welcome to ChatterBox</h2>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        />
      <ChatHistory messages={messages}/>
      <form className="chat-room" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          ref={inputRef}
          onChange={handleOnChange}
          placeholder='Say Hello'
        />
        <button>Send</button>
      </form>
    </div>
  );
}

export default App;

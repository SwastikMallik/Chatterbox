// App.jsx
import { useEffect, useRef, useState } from 'react';
import ChatHistory from './components/ChatHistory';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import socket from './socket';
import attachment from './assets/attachment.png'
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const [debouncedValue, setDebouncedValue] = useState(input);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [ validationError, setValidationError ] = useState({});

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
    const handler = setTimeout(() => {
      setDebouncedValue(input);
    }, 200);

    return () => clearTimeout(handler);
  }, [input]);

  useEffect(() => {
    socket.on('message', ({success, message, error, data}) => {
      console.log(success, "client response")
      console.log(error, "client response error")
      if(success){
        setMessages((prevMessages) => [
        ...prevMessages,
        data
      ])
      } else {
        toast.error(message)
        setValidationError(error)
        console.log("Error In")
      }
    })

    return () => {
      socket.off('message');
    };
  }, [])

  console.log(validationError, "Print error")

  //Triggered the input type file (hidden), when user clicks on attachment image
  const handleUploadClick = () => {
    console.log('in')
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Opens file dialog
    }
  };
  // Chat input handler
  const handleOnChange = (e) => {
    setInput(e.target.value); 
    setValidationError({})
  }

  // Chat input file handler
  const handleFileChange = (e) => {
    setValidationError({})
    const afile = e.target.files[0];

    if (!afile) return;

    // Validate file type
    if (!afile.type.startsWith('image/')) {
      e.target.value = '';
      toast.error('Only image files are allowed');
      return;
    }

    // Validate file size (1MB = 1,000,000 bytes)
    if (afile.size > 1000000) {
      e.target.value = '';
      toast.error('File size should be less than 1MB');
      return;
    }

    // If valid
    setFile(afile);
    console.log(afile, "File accepted");
  };


  //Form Submit
  const sendMessage = (e) => {
  e.preventDefault();

  if (!debouncedValue.trim() && !file) {
    toast('Please add some text to send a message');
    //inputRef.current.focus();
    return;
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const obj = {
        text: debouncedValue,
        file: {
          name: file.name,
          type: file.type,
          data: reader.result, // base64
        },
        sender: 'client',
        time: getCurrentTimeIn24Format(),
      };

      socket.emit('message', obj);
      setMessages((prev) => [...prev, obj]);
      setInput('');
      setFile(null);
      fileInputRef.current.value = '';
    };

    reader.readAsDataURL(file); // use readAsDataURL for base64 images
  } else {
    const obj = {
      text: debouncedValue,
      sender: 'client',
      time: getCurrentTimeIn24Format(),
    };

    socket.emit('message', obj);
    setMessages((prev) => [...prev, obj]);
    setInput('');
    fileInputRef.current.value = '';
  }
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
        <span onClick={handleUploadClick}><img src={attachment} alt="attachment"/></span>
        <input 
          type="file"
          accept="image/*" 
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <input
          type="text"
          value={input}
          ref={inputRef}
          onChange={handleOnChange}
          placeholder='Say Hello'
        />

        <button type="submit">Send</button>
      </form>
      { validationError.text && <p>{validationError.text}</p> }
    </div>
  );
}

export default App;

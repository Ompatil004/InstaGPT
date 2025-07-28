
import './App.css';
import "./Sidebar.jsx";
import "./ChatWindow.jsx";
import "./Chat.jsx";
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';

function App() {
  

  return (
    
      <div className="main">
        <Sidebar/>
        <ChatWindow/>

      </div>
    
  )
}

export default App

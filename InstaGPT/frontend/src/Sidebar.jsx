import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const getAllThreads = async () => {
        try {
            const response = await fetch("/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setIsMobileOpen(false);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
            setIsMobileOpen(false);
        } catch(err) {
            console.log(err);
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }

    return (
        <section className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <button onClick={createNewChat}>
                    <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
                    <span><i className="fa-solid fa-pen-to-square"></i></span>
                </button>
                <button 
                    className="hamburger-btn"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    style={{display: 'none', border: 'none', background: 'transparent', padding: '0'}}
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} 
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>
 
            <div className="sign">
                <p>Om Patil ❤️</p>
            </div>
        </section>
    )
}

export default Sidebar;
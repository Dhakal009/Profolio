import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { io } from "socket.io-client";


const socket = io("http://localhost:5000",{
  withCredentials:true,
  transports:["websocket"],
});

function Chat() {
  const { user, token, logout } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState([])
  const messagesEndRef = useRef(null);
  const [typingUser, setTypingUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({}); 
  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    if (token) {
      getUsers();
    }
  }, [token]);

  useEffect(() => {
    if(conversation?._id && token){
      getMessages(conversation._id)
    }
  }, [conversation,token])
  
  useEffect(()=>{
    socket.connect();

    return () =>{
      socket.disconnect();
    }
  },[])

  useEffect(()=>{
    if(!user?._id) return;

    const identify = () =>{
      socket.emit("userConnected",user._id)
    }

    if(socket.connected){
      identify();
    }

    socket.on("connect", identify);
    
    return () =>{
      socket.off("connect", identify);
    }

  },[user])


  useEffect(()=>{
    socket.on("onlineUsers",(users)=>{
      console.log("Online users updated:",users);
      setOnlineUsers(users)
    })

    return () =>{
      socket.off("onlineUsers");
    }
  },[]);

  //new message

  useEffect(()=>{
    socket.on("newMessage",(newMsg)=>{
      console.log("Recieved new message via socket:",newMsg);
      if(newMsg.conversationId === conversation?._id){
        setMessages(prev => [...prev,newMsg])
      }

      const senderId = newMsg.sender?._id || newMsg.sender;
      if(senderId !== user?._id){
        setLastMessages(prev => ({
          ...prev,
          [senderId]: newMsg.text
      }));

      if(newMsg.conversationId !== conversation?._id){
        setUnreadCounts(prev => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1
        }));
      }
    }
    })

    return () =>{
      socket.off("newMessage");
    }
    
  },[conversation,user]);


  useEffect(()=>{

    messagesEndRef.current?.scrollIntoView({behavior:"smooth"})

  },[messages])
  const getUsers = async () => {
    try {
      const response = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  //typing indication

  useEffect(()=>{
    socket.on("typing",(data)=>{
      if(data.conversationId === conversation?._id){
        setTypingUser(data.name);

        clearTimeout(window.typingTimeout);
        window.typingTimeout = setTimeout(()=>{
          setTypingUser(null);
        },2000)
      }
    })

    return () =>{
      socket.off("typing");
    }
  },[conversation])

  const createConversation = async (userId) =>{
    try{
      const response = await api.post(
      "/conversations/",
      {
        userId: userId 
      },
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )

    setConversation(response.data.conversation);

    socket.emit("joinRoom",response.data.conversation._id);
    
    }
    catch(err){
      console.error(err)
    }

  }

  const getMessages = async (conversationId)=>{
    try{
      const response = await api.get(
        `/messages/${conversationId}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      console.log("Fetched messages:", response.data)

    setMessages(response.data.message || [])
    }
    catch(err){
      console.error(err);
      setMessages([])
    }
  }


  //send message
  const sendMessage = async (e) =>{
      e.preventDefault()
      try{
          if(!newMessage.trim() || !conversation?._id) return;
          
            const response = await api.post(
              "/messages/",
              {
                conversationId: conversation._id,
                text: newMessage
              },
              {
                headers:{
                  Authorization:`Bearer ${token}`
                }
              }
            )

            setMessages(prev => [...prev,response.data.newMessage])
            setNewMessage("")

            setLastMessages(prev => ({
              ...prev,
              [selectedUser._id]: response.data.newMessage.text
            }));

            

            socket.emit("sendMessage",{
              ...response.data.newMessage,
              conversationId: conversation._id
            })
          
      }
      catch(err){
        console.error(err)
      }

  }

  const handleTyping = (e) =>{
    setNewMessage(e.target.value);
    if(!conversation?._id) return;
    socket.emit("typing",{
      conversationId: conversation._id,
      userId:user._id,
      name:user.name
    })
  }


  return (
    <div className="h-screen bg-zinc-950 text-white flex">

      <aside className="w-80 border-r border-zinc-800 bg-zinc-900 flex flex-col">

        {/* Header */}
        <div className="p-5 border-b border-zinc-800">

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-xl font-semibold">
                Live Chat
              </h1>

              <p className="text-sm text-zinc-400 mt-1">
                {user?.name}
              </p>
            </div>

            {/* Current user avatar */}
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
             {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user?.name.charAt(0).toUpperCase()
              )}

            </div>
            <button
              onClick={logout}
              className="px-3 py-2 rounded bg-zinc-800 text-sm text-zinc-200 cursor-pointer hover:bg-red-400 transition transform hover:scale-105"
            >
              Logout
            </button>

          </div>

        </div>

        <div className="p-4">

          <input
            type="text"
            placeholder="Search users..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 placeholder:text-zinc-500"
          />

        </div>


        <div className="flex-1 overflow-y-auto px-2">

          {users.map((item) => (

            <button
              key={item._id}
              onClick={() => {
                setSelectedUser(item);
                createConversation(item._id);
                setUnreadCounts((prev) => ({ ...prev, [item._id]: 0 }));
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${
                selectedUser?._id === item._id
                  ? "bg-zinc-800"
                  : "hover:bg-zinc-800/70"
              }`}
            >

              <div className="relative">

                <div className="w-11 h-11 rounded-full bg-zinc-700 flex items-center justify-center font-semibold">
                  {item.name.charAt(0).toUpperCase()}
                </div>

                {/* Online indicator */}
                {onlineUsers.includes(item._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full" />
                )}

              </div>


              <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium truncate">{item.name}</h3>
                {unreadCounts[item._id] > 0 && (
                  <span className="shrink-0 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                    {unreadCounts[item._id]}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 truncate">
                {lastMessages[item._id] || item.email}
              </p>
            </div>

            </button>

          ))}

        </div>

      </aside>


      {/* ================= CHAT AREA ================= */}

      <main className="flex-1 flex flex-col">

        {selectedUser ? (

          <>

            {/* Chat header */}
            <header className="h-18 px-6 border-b border-zinc-800 bg-zinc-900 flex items-center">

              <div className="flex items-center gap-3">

                <div className="relative">

                  <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
                    {selectedUser.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  {onlineUsers.includes(selectedUser._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full" />
                  )}

                </div>


                <div>

                  <h2 className="font-semibold">
                    {selectedUser.name}
                  </h2>

                  <p className="text-xs text-zinc-500">
                    {onlineUsers.includes(selectedUser._id)
                      ? "Online"
                      : "Offline"}
                  </p>

                </div>

              </div>

            </header>


            {/* Messages area */}
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center bg-zinc-950">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-900 flex items-center justify-center text-2xl">
                    💬
                  </div>
                  <h3 className="text-lg font-medium">Start a conversation</h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    Send a message to {selectedUser.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-zinc-950">
                {messages.map((msg) => {
                  const senderId = msg.sender?._id || msg.sender;
                  const isMine = senderId === user?._id;

                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isMine ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-200"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <span className="block mt-1 text-[10px] opacity-60 text-right">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
            



            {/* Message input */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900">

              <div className="flex flex-col gap-3">
                {typingUser && (
                  <p className="text-xs text-zinc-400 italic mb-2">
                    {typingUser} is typing...
                  </p>
                )}
                <form onSubmit={sendMessage} className="flex-1 flex gap-3">
                  <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder={`Message ${selectedUser.name}...`}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 placeholder:text-zinc-500"
                />

                <button
                  type="submit"
                  className="px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-medium"
                >
                  Send
                </button>
                </form>

              </div>

            </div>

          </>

        ) : (

          /* Empty state */
          <div className="flex-1 flex items-center justify-center bg-zinc-950">

            <div className="text-center">

              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-zinc-900 flex items-center justify-center text-3xl">
                💬
              </div>

              <h2 className="text-2xl font-semibold">
                Welcome to Live Chat
              </h2>

              <p className="text-zinc-500 mt-2">
                Select a user to start chatting
              </p>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default Chat;
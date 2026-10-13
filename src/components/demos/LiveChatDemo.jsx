import { useState, useEffect, useRef } from 'react';

const INITIAL_USERS = [
  {
    _id: 'u-aarav',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@devstudio.io',
    online: true,
    role: 'Frontend Architect',
  },
  {
    _id: 'u-priya',
    name: 'Priya Adhikari',
    email: 'priya@productlab.np',
    online: true,
    role: 'Product Designer',
  },
  {
    _id: 'u-rohan',
    name: 'Rohan Thapa',
    email: 'rohan.thapa@cloudops.dev',
    online: true,
    role: 'Backend Engineer',
  },
  {
    _id: 'u-sita',
    name: 'Sita Gurung',
    email: 'sita@qa-systems.io',
    online: false,
    role: 'QA Lead',
  },
];

const INITIAL_MESSAGES = {
  'u-aarav': [
    {
      _id: 'm-1',
      sender: 'u-aarav',
      text: 'Hey Bikash! Are we ready to deploy the Socket.io live chat service?',
      createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    },
    {
      _id: 'm-2',
      sender: 'me',
      text: 'Yes! JWT auth, room joins, and typing indicators are all wired up.',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      _id: 'm-3',
      sender: 'u-aarav',
      text: 'Awesome, send me a message here to test real-time delivery!',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
  ],
  'u-priya': [
    {
      _id: 'm-4',
      sender: 'u-priya',
      text: 'Hi! I just shared the updated dark-mode chat tokens in Figma.',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ],
  'u-rohan': [
    {
      _id: 'm-5',
      sender: 'u-rohan',
      text: 'MongoDB replica set and message indexing look super fast (<8ms).',
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
  ],
  'u-sita': [],
};

const AUTO_REPLIES = [
  'Got your message in real time via WebSocket! 🚀',
  'Looks great! The latency and typing indicator feel super snappy.',
  'Awesome, I will review the PR and merge it into master shortly.',
  'Sounds like a solid plan! Let us sync up in 10 minutes.',
];

export default function LiveChatDemo() {
  const [authView, setAuthView] = useState('chat'); // 'login' | 'register' | 'chat'
  const [user, setUser] = useState({
    _id: 'me',
    name: 'Bikash Dhakal',
    email: 'bikashdhakal546@gmail.com',
  });

  // Login / Register state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Chat state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(INITIAL_USERS[0]);
  const [messagesByUser, setMessagesByUser] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({ 'u-priya': 1 });
  const messagesEndRef = useRef(null);

  const currentMessages = selectedUser
    ? messagesByUser[selectedUser._id] || []
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, selectedUser]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const displayName = formEmail
      ? formEmail.split('@')[0].replace(/[._-]/g, ' ')
      : 'Bikash Dhakal';
    setUser({
      _id: 'me',
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email: formEmail || 'bikashdhakal546@gmail.com',
    });
    setAuthView('chat');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setUser({
      _id: 'me',
      name: formName.trim() || 'Bikash Dhakal',
      email: formEmail.trim() || 'bikashdhakal546@gmail.com',
    });
    setAuthView('chat');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const targetId = selectedUser._id;
    const targetName = selectedUser.name;
    const outgoing = {
      _id: `msg-${Date.now()}`,
      sender: 'me',
      text: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessagesByUser((prev) => ({
      ...prev,
      [targetId]: [...(prev[targetId] || []), outgoing],
    }));
    setNewMessage('');

    // Simulate real-time Socket.io typing + reply from the recipient
    setTimeout(() => {
      setTypingUser(targetName);
    }, 450);

    setTimeout(() => {
      setTypingUser(null);
      const replyText =
        AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const incoming = {
        _id: `msg-${Date.now() + 1}`,
        sender: targetId,
        text: replyText,
        createdAt: new Date().toISOString(),
      };
      setMessagesByUser((prev) => ({
        ...prev,
        [targetId]: [...(prev[targetId] || []), incoming],
      }));
    }, 1800);
  };

  const filteredUsers = INITIAL_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authView === 'login') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950 px-4">
        <form
          onSubmit={handleLoginSubmit}
          className="flex flex-col gap-4 w-full max-w-sm bg-zinc-900 border border-zinc-800 p-7 rounded-2xl shadow-2xl text-white"
        >
          <div className="text-center mb-2">
            <span className="inline-block rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400 mb-2">
              Live Chat Auth
            </span>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-sm text-zinc-400 mt-1">Sign in to your account</p>
          </div>

          <input
            type="email"
            required
            placeholder="Email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            required
            placeholder="Password"
            value={formPassword}
            onChange={(e) => setFormPassword(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl p-3 text-sm transition cursor-pointer mt-1"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setUser({
                _id: 'me',
                name: 'Bikash Dhakal',
                email: 'bikashdhakal546@gmail.com',
              });
              setAuthView('chat');
            }}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-medium rounded-xl p-2.5 text-xs transition cursor-pointer"
          >
            ⚡ Quick Demo Login as Bikash
          </button>

          <p className="text-sm text-zinc-400 text-center mt-2">
            Don&apos;t have an account?
            <button
              type="button"
              onClick={() => setAuthView('register')}
              className="text-indigo-400 font-semibold hover:underline ml-1 cursor-pointer"
            >
              Register
            </button>
          </p>
        </form>
      </div>
    );
  }

  if (authView === 'register') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <form
          onSubmit={handleRegisterSubmit}
          className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl text-white"
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Create account
            </h1>
            <p className="mt-2 text-sm text-zinc-400">Sign up to start chatting</p>
          </div>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              required
              placeholder="Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="rounded-xl border border-zinc-700 bg-zinc-800 p-3.5 text-sm text-white outline-none focus:border-indigo-500"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="rounded-xl border border-zinc-700 bg-zinc-800 p-3.5 text-sm text-white outline-none focus:border-indigo-500"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3.5 pr-14 text-sm text-white outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400 hover:text-white cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="submit"
              className="mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 p-3.5 font-semibold text-white transition cursor-pointer"
            >
              Register
            </button>

            <p className="text-sm text-zinc-400 text-center mt-1">
              Already have an account?
              <button
                type="button"
                onClick={() => setAuthView('login')}
                className="text-indigo-400 font-semibold hover:underline ml-1 cursor-pointer"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-900 flex flex-col shrink-0 max-h-[38vh] md:max-h-none">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-semibold shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'B'}
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-semibold truncate">Live Chat</h1>
              <p className="text-xs text-zinc-400 truncate">{user?.name}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAuthView('login')}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-200 cursor-pointer hover:bg-red-500/80 hover:text-white transition"
          >
            Logout
          </button>
        </div>

        <div className="p-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3.5 py-2 text-sm text-white outline-none focus:border-indigo-500 placeholder:text-zinc-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
          {filteredUsers.map((item) => {
            const userMsgs = messagesByUser[item._id] || [];
            const lastMsg =
              userMsgs.length > 0
                ? userMsgs[userMsgs.length - 1].text
                : item.email;

            return (
              <button
                key={item._id}
                type="button"
                onClick={() => {
                  setSelectedUser(item);
                  setUnreadCounts((prev) => ({ ...prev, [item._id]: 0 }));
                }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition cursor-pointer ${
                  selectedUser?._id === item._id
                    ? 'bg-zinc-800'
                    : 'hover:bg-zinc-800/60'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center font-semibold text-sm">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  {item.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-900 rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-medium truncate">{item.name}</h2>
                    {unreadCounts[item._id] > 0 && (
                      <span className="shrink-0 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                        {unreadCounts[item._id]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 truncate">{lastMsg}</p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {selectedUser ? (
          <>
            <header className="h-16 px-6 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  {selectedUser.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-900 rounded-full" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-sm md:text-base">
                    {selectedUser.name}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    {selectedUser.online ? 'Online · Socket Connected' : 'Offline'}
                  </p>
                </div>
              </div>
              <span className="text-xs text-zinc-400 hidden sm:inline">
                {selectedUser.role}
              </span>
            </header>

            {currentMessages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center bg-zinc-950 p-6">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-zinc-900 flex items-center justify-center text-2xl">
                    💬
                  </div>
                  <h3 className="text-base font-medium">Start a conversation</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Send a message to {selectedUser.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-3 bg-zinc-950">
                {currentMessages.map((msg) => {
                  const isMine = msg.sender === 'me';
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          isMine
                            ? 'bg-indigo-600 text-white'
                            : 'bg-zinc-800 text-zinc-100'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <span className="block mt-1 text-[10px] opacity-65 text-right">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}

            <div className="p-4 border-t border-zinc-800 bg-zinc-900 shrink-0">
              {typingUser && (
                <p className="text-xs text-indigo-400 italic mb-2">
                  {typingUser} is typing...
                </p>
              )}
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${selectedUser.name}...`}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-medium text-sm cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-zinc-950">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-900 flex items-center justify-center text-3xl">
                💬
              </div>
              <h2 className="text-xl font-semibold">Welcome to Live Chat</h2>
              <p className="text-zinc-400 mt-1 text-sm">
                Select a user to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

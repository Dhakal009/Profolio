import React, { useState } from 'react'

function Login({handleLogin}) {

    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')

    const loginHandler = (e)=>{
        e.preventDefault();
        handleLogin(email,password);
    
        
        setemail('')
        setpassword('')
    }

  return (
    <>
        <div className="min-h-screen w-screen flex items-center justify-center bg-[#1C1C1C] px-4">

        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#242424] p-8 shadow-2xl">

            {/* Header */}
            <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white">
                Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-400">
                Sign in to continue to your dashboard
            </p>
            </div>

            {/* Form */}
            <form
            onSubmit={(e) => {
                loginHandler(e)
            }}
            className="flex flex-col"
            >

            {/* Email */}
            <input
                value={email}
                onChange={(e) => {
                setemail(e.target.value)
                }}
                required
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-white/10 bg-[#1C1C1C] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"
            />

            {/* Password */}
            <input
                value={password}
                onChange={(e) => {
                setpassword(e.target.value)
                }}
                required
                type="password"
                placeholder="Enter your password"
                className="mt-4 w-full rounded-xl border border-white/10 bg-[#1C1C1C] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"
            />

            {/* Login Button */}
            <button
                className="mt-6 rounded-xl bg-emerald-500 py-3 px-5 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-pointer"
            >
                Login
            </button>

            </form>
        </div>

        </div>


    </>
  )
}

export default Login    
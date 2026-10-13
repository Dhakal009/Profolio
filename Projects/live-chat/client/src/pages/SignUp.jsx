import {useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

function Register() {
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [showPassword,setShowPassword] = useState(false)
    const {register} = useContext(AuthContext)
    const navigate = useNavigate();

    const handleRegister = async (e)=>{
        e.preventDefault();
        const success = await register(name,email,password);
        if(success){
            navigate("/chat")
        }
    }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4'>
        <form onSubmit={handleRegister} className='w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl'>
            <div className='mb-6 text-center'>
                <h1 className='text-3xl font-semibold tracking-tight text-slate-800'>Create account</h1>
                <p className='mt-2 text-sm text-slate-500'>Sign up to start chatting</p>
            </div>
            <div className='flex flex-col gap-4'>
                <input type="text" placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)} className='rounded-lg border border-slate-300 bg-white p-3.5 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'/>
                <input type="email" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} className='rounded-lg border border-slate-300 bg-white p-3.5 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'/>
                <div className='relative'>
                    <input type={showPassword ? 'text' : 'password'} placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} className='w-full rounded-lg border border-slate-300 bg-white p-3.5 pr-12 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'/>
                    <button type='button' onClick={()=>setShowPassword((prev)=>!prev)} className='absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600 hover:text-slate-800'>
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
                <div className='relative'>
                    <input type={showPassword ? 'text' : 'password'} placeholder='Confirm Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className='w-full rounded-lg border border-slate-300 bg-white p-3.5 pr-12 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'/>
                    <button type='button' onClick={()=>setShowPassword((prev)=>!prev)} className='absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600 hover:text-slate-800'>
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>

                <button type='submit' className='mt-2 rounded-lg bg-red-500 p-3.5 font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]'>Register</button>
            </div>
        </form>

    </div>
  );
}

export default Register;
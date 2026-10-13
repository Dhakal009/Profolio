import {useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

function Login() {

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const {login} = useContext(AuthContext)
    const navigate = useNavigate();

    const handleLogin = async (e)=>{
        e.preventDefault();
        const success = await login(email,password);
        if(success){
            navigate("/chat")
        }else{
            alert("Invalid email or password")
        }
    }
  return (
    <div className='flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
        <form 
            onSubmit={handleLogin} 
            className='flex flex-col gap-4 w-80 bg-white p-6 rounded-lg shadow-lg'
        >
            <div className='text-center mb-4'>
                <h1 className='text-2xl font-bold text-gray-800'>Welcome</h1>
                <p className='text-sm text-gray-500 mt-1'>Sign in to your account</p>
            </div>

            <div>
                <input 
                    type="email" 
                    placeholder='Email' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className='w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
            </div>

            <div>
                <input 
                    type="password" 
                    placeholder='Password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className='w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
            </div>

            <button 
                type='submit' 
                className='bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg p-3 text-sm transition duration-200 mt-2'
            >
                Login
            </button>

            <p className='text-sm text-gray-600 text-center mt-4'>
                Don't have an account? 
                <a 
                    href="/register" 
                    className='text-blue-500 font-semibold hover:underline ml-1'
                >
                    Register
                </a>
            </p>
        </form>
    </div>
  );
}

export default Login
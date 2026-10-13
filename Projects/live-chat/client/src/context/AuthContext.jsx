import { createContext, useEffect, useState } from "react";
import api from "../services/api.js";


export const AuthContext = createContext();


function AuthProvider({children}){
    const [user, setuser] = useState(null)
    const [token, settoken] = useState(
        localStorage.getItem("token")
    );


    useEffect(() => {
      if(token){
        getCurrentUser();
      }
    }, [token])


    const getCurrentUser = async ()=>{
        try{
            const response = await api.get("/auth/me",{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });

            setuser(response.data.user)

        }catch(err){
            console.error("GET CURRENT USER ERROR:", err)
            // logout();
        }
    }

    const login = async (email,password)=>{
        try{

            const response = await api.post("/auth/login",{email,password});
            localStorage.setItem("token",response.data.token);
            settoken(response.data.token);
            setuser(response.data.user);
            return true;

        }
        catch(err){
            console.error("Login failded",err);
            return false;
        }
    };

    const register = async (name,email,password)=>{
        try{
            const response = await api.post("/auth/register",{name,email,password});
            localStorage.setItem("token",response.data.token);
            settoken(response.data.token);
            setuser(response.data.user);
            return true;
        }
        catch(err){
            console.error("Register failded",err);
            return false;
        }
    }

    const logout = ()=>{
        localStorage.removeItem("token");
        settoken(null);
        setuser(null);
    }


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )

    
}


export default AuthProvider;
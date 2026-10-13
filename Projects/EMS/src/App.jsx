import {useEffect,React, useState, useContext} from 'react'
import Login from './assets/components/auth/Login.jsx'
import EmployeeDashboard from './assets/components/dashboard/EmployeeDashboard.jsx'
import AdminDashboard from './assets/components/dashboard/AdminDashboard.jsx'
import { getLocalStorage, setLocalStorage } from './utils/LocalStorage.jsx'
import { AuthContext } from './assets/context/AuthProvider.jsx'
function App() {

  useEffect(() => {
    setLocalStorage();
    getLocalStorage();
  },)

  const [user, setUser] = useState(null)
  const [loggedInUserData, setLoggedInUserData] = useState(null)
  const authData = useContext(AuthContext)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')

    if(loggedInUser){
      const userData = JSON.parse(loggedInUser);
      setUser(userData.role)
      setLoggedInUserData(userData.data)
    }
  }, [loggedInUserData])
  
  

  const handleLogin = (email,password) =>{
    if(email == 'admin@me.com' && password == '123'){
      setUser('admin')
      localStorage.setItem('loggedInUser',JSON.stringify({role:'admin'}))
    }else if(authData ){
      const employee = authData.employees.find((e)=> e.email == email && e.password == password)
      if(employee){
        setUser('employee')
        setLoggedInUserData(employee)
        localStorage.setItem('loggedInUser',JSON.stringify({role:'employee',data:employee}))
      }
    }else{
      console.log('Invalid credential')
    }
  }

  
  return (
    <>
    {!user?<Login  handleLogin = {handleLogin}/>:''}
    {user == 'admin'? <AdminDashboard changeUser={setUser} data={loggedInUserData}/> : (user == 'employee'? <EmployeeDashboard changeUser={setUser} data={loggedInUserData}/> : '')}
  
    </>

  )
}

export default App
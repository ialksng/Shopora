import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()
function UserContext({children}) {
  const { serverUrl } = useContext(authDataContext);
  const [userData, setUserData] = useState(null); 
  const [userLoading, setUserLoading] = useState(true);


  const getCurrentUser = async () => {
    if (!serverUrl) return;
    try {
        let result = await axios.get(serverUrl + "/api/user/getcurrentuser",{withCredentials:true})
        setUserData(result.data)
        console.log(result.data)
      } catch (error) {
          console.log("No user logged in")
          setUserData(null)
      } finally {
        setUserLoading(false)
    }
  }

    useEffect(()=>{
     getCurrentUser()
    },[serverUrl])

    const value = {
      userData,
      setUserData,
      getCurrentUser,
      userLoading
  }
    
   
  return (
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
  )
}

export default UserContext

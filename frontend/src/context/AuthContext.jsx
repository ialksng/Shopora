import React from 'react'
import { createContext, useState } from 'react'
export const authDataContext= createContext(null);
function AuthContext({children}) {
let serverUrl = "https://shopora-i1d1.onrender.com"

    let value = {
       serverUrl
    }
  return (
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
  )
}

export default AuthContext

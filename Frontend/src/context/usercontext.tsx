import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { Checkauthuser, LoginToDB, LogoutDb, SignupToDB  } from "../connector/connection-to-dB"

type User={
    name:string,
    email:string
}

type userType={
    isLogged:boolean,
    user:User | null,
    login: (email:string, password:string) =>Promise<void>,
    signup: (name:string, email:string, password:string) =>Promise<void>,
    logout: () =>Promise<void>
}


const UserContext = createContext<userType | null>(null)

export const UserProvider = ({children}: {children:ReactNode}) =>{
const [isLogged, setIsLogged]=useState(false)
const [user, setUser]=useState<User | null>(null)

useEffect(() => {
  async function checkuser() {
    try {
      const data = await Checkauthuser()

      setIsLogged(true)
      setUser({
        name: data.name,
        email: data.email,
      })
    } catch (error) {
      console.log(error);
      
      setIsLogged(false)
      setUser(null)
    }
  }

  checkuser()
}, []);
const login = async (email: string, password: string): Promise<void> => {
  try {
    const data = await LoginToDB(email, password)
    console.log("LOGIN DATA:", data);
    setIsLogged(true)

    setUser({
      name: data.name,
      email:data.email
    })

  } catch (error) {
    console.error("Login failed:", error)
    throw error
  }
}
const logout= async ():Promise<void> => {
  console.log("LOGOUT FUNCTION CALLED");
await LogoutDb()
 setIsLogged(false) 
setUser(null)
 

   
}

const signup = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  try {
    const data = await SignupToDB(name, email, password);
    console.log("DEBUG SIGNUP:", data);
    setIsLogged(true);

    setUser({
      name: data.user.name,
      email: data.user.email,
    });
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

const value={
    isLogged,
    user,
    login,
    logout,
    signup
}

return(
   <UserContext.Provider value={value}>{children}</UserContext.Provider> 
)

}



export const useAuth = () => {
   const context=useContext(UserContext)
   if (!context) {
    throw new Error('useAuth should be use inside UserProvider')
   }

   return context
}
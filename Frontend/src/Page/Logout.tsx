import { useEffect} from "react";
import { useAuth } from "../context/usercontext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Logout() {

  const {logout} = useAuth()
const navigate =useNavigate()
useEffect(() =>{
   async function Logoutuser() {
  try {
     toast.loading('logging out...', {id:'notify'})
    await logout()
    toast.success('logging out successful', {id:'notify'})
    navigate('/')
  } catch (error) {
   console.log(error);
   toast.error("error why logging out", {id: 'notify'})
  }
    
  }

  Logoutuser()
},[])
  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#070A1A] text-white">
        <h1 className="text-lg">Logging you out...</h1>
    </div>
  );
}

export default Logout;
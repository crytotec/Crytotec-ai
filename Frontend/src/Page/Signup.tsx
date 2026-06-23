import type { FormEvent } from "react";
import airbot from "../Images/airobot.png";
import { useAuth } from "../context/usercontext";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const toastId = toast.loading("Creating account...");

    try {
      await signup(name, email, password);

      toast.success("Signup successful 🎉", { id: toastId });

      navigate("/chat");
    } catch (error) {
      console.log("SIGNUP ERROR:", error);

      const message =
        error?.message ||
        error?.errors?.[0]?.msg ||
        "Signup failed";

      toast.error(message, { id: toastId });
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#070A1A]">

      <div className="w-full max-w-5xl flex rounded-lg overflow-hidden shadow-lg bg-blue-800">

        {/* LEFT IMAGE */}
        <div className="hidden sm:flex w-1/2 items-center justify-center">
          <img
            src={airbot}
            alt="AI Robot"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 bg-blue-900 p-8 flex flex-col justify-center">

          <form onSubmit={handleSignup} className="w-full">

            <h2 className="text-xl text-white font-bold mb-6">
              Create Account
            </h2>

            {/* NAME */}
            <input
              name="name"
              type="text"
              placeholder="Your name"
              className="w-full mb-4 px-3 py-2 rounded-md bg-white/10 text-white outline-none"
            />

            {/* EMAIL */}
            <input
              name="email"
              type="email"
              placeholder="Your email"
              className="w-full mb-4 px-3 py-2 rounded-md bg-white/10 text-white outline-none"
            />

            {/* PASSWORD */}
            <input
              name="password"
              type="password"
              placeholder="Your password"
              className="w-full mb-6 px-3 py-2 rounded-md bg-white/10 text-white outline-none"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md transition"
            >
              Sign Up
            </button>

          </form>
          <Link to='/'>
         <div className="flex items-center w-full gap-2 justify-center pt-4">
           <FaArrowLeft className="text-yellow-300"/>
            <p className="text-sm text-yellow-300 ">login</p>
           </div>
         </Link>
        </div>
           
      </div>
      
    </div>
  );
}

export default Signup;
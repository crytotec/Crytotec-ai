import type { FormEvent } from "react";
import { useState } from "react";
import { useAuth } from "../context/usercontext";
import airbot from "../Images/airobot.png";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  the auth
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const toastId = toast.loading("Logging in...");

    try {
      setLoading(true);

      await login(email, password);

      toast.success("Login successful 🎉", { id: toastId });

      navigate("/chat");
    } catch (error: any) {
      console.log("LOGIN ERROR:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#070A1A]">
      <div className="w-full max-w-5xl flex rounded-lg overflow-hidden shadow-lg bg-blue-800">

        {/* IMAGE SIDE */}
        <div className="hidden sm:flex w-1/2 items-center justify-center">
          <img src={airbot} alt="AI Robot" className="w-full h-full object-cover" />
        </div>

        {/* FORM SIDE */}
        <div className="w-full md:w-1/2 bg-blue-900 p-8 flex flex-col justify-center">
          <form onSubmit={handleLogin} className="w-full">

            <h2 className="text-xl text-white font-bold mb-6">Sign in</h2>

            {/* EMAIL */}
            <div className="mb-4">
              <label className="text-white text-sm">Email</label>
              <input
                name="email"
                type="email"
                className="w-full px-3 py-2 mt-2 rounded-md bg-white/10 text-white outline-none"
                placeholder="example@gmail.com"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label className="text-white text-sm">Password</label>
              <input
                name="password"
                type="password"
                className="w-full px-3 py-2 mt-2 rounded-md bg-white/10 text-white outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-white transition ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-600"
              }`}
            >
              {loading ? "Please wait..." : "Login"}
            </button>

            {/* LINK */}
            <p className="text-sm text-yellow-300 mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="underline">Create one</Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;
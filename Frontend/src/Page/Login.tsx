import type { FormEvent } from "react";
import { useState } from "react";
import { useAuth } from "../context/usercontext";
import airbot from "../Images/airobot.png";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

function Login() {
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
      const message =
        error?.response?.data?.message || error?.message || "Login failed";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#070A1A] px-4">
      {/* ✅ FIXED: max-w-5xl → max-w-sm (form only, no image on desktop) */}
      <div className="w-full max-w-sm bg-blue-900 rounded-lg shadow-lg p-8">
        <form onSubmit={handleLogin} className="w-full">

          {/* LOGO / ICON */}
          <div className="flex justify-center mb-6">
            <img src={airbot} alt="AI Robot" className="w-16 h-16 object-contain" />
          </div>

          <h2 className="text-xl text-white font-bold mb-6 text-center">Sign in</h2>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-white text-sm">Email</label>
            <input
              name="email"
              type="email"
              className="w-full px-3 py-2 mt-2 rounded-md bg-white/10 text-white outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-white/40"
              placeholder="example@gmail.com"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="text-white text-sm">Password</label>
            <input
              name="password"
              type="password"
              className="w-full px-3 py-2 mt-2 rounded-md bg-white/10 text-white outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-white/40"
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
          <p className="text-sm text-yellow-300 mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="underline">Create one</Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Login;
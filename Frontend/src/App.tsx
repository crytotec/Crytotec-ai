import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/usercontext";
import { RecentProvider } from "./context/Recentcontext";
import Login from "./Page/Login";
import Signup from "./Page/Signup";
import Chat from "./Page/Chat";
import Logout from "./Page/Logout";
import AuthLayout from "./Page/Layouts/AuthLayout";
import AppLayout from "./Page/Layouts/AppLayout";



function App() {
  return (
    <UserProvider>
      <RecentProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout/>}>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            </Route>
            <Route element={<AppLayout/>}>
            <Route path="/chat" element={<Chat />} />
            <Route path="/logout" element={<Logout />} />
            </Route>
        </Routes>
      </BrowserRouter>
      </RecentProvider>
    </UserProvider>
  );
}

export default App;
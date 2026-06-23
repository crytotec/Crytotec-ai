import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const LoginToDB = async (email: string, password: string) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/user/login`,
      { email, password },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) throw error.response?.data || { message: "Network error" };
    throw error;
  }
};

export const LogoutDb = async () => {
  try {
    const res = await axios.post(
      `${BASE_URL}/user/logout`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.log("LOGOUT ERROR:", error);
    throw error;
  }
};

export const SignupToDB = async (name: string, email: string, password: string) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/user/signup`,
      { name, email, password },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("SIGNUP ERROR:", error.response?.data);
    }
    throw error;
  }
};

export const Checkauthuser = async () => {
  const res = await axios.get(`${BASE_URL}/user/auth-status`, {
    withCredentials: true,
  });
  if (res.status !== 200) throw new Error("Unable to authenticate");
  return res.data;
};

export const sendMessage = async (message: string, chatId: string | null) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/chat/user`,
      { message, chatId },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) throw error.response?.data || { message: "Message not received" };
    throw error;
  }
};

export const Recent = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/chat/Recent`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.log("RECENT ERROR:", error);
    throw error;
  }
};

export const getChatMessages = async (chatId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/chat/${chatId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.log("LOAD CHAT ERROR:", error);
    throw error;
  }
};

export const deleteChatById = async (chatId: string) => {
  try {
    const res = await axios.delete(`${BASE_URL}/chat/${chatId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.log("DELETE ERROR:", error);
    throw error;
  }
};
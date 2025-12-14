import {create} from 'zustand';
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://chatapp-q4ke.onrender.com";

export const useAuthStore = create((set,get) => ({
   authUser: null,
   isCheckingAuth:true,
   isSigningUp: false,
   isLoggingIn: false,
   socket: null,
   onlineUsers: [],

   checkAuth: async () => {
    try {
        const res = await axiosInstance.get("/auth/check");
        set({authUser: res.data});
        get().connectSocket();
    } catch (error) {
        console.log("Error is authCheck:", error);
        set({authUser: null});
    } finally{
        set({isCheckingAuth:false });
    }
   },

   signup: async(data) => {
    set({isSigningUp: true});
    try {
        const res= await axiosInstance.post("/auth/signup", data);
        set({ authUser: res.data});
        toast.success("Account Created Successfully!");
        get().connectSocket();
    } catch (error) {
        toast.error(error.response.data.message);
    } finally {
        set({isSigningUp: false});
    }
   },

   login: async(data) => {
    set({ isLoggingIn: true});
    try {
        const res= await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data});
        toast.success("Logged in Successfully")
        get().connectSocket();
    } catch (error) {
        toast.error(error.response.data.message);
    } finally {
        set({ isLoggingIn: false});
    }
   },

   logout: async() => {
    try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null});
        toast.success("logged Out Successfully");
        get().disconnectSocket();
    } catch (error) {
        toast.error("Error logging out");
        console.log("Logout error:", error);
    }
   },

   updateProfile: async (data) => {
    try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({authUser:res.data});
        toast.success("profile Updated Successfully");
    } catch (error) {
        console.log("Error in Update profile:", error);
        toast.error(error.response.data.message);
        
    }
   },

   connectSocket: () => {
  const { authUser, socket } = get();

  if (!authUser || socket?.connected) return;

  const newSocket = io(BASE_URL, {
    withCredentials: true,
    transports: ["websocket"], // polling hata do (Render ke liye best)
  });

  set({ socket: newSocket });

  newSocket.on("connect", () => {
    console.log("Socket connected:", newSocket.id);
  });

  newSocket.on("getOnlineUsers", (userIds) => {
    set({ onlineUsers: userIds });
  });

  newSocket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
},


   disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
   },

}));
import { create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";



export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        set({isSoundEnabled: !get().isSoundEnabled });
    },

    setActiveTab: (tab) => set({activeTab:tab}),
    setSelectedUser: (selectedUser) => set({ selectedUser}),

    getAllContacts: async() => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/message/contacts");
            set({ allContacts: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({
                isUserLoading: false
            });
        }
        },
    getMyChatPartners: async() => {
            set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/message/chats");
            set({ chats: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({
                isUserLoading: false
            });
        }
        },
    
    getMessagesByUserId: async (userId) => {
        set ({ isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
            
        } finally {
            set({ isMessagesLoading: false});
        }

    },

    sendMessage: async(messageData) => {
        const { selectedUser, messages } = get();
        const { authUser} = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._Id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };
          //immediately update
        set({messages: [...messages, optimisticMessage ]});
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({message: messages.concat(res.data)})
        } catch (error) {
            set({messages: messages})
            toast.error(error.response?.data?.message || "Something Went wrong");
        }
    },

    subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");

        notificationSound.currentTime = 0; // reset to start
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
    
    
}))
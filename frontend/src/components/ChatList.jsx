import { useEffect } from "react";
import {useChatStore} from "../store/useChatStore";
import UserLoadingSkeloton from "./UserLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";

function ChatList() {

  const { getMyChatPartners, chats, isUserLoading, setSelectedUser } = useChatStore();

  useEffect(() => {
    getMyChatPartners()
  },[getMyChatPartners]);

  if(isUserLoading) return <UserLoadingSkeloton />;
  if(chats.length === 0) return <NoChatsFound />

  return(
    <>
   {chats.map((chat) => (
      <div key={chat._id} className="bg-cyan-400/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-300/20 transition-colors" 
      onClick={() => setSelectedUser(chat)}
      >
        <div className="flex items-center gap-3">
          {/* TODO: FIX THIS ONLINE STATUS AND MAKE IT WORK WITH SOCKET */}
          <div className="{`avatar online`}">
            <div className="size-12 rounded-full">
              <img src={chat.profilepic || "/avatar.png"} alt={chat.fullName} className="rounded-lg"/>
            </div>
          </div>
          <h4 className="text-slate-100 font-medium truncate">{chat.fullName}</h4>
        </div>
      </div>
   ))}
      </>

  )
  
}

export default ChatList
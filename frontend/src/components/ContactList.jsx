import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UserLoadingSkeloton from "./UserLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {

  const { getAllContacts, allContacts, setSelectedUser, isUserLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if(isUserLoading) return <UserLoadingSkeloton />;

  return(
    <>
   {allContacts.map((contact) => (
      <div key={contact.id} className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors" 
      onClick={() => setSelectedUser(contact)}
      >
        <div className="flex items-center gap-3">
          {/* TODO: FIX THIS ONLINE STATUS AND MAKE IT WORK WITH SOCKET */}
          <div className={`avatar ${onlineUsers.includes(contact._id) ? "online": "offline"}`}>
            <div className="size-12 rounded-full">
              <img src={contact.profilepic || "/avatar.png"} alt={contact.fullName} />
            </div>
          </div>
          <h4 className="text-slate-200 font-medium truncate">{contact.fullName}</h4>
        </div>
      </div>
   ))}
      </>

  )
  
}

export default ContactList
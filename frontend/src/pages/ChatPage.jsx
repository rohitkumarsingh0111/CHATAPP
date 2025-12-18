import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatList from "../components/ChatList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  
  return (
    <div className="relative w-full max-w-6xl h-[700px] md:h-[700px] h-screen">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div
  className={`
    w-80 bg-slate-900/50 backdrop-blur-sm flex flex-col
    ${selectedUser ? "hidden md:flex" : "flex"}
  `}
>

          <ProfileHeader />
          <ActiveTabSwitch/>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatList /> : <ContactList/>}
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex-1 flex flex-col bg-slate-700/20 backdrop-blur-sm ">
        {selectedUser ? <ChatContainer />: <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage;

import { useChat } from "../hooks/useChat";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const HomePage = () => {
  const { selectedUser } = useChat();
  const { authUser } = useAuth();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldShowChat = selectedUser && selectedUser._id !== authUser?._id;

  return (
    <div className="h-screen bg-base-200">
      <div className="h-full md:p-4 p-0">
        <div className="bg-base-100 rounded-lg shadow-cl w-full h-full">
          <div className="flex h-full rounded-lg overflow-hidden">
            <div
              className={`${
                shouldShowChat ? "hidden md:block" : "w-full"
              } md:w-80`}
            >
              <Sidebar />
            </div>
            <div
              className={`${
                !shouldShowChat ? "hidden md:flex" : "flex"
              } flex-1`}
            >
              {!shouldShowChat && isLargeScreen ? (
                <NoChatSelected />
              ) : (
                shouldShowChat && <ChatContainer />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

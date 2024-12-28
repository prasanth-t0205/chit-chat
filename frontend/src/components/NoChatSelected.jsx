import { MessageSquare, Users, Sparkles } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-base-100">
      <div className="max-w-lg text-center space-y-8 p-8 rounded-3xl backdrop-blur-sm">
        <div className="flex justify-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center transform transition-all hover:scale-110">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-warning animate-pulse" />
            </div>
          </div>
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center transform transition-all hover:scale-110">
              <Users className="w-10 h-10 text-secondary" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to Chit-Chat!
          </h1>
          <p className="text-lg text-base-content/70">
            Start connecting with friends and family through instant messaging
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <div className="px-6 py-3 bg-primary/10 rounded-lg border border-primary/20 text-primary">
            Select a chat from the sidebar to begin your conversation
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;

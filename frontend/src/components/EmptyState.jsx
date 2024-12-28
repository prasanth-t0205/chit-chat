import { FaUserClock, FaUserPlus, FaUsers, FaStar } from "react-icons/fa";

const EmptyState = ({ type }) => {
  const states = {
    requests: {
      icon: <FaUserClock className="w-12 h-12 text-primary" />,
      title: "No Friend Requests",
      description: "You don't have any pending friend requests at the moment",
      gradient: "from-primary/20 via-primary/10 to-transparent",
    },
    sent: {
      icon: <FaUserPlus className="w-12 h-12 text-secondary" />,
      title: "No Sent Requests",
      description: "You haven't sent any friend requests yet",
      gradient: "from-secondary/20 via-secondary/10 to-transparent",
    },
    friends: {
      icon: <FaUsers className="w-12 h-12 text-accent" />,
      title: "No Friends Yet",
      description: "Start connecting with others to build your friend list",
      gradient: "from-accent/20 via-accent/10 to-transparent",
    },
  };

  const currentState = states[type];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full max-w-md mx-auto">
        {/* Decorative Background Elements */}
        <div
          className={`absolute inset-0 bg-gradient-radial ${currentState.gradient} blur-3xl opacity-50`}
        />
        <div className="absolute inset-0 bg-base-100/50 backdrop-blur-sm" />

        {/* Main Content */}
        <div className="relative bg-base-100/30 backdrop-blur-md rounded-3xl p-8 border border-base-content/5">
          {/* Icon Container */}
          <div className="relative flex justify-center mb-8">
            <div className="relative">
              {/* Animated Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-20 blur animate-spin-slow" />

              {/* Icon Background */}
              <div className="relative bg-gradient-to-br from-base-100/90 to-base-100/50 p-6 rounded-2xl backdrop-blur-sm border border-base-content/5 shadow-lg">
                {currentState.icon}

                {/* Sparkle Effects */}
                <div className="absolute -top-3 -right-3">
                  <FaStar className="w-6 h-6 text-warning animate-pulse" />
                </div>
                <div className="absolute -bottom-2 -left-2">
                  <FaStar className="w-5 h-5 text-primary animate-pulse delay-150" />
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {currentState.title}
            </h1>
            <p className="text-base-content/70 text-lg leading-relaxed">
              {currentState.description}
            </p>
          </div>

          {/* Decorative Bottom Element */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />
        </div>
      </div>
    </div>
  );
};

export default EmptyState;

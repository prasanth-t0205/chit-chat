import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  MessageSquare,
  Settings,
  User,
  LogOut,
  Search,
  MessageSquareCode,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";

const Navbar = () => {
  const { logout, authUser } = useAuth();
  const { selectedUser } = useChat();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!authUser) return null;

  if (isMobile && selectedUser && selectedUser._id !== authUser._id) {
    return null;
  }

  const getNavItems = () => {
    return [
      { icon: MessageSquareCode, label: "Chit-Chat", href: "#" },
      { icon: MessageSquare, label: "Chat", href: "/" },
      { icon: Search, label: "Search", href: "/search" },
      { icon: Settings, label: "Settings", href: "/settings", bottomNav: true },
      { icon: User, label: "Profile", href: "/profile", bottomNav: true },
      {
        icon: LogOut,
        label: "Logout",
        href: "#",
        onClick: logout,
        bottomNav: true,
      },
    ];
  };

  const items = getNavItems();
  const topItems = items.filter((item) => !item.bottomNav);
  const bottomItems = items.filter((item) => item.bottomNav);

  return (
    <nav className="flex flex-col bg-base-300 text-base-content w-[55px] h-screen fixed left-0 top-0">
      <div className="pt-2">
        {topItems.map((item, index) => (
          <NavItem
            key={`top-${index}`}
            item={item}
            isSelected={location.pathname === item.href}
          />
        ))}
      </div>

      <div className="mt-auto pb-2">
        {bottomItems.map((item, index) => (
          <NavItem
            key={`bottom-${index}`}
            item={item}
            isSelected={location.pathname === item.href}
            onClick={item.onClick}
          />
        ))}
      </div>
    </nav>
  );
};

function NavItem({ item, isSelected, onClick }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Link
        to={item.href}
        className="group flex items-center justify-center w-[55px] h-[55px] relative"
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <div
          className={`
            p-2 rounded-md transition-colors
            ${isSelected ? "bg-base-200" : "hover:bg-base-200"}
          `}
        >
          <item.icon className="w-5 h-5" />
        </div>
      </Link>
      {showTooltip && (
        <div className="absolute left-[60px] top-1/2 -translate-y-1/2 bg-base-200 px-2 py-1 rounded text-sm whitespace-nowrap z-50">
          {item.label}
        </div>
      )}
    </div>
  );
}

export default Navbar;

"use client";

import * as React from "react";
import {
  MessageCircle,
  Phone,
  Circle,
  Bot,
  Lock,
  Star,
  Archive,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NavBar() {
  const [selectedItem, setSelectedItem] =
    (React.useState < number) | (null > null);

  const navItems = [
    { icon: MessageCircle, label: "Chats", href: "#" },
    { icon: Phone, label: "Calls", href: "#" },
    { icon: Circle, label: "Status", href: "#", dot: true },
    { icon: Bot, label: "Meta AI", href: "#", className: "text-blue-400" },
    { type: "divider" },
    { icon: Lock, label: "Locked chats", href: "#" },
    { icon: Star, label: "Starred messages", href: "#" },
    { icon: Archive, label: "Archived chats", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
    { icon: User, label: "Profile", href: "#" },
  ];

  return (
    <TooltipProvider>
      <nav className="flex flex-col bg-[#111111] text-gray-300 w-[55px] h-screen">
        <div className="flex-1 overflow-y-auto py-2 flex flex-col justify-between">
          <div>
            {navItems.slice(0, 4).map((item, index) => (
              <NavItem
                key={index}
                item={item}
                index={index}
                isSelected={selectedItem === index}
                onSelect={() => setSelectedItem(index)}
              />
            ))}
          </div>
          <div>
            {navItems.slice(5).map((item, index) => (
              <NavItem
                key={index + 5}
                item={item}
                index={index + 5}
                isSelected={selectedItem === index + 5}
                onSelect={() => setSelectedItem(index + 5)}
              />
            ))}
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}

interface NavItemProps {
  item: {
    icon: React.ElementType,
    label: string,
    href: string,
    dot?: boolean,
    className?: string,
  };
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function NavItem({ item, index, isSelected, onSelect }: NavItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={`
            group flex items-center justify-center w-[55px] h-[55px] relative
            ${item.className || ""}
          `}
          onClick={(e) => {
            e.preventDefault();
            onSelect();
          }}
        >
          <div
            className={`
            p-2 rounded-md transition-colors
            ${isSelected ? "bg-[#202020]" : "hover:bg-[#202020]"}
          `}
          >
            <NavItemIcon item={item} />
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{item.label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function NavItemIcon({ item }: { item: NavItemProps["item"] }) {
  const Icon = item.icon;
  return (
    <div className="relative">
      <Icon className="w-5 h-5" />
      {item.dot && (
        <span className="absolute right-0 bottom-0 w-2 h-2 bg-green-500 rounded-full" />
      )}
    </div>
  );
}

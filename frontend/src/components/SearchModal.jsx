import { useEffect, useState } from "react";
import { Search, X, ArrowUp, ArrowDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const SearchModal = ({
  isOpen,
  onClose,
  selectedUserId,
  onNavigateMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: searchResults = [] } = useQuery({
    queryKey: ["messageSearch", selectedUserId, searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await axiosInstance.get(
        `/messages/search/${selectedUserId}?query=${searchQuery}`
      );
      return response.data;
    },
    enabled: !!searchQuery && !!selectedUserId,
  });

  useEffect(() => {
    if (searchResults.length > 0) {
      onNavigateMessage(searchResults[0]._id, searchQuery);
      setCurrentIndex(0);
    }
  }, [searchQuery]);

  const handleNavigateUp = () => {
    if (searchResults.length === 0) return;
    const newIndex =
      currentIndex > 0 ? currentIndex - 1 : searchResults.length - 1;
    setCurrentIndex(newIndex);
    onNavigateMessage(searchResults[newIndex]._id);
  };

  const handleNavigateDown = () => {
    if (searchResults.length === 0) return;
    const newIndex =
      currentIndex < searchResults.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onNavigateMessage(searchResults[newIndex]._id);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 w-[350px] bg-base-100 rounded-lg shadow-lg z-40">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-base-200 rounded-lg px-3 py-2">
            <Search className="w-5 h-5 text-base-content/70" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleNavigateUp}
              className="btn btn-ghost btn-sm btn-circle"
              disabled={searchResults.length === 0}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNavigateDown}
              className="btn btn-ghost btn-sm btn-circle"
              disabled={searchResults.length === 0}
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

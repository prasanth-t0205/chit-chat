import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full bg-base-100 border-r border-base-200 flex flex-col w-full md:w-80">
      <div className="p-4 border-b border-base-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold">Contacts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="skeleton w-8 h-4 rounded-full" />
            <div className="skeleton w-16 h-4" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-4 flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="skeleton w-12 h-12 rounded-full" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;

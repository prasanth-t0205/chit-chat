import { THEMES } from "../constants";
import { useTheme } from "../hooks/useTheme";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[95%] lg:max-w-5xl mx-auto py-16 lg:py-20">
        <div className="flex flex-col gap-6 lg:gap-10">
          <div className="w-full">
            <div className="mb-3 lg:mb-4">
              <h2 className="text-lg lg:text-xl font-semibold">Theme</h2>
              <p className="text-xs lg:text-sm text-base-content/70">
                Choose your chat interface theme
              </p>
            </div>

            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`
                    aspect-square rounded-xl transition-all
                    ${
                      theme === t
                        ? "ring-2 ring-primary ring-offset-2"
                        : "hover:bg-base-200"
                    }
                  `}
                >
                  <div className="h-full w-full p-2 flex flex-col gap-2">
                    <div
                      className="flex-1 rounded-lg overflow-hidden"
                      data-theme={t}
                    >
                      <div className="h-full grid grid-cols-2 gap-1 p-1">
                        <div className="rounded bg-primary"></div>
                        <div className="rounded bg-secondary"></div>
                        <div className="rounded bg-accent"></div>
                        <div className="rounded bg-neutral"></div>
                      </div>
                    </div>
                    <span className="text-[10px] lg:text-xs font-medium truncate text-center">
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

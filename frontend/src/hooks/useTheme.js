import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useTheme() {
  const queryClient = useQueryClient();

  const { data: theme } = useQuery({
    queryKey: ["theme"],
    initialData: localStorage.getItem("chat-theme") || "sunset",
  });

  const setTheme = (newTheme) => {
    localStorage.setItem("chat-theme", newTheme);
    queryClient.setQueryData(["theme"], newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return { theme, setTheme };
}

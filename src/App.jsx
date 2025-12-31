import { Outlet } from "react-router";
import { ThemeProvider } from "./utils/ThemeProvider";
import ThemeToggle from "./components/ui/ThemeToggle/ThemeToggle";
import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ConfirmToast from "./utils/ConfirmToast";
import { Toaster } from "react-hot-toast";
import ScrollToTop from './../ScrollToTop';

const queryClient = new QueryClient();
const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div className="relative min-h-screen overflow-x-hidden">
          <ThemeToggle />
          <ScrollToTop />
          <Outlet />
          <ConfirmToast />
          <Toaster
            toastOptions={{
              duration: 5000, // 5000 ms = 5 seconds
            }}
          />
        </div>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;

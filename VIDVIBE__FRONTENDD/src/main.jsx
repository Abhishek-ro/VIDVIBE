import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";


const queryClient= new QueryClient({
   defaultOptions:{
    queries:{
      staleTime:30000, 
    }
   }
})


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SnackbarProvider autoHideDuration={3000}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </SnackbarProvider>
  </BrowserRouter>
);


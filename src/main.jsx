import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import RoutesComponents from "./routes/RoutesComponents.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <ThemeProvider>
      <RoutesComponents />
    </ThemeProvider>
  // </React.StrictMode>
);

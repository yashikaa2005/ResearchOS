import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter";

import "./index.css";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";
import { NoteProvider } from "./context/NoteContext";
import { PaperProvider } from "./context/PaperContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ProjectProvider>
        <NoteProvider>
          <PaperProvider>
            <App />
          </PaperProvider>
        </NoteProvider>
      </ProjectProvider>
    </AuthProvider>
  </StrictMode>
);
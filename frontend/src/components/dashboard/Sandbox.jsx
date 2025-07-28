import React, { useState, useEffect, useRef } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview
} from "@codesandbox/sandpack-react";

const Sandbox = ({ generatedCode }) => {
  const [viewMode, setViewMode] = useState("split"); // 'editor', 'preview', or 'split'
  const [key, setKey] = useState(0); // Force re-render of Sandpack
  const previousCodeRef = useRef(null);

  const defaultCode = `export default function App() {
  return (
    <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Hello from Jigsaw!</h1>
        <p className="text-gray-600">This sandbox now supports Tailwind CSS!</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Click me!
        </button>
      </div>
    </div>
  );
}`;

  const code = generatedCode || defaultCode;

  // Handle new code generation
  useEffect(() => {
    // Check if generatedCode has actually changed and is not null/undefined
    if (generatedCode && generatedCode !== previousCodeRef.current) {
      previousCodeRef.current = generatedCode;
      
      // Force Sandpack to re-render with new code
      setKey(prev => prev + 1);
      
      // Auto-switch behavior based on current view mode
      if (viewMode === "editor") {
        // If in editor mode, switch to preview to show the result
        setViewMode("preview");
      } else if (viewMode === "preview" || viewMode === "split") {
        // If already in preview or split, the key change will force refresh
        // No need to change view mode
      }
    }
  }, [generatedCode, viewMode]);

  // Sandpack files with Tailwind CSS included
  const files = {
    "/App.js": code,
    "/styles.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles can be added here */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
    "/public/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Jigsaw Component Preview</title>
    <link href="/styles.css" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
    "/tailwind.config.js": `module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}`
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Code Playground</h2>
        <div className="flex gap-2">
          <button
            className={`px-4 py-1 rounded transition-colors ${
              viewMode === "editor" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-600 text-gray-300 hover:bg-gray-500"
            }`}
            onClick={() => setViewMode("editor")}
          >
            Editor
          </button>
          <button
            className={`px-4 py-1 rounded transition-colors ${
              viewMode === "preview" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-600 text-gray-300 hover:bg-gray-500"
            }`}
            onClick={() => setViewMode("preview")}
          >
            Preview
          </button>
          <button
            className={`px-4 py-1 rounded transition-colors ${
              viewMode === "split" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-600 text-gray-300 hover:bg-gray-500"
            }`}
            onClick={() => setViewMode("split")}
          >
            Split View
          </button>
        </div>
      </div>
      
      <SandpackProvider
        key={key} // This forces complete re-render when code changes
        template="react"
        files={files}
        customSetup={{
          dependencies: {
            "react": "^18.0.0",
            "react-dom": "^18.0.0",
            "tailwindcss": "^2.2.19",
            "postcss": "^8.3.0",
            "autoprefixer": "^10.3.1"
          }
        }}
        options={{
          activeFile: "/App.js",
          visibleFiles: ["/App.js", "/styles.css"],
          externalResources: ["https://cdn.tailwindcss.com"]
        }}
      >
        <SandpackLayout
          className="border rounded-md overflow-hidden bg-white"
          style={{ height: "500px" }}
        >
          {viewMode === "editor" ? (
            <SandpackCodeEditor
              showTabs
              showLineNumbers
              showInlineErrors
              style={{ height: "100%" }}
            />
          ) : viewMode === "preview" ? (
            <SandpackPreview 
              style={{ height: "100%" }}
              showOpenInCodeSandbox={false}
              showRefreshButton={true}
            />
          ) : (
            <>
              <SandpackCodeEditor
                showTabs
                showLineNumbers
                showInlineErrors
                style={{ height: "100%", width: "50%" }}
              />
              <SandpackPreview 
                style={{ height: "100%", width: "50%" }}
                showOpenInCodeSandbox={false}
                showRefreshButton={true}
              />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default Sandbox;
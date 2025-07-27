import React, { useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview
} from "@codesandbox/sandpack-react";

const Sandbox = () => {
  const [showEditor, setShowEditor] = useState(true);

  const code = `export default function App() {
  return <h1>Hello from the sandbox!</h1>;
}`;

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Code Playground</h2>
        <button
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setShowEditor(!showEditor)}
        >
          Toggle {showEditor ? "Preview" : "Editor"}
        </button>
      </div>
      <SandpackProvider
        template="react"
        files={{
          "/App.js": code
        }}
      >
        <SandpackLayout
          className="border rounded-md overflow-hidden"
          style={{ height: "500px" }} // ⬅️ Increased height here (~20% more)
        >
          {showEditor ? (
            <SandpackCodeEditor
              showTabs
              showLineNumbers
              style={{ height: "100%" }} // Ensure editor fills the new height
            />
          ) : (
            <SandpackPreview style={{ height: "100%" }} /> // Same for preview
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default Sandbox;

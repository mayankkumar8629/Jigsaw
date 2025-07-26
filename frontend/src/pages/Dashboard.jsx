import ChatBox from "../components/dashboard/ChatBox";

export default function Dashboard() {
  const handleSendMessage = (message) => {
    console.log('Sending:', message); // Replace with API call
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a2a] to-[#000000]" />

      {/* Main Content */}
      <main className="relative z-10 h-full flex flex-col">
        {/* Top: Code/Sandbox Area (Placeholder) */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-[#0a0a2a]/50 rounded-xl p-6 border border-[#3a3a5a]">
            <h1 className="text-2xl font-bold mb-4">Generated Code</h1>
            <pre className="bg-black/30 p-4 rounded-lg">
              {/* Code will render here */}
            </pre>
          </div>
        </div>

        {/* Bottom: Chat Box */}
        <ChatBox onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
}
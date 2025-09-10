import React, { useEffect, useState } from 'react';
import ChatPanel from '@components/ChatPanel';

const ChatDock: React.FC = () => {
  const [open, setOpen] = useState(false);

  // global verfügbar: andere Komponenten können das Chat-Fenster öffnen
  useEffect(() => {
    (window as any).openChatDock = () => setOpen(true);
    return () => { delete (window as any).openChatDock; };
  }, []);

  return (
    <>
      <button
        className="fixed bottom-4 right-4 rounded-full px-4 py-3 bg-[var(--brand-1)] text-black font-semibold shadow-lg"
        onClick={() => setOpen(true)}
      >
        Chat
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[360px] glass-panel rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <div className="font-semibold">AI-Chat</div>
            <button className="text-white/70 hover:text-white" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="p-3">
            <ChatPanel />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatDock;

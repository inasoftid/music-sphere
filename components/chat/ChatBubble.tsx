import React from 'react';
import { ChatMessage } from '@/types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="bg-gray-800/50 border border-white/5 text-gray-400 text-xs py-1 px-3 rounded-full backdrop-blur-sm">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[75%] rounded-2xl px-5 py-3 text-sm shadow-md backdrop-blur-sm border
          ${isUser 
            ? 'bg-red-600 text-white rounded-br-none border-red-500/50 shadow-red-900/10' 
            : 'bg-gray-800/80 text-gray-200 rounded-bl-none border-white/10 shadow-black/20'
          }`}
      >
        <p className="leading-relaxed">{message.text}</p>
        <div className={`text-[10px] mt-1.5 text-right ${isUser ? 'text-red-200' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          {isUser && (
            <span className="ml-1 opacity-70">
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

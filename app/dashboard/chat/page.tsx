'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/types';

// Helper function to get auth headers from localStorage
const getAuthHeaders = (): Record<string, string> => {
  const user = typeof window !== 'undefined' ? 
    JSON.parse(localStorage.getItem('music_sphere_user') || 'null') : 
    null;
  
  if (!user || !user.id || !user.email) return {};
  
  return {
    'X-User-ID': user.id,
    'X-User-Email': user.email,
  };
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages from database on component mount and poll every 3 seconds
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/chat', {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          // Map database format to ChatMessage format
          const mappedMessages = data.map((msg: any) => ({
            id: msg.id,
            sender: msg.sender,
            text: msg.text,
            timestamp: msg.createdAt,
            isRead: msg.isRead,
          }));
          setMessages(mappedMessages);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchMessages();

    // Poll every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const tempMessageId = `temp-${Date.now()}`;

    // Optimistic update: add message to UI immediately
    setMessages((prev) => [
      ...prev,
      {
        id: tempMessageId,
        sender: 'user',
        text: text,
        timestamp: new Date().toISOString(),
        isRead: false,
      },
    ]);

    setIsSending(true);

    try {
      // Send message to database
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newMessage = await response.json();

      // Replace temp message with real message from server
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempMessageId
            ? {
                id: newMessage.id,
                sender: newMessage.sender,
                text: newMessage.text,
                timestamp: newMessage.createdAt,
                isRead: newMessage.isRead,
              }
            : m
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove message on error
      setMessages((prev) =>
        prev.filter((m) => m.id !== tempMessageId)
      );
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div suppressHydrationWarning className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
      <div className="bg-gray-900/50 border-b border-white/5 p-4 flex items-center justify-between backdrop-blur-md">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            Admin Support
            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20">Official</span>
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/30 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="bg-gray-900/50 border-t border-white/5 p-4 backdrop-blur-md">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isSending} />
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/types';

// Extended type for Chat Session
interface ChatSession {
  id: string; // userId
  name: string;
  email: string;
  avatarUrl?: string;
  unreadCount: number;
  messages: ChatMessage[];
}

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

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Derive active session data
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  
  // Filter sessions based on search
  const filteredSessions = sessions.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages]);

  // Fetch all students with their messages and poll every 3 seconds
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/chat?role=admin', {
          headers: getAuthHeaders(),
        });
        
        if (response.ok) {
          const data = await response.json();
          const formattedSessions: ChatSession[] = data.map((student: any) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            avatarUrl: student.avatarUrl,
            unreadCount: student.messages?.filter((m: any) => !m.isRead && m.sender === 'user').length || 0,
            messages: student.messages?.map((msg: any) => ({
              id: msg.id,
              sender: msg.sender,
              text: msg.text,
              timestamp: msg.createdAt,
              isRead: msg.isRead,
            })) || [],
          }));
          
          // Smart merge: preserve unreadCount for active session
          setSessions((prevSessions) =>
            formattedSessions.map((newSession) => {
              const prevSession = prevSessions.find((s) => s.id === newSession.id);
              
              // If this is the active session, keep the local unreadCount
              if (newSession.id === activeSessionId && prevSession) {
                return {
                  ...newSession,
                  unreadCount: prevSession.unreadCount,
                  messages: newSession.messages, // But update messages
                };
              }
              
              return newSession;
            })
          );
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchStudents();

    // Poll every 3 seconds
    const interval = setInterval(fetchStudents, 3000);
    return () => clearInterval(interval);
  }, [activeSessionId]);

  const handleSessionClick = (sessionId: string) => {
    setActiveSessionId(sessionId);
    // Mark all messages as read
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              unreadCount: 0,
              messages: s.messages.map((m) => ({ ...m, isRead: true })),
            }
          : s
      )
    );
  };

  const handleSendMessage = async (text: string) => {
    if (!activeSessionId || !text.trim()) return;

    const tempMessageId = `temp-${Date.now()}`;

    // Optimistic update: add message to UI immediately
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [
              ...s.messages,
              {
                id: tempMessageId,
                sender: 'admin',
                text: text,
                timestamp: new Date().toISOString(),
                isRead: true,
              },
            ],
          };
        }
        return s;
      })
    );

    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ 
          text,
          targetUserId: activeSessionId,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        
        // Replace temp message with real message from server
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === tempMessageId
                    ? {
                        id: newMessage.id,
                        sender: 'admin',
                        text: newMessage.text,
                        timestamp: newMessage.createdAt,
                        isRead: newMessage.isRead,
                      }
                    : m
                ),
              };
            }
            return s;
          })
        );
      } else {
        // Remove message on error
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                messages: s.messages.filter((m) => m.id !== tempMessageId),
              };
            }
            return s;
          })
        );
        alert('Gagal mengirim pesan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove message on error
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: s.messages.filter((m) => m.id !== tempMessageId),
            };
          }
          return s;
        })
      );
      alert('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div suppressHydrationWarning className="flex h-[calc(100vh-8rem)] max-w-6xl mx-auto bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      
      {/* LEFT SIDEBAR: Student List */}
      <div className="w-1/3 border-r border-gray-100 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-white">
          <h2 className="font-bold text-gray-800">Daftar Chat</h2>
          <div className="relative mt-2">
            <input 
              type="text" 
              placeholder="Cari siswa..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-100 border-none rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">No conversations found</div>
          ) : (
            filteredSessions.map((session) => {
              const lastMessage = session.messages[session.messages.length - 1];
              const lastMessageTime = lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '-';
              const lastMessageText = lastMessage?.text || 'No messages yet';
              
              return (
                <div
                  key={session.id}
                  onClick={() => handleSessionClick(session.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-100 relative ${
                    activeSessionId === session.id ? 'bg-white border-l-4 border-l-indigo-500 shadow-sm' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-medium text-sm truncate pr-2 ${activeSessionId === session.id ? 'text-indigo-600' : 'text-gray-900'}`}>
                      {session.name}
                    </h3>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {lastMessageTime}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate line-clamp-1 h-4">
                    {lastMessageText}
                  </p>
                  
                  {/* Badges */}
                  {session.unreadCount > 0 && (
                    <div className="mt-2">
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 h-4.5 flex items-center justify-center rounded-full w-fit">
                        {session.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Chat Area */}
      <div className="w-2/3 flex flex-col bg-white">
        {activeSessionId ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {activeSession?.name.charAt(0)}
                </div>
                <div>
                  <h1 className="font-bold text-gray-800 text-sm">
                    {activeSession?.name}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {activeSession?.email}
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 custom-scrollbar">
              {activeSession?.messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="bg-white border-t border-gray-100 p-4">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isSending} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium">Pilih percakapan untuk memulai chat</p>
          </div>
        )}
      </div>
    </div>
  );
}

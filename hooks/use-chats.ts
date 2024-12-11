import { useState, useEffect, useCallback } from 'react'
import { Chat } from '@/types/chat'
import Cookies from 'js-cookie'

export function useChats() {
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = Cookies.get('chats')
    if (saved) {
      return JSON.parse(saved)
    }
    return []
  })

  const [activeChat, setActiveChat] = useState<string | null>(() => {
    return Cookies.get('activeChat') || null
  })

  useEffect(() => {
    Cookies.set('chats', JSON.stringify(chats), { expires: 30 }) // expires in 30 days
  }, [chats])

  useEffect(() => {
    if (activeChat) {
      Cookies.set('activeChat', activeChat, { expires: 30 })
    } else {
      Cookies.remove('activeChat')
    }
  }, [activeChat])

  const createChat = () => {
    const newChat: Chat = {
      id: Math.random().toString(36).substring(7),
      title: 'New Chat',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setChats(prev => [newChat, ...prev])
    setActiveChat(newChat.id)
    return newChat.id
  }

  const updateChat = useCallback((id: string, updates: Partial<Chat>) => {
    setChats(prev => {
      const chatIndex = prev.findIndex(chat => chat.id === id);
      if (chatIndex === -1) return prev; // Chat not found, return current state
      const updatedChat = { ...prev[chatIndex], ...updates, updatedAt: new Date() };
      if (JSON.stringify(updatedChat) === JSON.stringify(prev[chatIndex])) {
        return prev; // No changes, return current state
      }
      const newChats = [...prev];
      newChats[chatIndex] = updatedChat;
      return newChats;
    });
  }, []);

  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(chat => chat.id !== id))
    if (activeChat === id) {
      setActiveChat(null)
    }
  }

  return {
    chats,
    activeChat,
    setActiveChat,
    createChat,
    updateChat,
    deleteChat
  }
}


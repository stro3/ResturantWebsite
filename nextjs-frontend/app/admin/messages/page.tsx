'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowLeft, FaEnvelope, FaEnvelopeOpen, FaTrash, FaReply } from 'react-icons/fa'

interface Message {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  date: string
  isRead: boolean
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'MSG-1001', 
      name: 'Alice Johnson', 
      email: 'alice@email.com', 
      phone: '+1 555-1111',
      subject: 'Catering Inquiry', 
      message: 'Hi, I would like to inquire about your catering services for a corporate event with 50 guests. Please let me know your availability and pricing.',
      date: '2026-01-27 10:30 AM',
      isRead: false
    },
    { 
      id: 'MSG-1002', 
      name: 'Bob Williams', 
      email: 'bob@email.com', 
      phone: '+1 555-2222',
      subject: 'Feedback', 
      message: 'Just wanted to say thank you for the amazing dining experience last night! The truffle risotto was absolutely delicious.',
      date: '2026-01-26 8:15 PM',
      isRead: false
    },
    { 
      id: 'MSG-1003', 
      name: 'Carol Davis', 
      email: 'carol@email.com', 
      phone: '+1 555-3333',
      subject: 'Private Event', 
      message: 'I am interested in booking your private dining room for a birthday celebration. We would have around 20 guests. What options do you have?',
      date: '2026-01-26 3:45 PM',
      isRead: true
    },
  ])

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const markAsRead = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, isRead: true } : msg
    ))
  }

  const deleteMessage = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      setMessages(prev => prev.filter(msg => msg.id !== id))
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
    }
  }

  const openMessage = (msg: Message) => {
    setSelectedMessage(msg)
    if (!msg.isRead) {
      markAsRead(msg.id)
    }
  }

  const unreadCount = messages.filter(m => !m.isRead).length

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-charcoal text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-burgundy transition-colors">
              <FaArrowLeft />
            </Link>
            <span className="font-playfair text-xl font-bold">Messages</span>
            {unreadCount > 0 && (
              <span className="bg-burgundy text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="font-semibold text-charcoal">Inbox</h3>
              </div>
              <div className="divide-y">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => openMessage(msg)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === msg.id ? 'bg-burgundy/5 border-l-4 border-burgundy' : ''
                    } ${!msg.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {msg.isRead ? (
                          <FaEnvelopeOpen className="text-gray-400" />
                        ) : (
                          <FaEnvelope className="text-burgundy" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`font-medium text-charcoal truncate ${!msg.isRead ? 'font-bold' : ''}`}>
                            {msg.name}
                          </p>
                        </div>
                        <p className={`text-sm truncate ${!msg.isRead ? 'text-charcoal font-medium' : 'text-gray-500'}`}>
                          {msg.subject}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{msg.date}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-charcoal mb-1">{selectedMessage.subject}</h2>
                    <p className="text-sm text-gray-500">From: {selectedMessage.name}</p>
                    <p className="text-sm text-gray-500">{selectedMessage.email} • {selectedMessage.phone}</p>
                    <p className="text-xs text-gray-400 mt-1">{selectedMessage.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="p-2 bg-burgundy hover:bg-primary text-white rounded-lg transition-colors"
                      title="Reply"
                    >
                      <FaReply />
                    </a>
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-charcoal whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="mt-6">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="inline-flex items-center gap-2 bg-burgundy hover:bg-primary text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <FaReply /> Reply to {selectedMessage.name}
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <FaEnvelope className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

x'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowLeft, FaCalendarAlt, FaCheck, FaTimes, FaPhone, FaEnvelope, FaUsers } from 'react-icons/fa'

interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  experience: string
  status: string
  specialRequests?: string
}

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([
    { id: 'RES-1001', name: 'Kumar Yash Sanjeev Kumar', email: 'kumar@email.com', phone: '+1 555-1234', date: '2026-01-27', time: '7:00 PM', guests: 4, experience: 'Fine Dining', status: 'confirmed' },
    { id: 'RES-1002', name: 'Sarah Wilson', email: 'sarah@email.com', phone: '+1 555-5678', date: '2026-01-27', time: '7:30 PM', guests: 2, experience: 'Cafe', status: 'confirmed' },
    { id: 'RES-1003', name: 'Robert Chen', email: 'robert@email.com', phone: '+1 555-9012', date: '2026-01-27', time: '8:00 PM', guests: 6, experience: 'Fine Dining', status: 'pending' },
    { id: 'RES-1004', name: 'Emily Brown', email: 'emily@email.com', phone: '+1 555-3456', date: '2026-01-28', time: '6:30 PM', guests: 3, experience: 'Fast Food', status: 'confirmed' },
])



  const [filter, setFilter] = useState('all')

  const filteredReservations = reservations.filter(res => {
    if (filter === 'all') return true
    return res.status === filter
  })

  const updateStatus = (id: string, newStatus: string) => {
    setReservations(prev => prev.map(res => 
      res.id === id ? { ...res, status: newStatus } : res
    ))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-charcoal text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-burgundy transition-colors">
              <FaArrowLeft />
            </Link>
            <span className="font-playfair text-xl font-bold">Reservations</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-6">
          {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                filter === status
                  ? 'bg-burgundy text-white'
                  : 'bg-white text-charcoal hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredReservations.map((res, index) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-charcoal text-lg">{res.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      res.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{res.id}</p>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-burgundy" />
                      <span>{res.date} at {res.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-burgundy" />
                      <span>{res.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-burgundy" />
                      <span>{res.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-burgundy" />
                      <span>{res.phone}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-sm bg-cream px-3 py-1 rounded-full text-charcoal">
                      {res.experience}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {res.status !== 'confirmed' && (
                    <button
                      onClick={() => updateStatus(res.id, 'confirmed')}
                      className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                      title="Confirm"
                    >
                      <FaCheck />
                    </button>
                  )}
                  {res.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(res.id, 'cancelled')}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                      title="Cancel"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No reservations found
          </div>
        )}
      </div>
    </div>
  )
}

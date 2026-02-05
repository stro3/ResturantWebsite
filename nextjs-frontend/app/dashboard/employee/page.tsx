'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  FaUtensils, FaSignOutAlt, FaClipboardList, FaCheckCircle, FaClock, 
  FaShoppingBag, FaCalendarAlt, FaBell, FaUser, FaChartLine,
  FaHistory, FaExclamationTriangle, FaTimes
} from 'react-icons/fa'

interface User {
  name: string
  email: string
  role: string
}

interface Order {
  id: string
  customer_name: string
  items: any[]
  total: number
  status: string
  created_at: string
}

interface Reservation {
  id: string
  name: string
  date: string
  time: string
  guests: number
  status: string
}

export default function EmployeeDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [activeTab, setActiveTab] = useState('orders')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'employee') {
        router.push('/login')
        return
      }
      setUser(parsedUser)
      fetchData()
    } else {
      router.push('/login')
    }
  }, [router])

  const fetchData = async () => {
    try {
      const [ordersRes, reservationsRes] = await Promise.all([
        fetch('http://localhost:5000/api/orders'),
        fetch('http://localhost:5000/api/reservations')
      ])

      if (ordersRes.ok) {
        const data = await ordersRes.json()
        setOrders(data)
      }

      if (reservationsRes.ok) {
        const data = await reservationsRes.json()
        setReservations(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      fetchData()
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const updateReservationStatus = async (resId: string, newStatus: string) => {
    try {
      await fetch(`http://localhost:5000/api/reservations/${resId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      fetchData()
    } catch (error) {
      console.error('Error updating reservation:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing')
  const todayReservations = reservations.filter(r => {
    const today = new Date().toISOString().split('T')[0]
    return r.date === today
  })

  if (!user) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FaUtensils className="text-white text-xl" />
              </div>
              <div>
                <span className="font-playfair text-xl font-bold">Gastronome</span>
                <span className="text-xs text-emerald-200 block">Employee Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaBell className="text-xl cursor-pointer" />
                {pendingOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {pendingOrders.length}
                  </span>
                )}
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-emerald-200">Employee</p>
              </div>
              <button onClick={handleLogout} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition">
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-800">{pendingOrders.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaClock className="text-orange-500 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today's Reservations</p>
                <p className="text-3xl font-bold text-gray-800">{todayReservations.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaCalendarAlt className="text-blue-500 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaShoppingBag className="text-green-500 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed Today</p>
                <p className="text-3xl font-bold text-gray-800">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaCheckCircle className="text-purple-500 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaClipboardList className="inline mr-2" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'reservations'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaCalendarAlt className="inline mr-2" />
            Reservations
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Order Management</h2>
              <p className="text-gray-500 text-sm">View and update order statuses</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-800">
                          #{order.id?.slice(-6)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.customer_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.items?.length || 0} items
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                          ${order.total?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="border rounded-lg px-3 py-1 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Reservation Management</h2>
              <p className="text-gray-500 text-sm">View and confirm reservations</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Guest Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Party Size</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No reservations yet
                      </td>
                    </tr>
                  ) : (
                    reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{res.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{res.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{res.time}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{res.guests} guests</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            res.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {res.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => updateReservationStatus(res.id, 'confirmed')}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateReservationStatus(res.id, 'cancelled')}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

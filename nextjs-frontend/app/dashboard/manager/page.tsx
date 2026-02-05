'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  FaUtensils, FaSignOutAlt, FaChartBar, FaUsers, FaDollarSign,
  FaShoppingBag, FaCalendarAlt, FaBell, FaCog, FaClipboardList,
  FaUserTie, FaChartLine, FaPlus, FaEdit, FaTrash, FaEye, FaTimes
} from 'react-icons/fa'

interface User {
  name: string
  email: string
  role: string
}

interface StaffMember {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  created_at?: string
}

export default function ManagerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phone: '', role: 'employee', password: '' })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'manager') {
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
      const [ordersRes, reservationsRes, menuRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/orders'),
        fetch('http://localhost:5000/api/reservations'),
        fetch('http://localhost:5000/api/menu'),
        fetch('http://localhost:5000/api/users')
      ])

      if (ordersRes.ok) setOrders(await ordersRes.json())
      if (reservationsRes.ok) setReservations(await reservationsRes.json())
      if (menuRes.ok) setMenuItems(await menuRes.json())
      if (usersRes.ok) setStaffMembers(await usersRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStaff = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      })
      
      if (res.ok) {
        setShowAddStaffModal(false)
        setNewStaff({ name: '', email: '', phone: '', role: 'employee', password: '' })
        fetchData() // Refresh the list
      }
    } catch (error) {
      console.error('Error adding staff:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        fetchData() // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  // Calculate stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const todayOrders = orders.filter(o => {
    const today = new Date().toISOString().split('T')[0]
    return o.created_at?.includes(today)
  })
  const pendingReservations = reservations.filter(r => r.status !== 'confirmed' && r.status !== 'cancelled')

  if (!user) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl z-50">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-2 rounded-lg">
              <FaUtensils className="text-black text-xl" />
            </div>
            <div>
              <span className="font-playfair text-xl font-bold">Gastronome</span>
              <span className="text-xs text-slate-400 block">Manager Portal</span>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {[
              { id: 'overview', icon: FaChartBar, label: 'Overview' },
              { id: 'orders', icon: FaShoppingBag, label: 'Orders' },
              { id: 'reservations', icon: FaCalendarAlt, label: 'Reservations' },
              { id: 'menu', icon: FaClipboardList, label: 'Menu Management' },
              { id: 'staff', icon: FaUsers, label: 'Staff' },
              { id: 'reports', icon: FaChartLine, label: 'Reports' },
              { id: 'settings', icon: FaCog, label: 'Settings' },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === item.id
                      ? 'bg-amber-500 text-black'
                      : 'hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <item.icon />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-500 w-10 h-10 rounded-full flex items-center justify-center text-black font-bold">
              {user.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate-400">Manager</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'reservations' && 'Reservations'}
              {activeTab === 'menu' && 'Menu Management'}
              {activeTab === 'staff' && 'Staff Management'}
              {activeTab === 'reports' && 'Reports & Analytics'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p className="text-gray-500">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FaBell className="text-gray-400 text-xl cursor-pointer hover:text-gray-600" />
              {pendingReservations.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingReservations.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
                    <p className="text-green-500 text-sm">+12% from last month</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-full">
                    <FaDollarSign className="text-green-500 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
                    <p className="text-blue-500 text-sm">{todayOrders.length} today</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-full">
                    <FaShoppingBag className="text-blue-500 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Reservations</p>
                    <p className="text-3xl font-bold text-gray-800">{reservations.length}</p>
                    <p className="text-orange-500 text-sm">{pendingReservations.length} pending</p>
                  </div>
                  <div className="bg-orange-100 p-4 rounded-full">
                    <FaCalendarAlt className="text-orange-500 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Menu Items</p>
                    <p className="text-3xl font-bold text-gray-800">{menuItems.length}</p>
                    <p className="text-purple-500 text-sm">Active items</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-full">
                    <FaClipboardList className="text-purple-500 text-2xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{order.customer_name}</p>
                        <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">${order.total?.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No orders yet</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Reservations</h3>
                <div className="space-y-4">
                  {reservations.slice(0, 5).map((res) => (
                    <div key={res.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{res.name}</p>
                        <p className="text-sm text-gray-500">{res.guests} guests • {res.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">{res.date}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {res.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {reservations.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No reservations yet</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">All Orders</h2>
                  <p className="text-gray-500 text-sm">{orders.length} total orders</p>
                </div>
              </div>
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
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono">#{order.id?.slice(-6)}</td>
                      <td className="px-6 py-4 text-sm">{order.customer_name}</td>
                      <td className="px-6 py-4 text-sm">{order.items?.length || 0} items</td>
                      <td className="px-6 py-4 text-sm font-bold">${order.total?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">All Reservations</h2>
                <p className="text-gray-500 text-sm">{reservations.length} total reservations</p>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Guest</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Guests</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{res.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{res.email}</td>
                      <td className="px-6 py-4 text-sm">{res.date}</td>
                      <td className="px-6 py-4 text-sm">{res.time}</td>
                      <td className="px-6 py-4 text-sm">{res.guests}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          res.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {res.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Menu Items</h2>
                  <p className="text-gray-500 text-sm">{menuItems.length} items</p>
                </div>
                <button className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                  <FaPlus /> Add Item
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Item</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{item.category}</td>
                      <td className="px-6 py-4 text-sm font-bold">${item.price}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-3"><FaEdit /></button>
                        <button className="text-red-600 hover:text-red-800"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Staff Members</h2>
                  <p className="text-gray-500 text-sm">{staffMembers.length} total users</p>
                </div>
                <button 
                  onClick={() => setShowAddStaffModal(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <FaPlus /> Add Staff
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffMembers.map((member) => (
                  <div key={member.id} className="border rounded-xl p-6 text-center relative group">
                    <button 
                      onClick={() => handleDeleteUser(member.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTrash />
                    </button>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      member.role === 'manager' ? 'bg-amber-100' : 
                      member.role === 'employee' ? 'bg-emerald-100' : 'bg-blue-100'
                    }`}>
                      <FaUserTie className={`text-3xl ${
                        member.role === 'manager' ? 'text-amber-600' : 
                        member.role === 'employee' ? 'text-emerald-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <h3 className="font-bold text-gray-800">{member.name}</h3>
                    <p className="text-gray-500 text-sm mb-1">{member.email}</p>
                    {member.phone && <p className="text-gray-400 text-xs mb-2">{member.phone}</p>}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.role === 'manager' ? 'bg-amber-100 text-amber-700' : 
                      member.role === 'employee' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Staff Modal */}
            {showAddStaffModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-8 w-full max-w-md mx-4"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Add New Staff Member</h3>
                    <button onClick={() => setShowAddStaffModal(false)} className="text-gray-400 hover:text-gray-600">
                      <FaTimes />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={newStaff.name}
                        onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="john@gastronome.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={newStaff.phone}
                        onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="+1-555-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={newStaff.password}
                        onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Enter password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={newStaff.role}
                        onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setShowAddStaffModal(false)}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddStaff}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-black py-3 rounded-lg font-medium"
                      >
                        Add Staff
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-bold text-2xl">${totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Average Order Value</span>
                    <span className="font-bold text-xl">${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-bold text-xl">{orders.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Reservation Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Reservations</span>
                    <span className="font-bold text-2xl">{reservations.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Confirmed</span>
                    <span className="font-bold text-xl text-green-600">
                      {reservations.filter(r => r.status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-bold text-xl text-yellow-600">{pendingReservations.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Restaurant Settings</h2>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                  <input type="text" defaultValue="Gastronome" className="w-full border rounded-lg px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" defaultValue="reservations@gastronome.com" className="w-full border rounded-lg px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" defaultValue="+1 (212) 555-1234" className="w-full border rounded-lg px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea defaultValue="350 Fifth Avenue, New York, NY 10118" className="w-full border rounded-lg px-4 py-3" rows={3} />
                </div>
                <button className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-medium">
                  Save Settings
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

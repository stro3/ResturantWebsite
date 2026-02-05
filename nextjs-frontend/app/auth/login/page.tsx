'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaUtensils, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserTie, FaUser, FaUserCog } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const roles = [
    { id: 'customer', label: 'Customer', icon: FaUser, color: 'bg-blue-500' },
    { id: 'employee', label: 'Employee', icon: FaUserCog, color: 'bg-green-500' },
    { id: 'manager', label: 'Manager', icon: FaUserTie, color: 'bg-burgundy' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (formData.email && formData.password) {
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          role: formData.role,
          name: formData.email.split('@')[0]
        }))

        switch (formData.role) {
          case 'manager':
            router.push('/admin')
            break
          case 'employee':
            router.push('/employee')
            break
          default:
            router.push('/')
        }
      } else {
        setError('Please enter email and password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal to-burgundy/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-burgundy to-primary p-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3 text-white mb-4">
              <FaUtensils className="text-3xl" />
              <span className="font-playfair text-2xl font-bold">Gastronome</span>
            </Link>
            <p className="text-white/80 text-sm">Welcome back! Please login to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal mb-3">Login as</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.id })}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.role === role.id
                        ? 'border-burgundy bg-burgundy/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 ${role.color} rounded-full flex items-center justify-center`}>
                      <role.icon className="text-white" />
                    </div>
                    <span className={`text-xs font-medium ${formData.role === role.id ? 'text-burgundy' : 'text-gray-600'}`}>
                      {role.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-charcoal mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-burgundy rounded border-gray-300 focus:ring-burgundy" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-burgundy hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-burgundy hover:bg-primary text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-burgundy font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center text-white/60 text-sm mt-6">
          © 2026 Gastronome Restaurant. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaUtensils, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaPhone, FaUserTie, FaUserCog, FaCheck } from 'react-icons/fa'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    employeeCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const roles = [
    { id: 'customer', label: 'Customer', icon: FaUser, color: 'bg-blue-500', description: 'Order food & make reservations' },
    { id: 'employee', label: 'Employee', icon: FaUserCog, color: 'bg-green-500', description: 'Staff access (requires code)' },
    { id: 'manager', label: 'Manager', icon: FaUserTie, color: 'bg-burgundy', description: 'Full admin access (requires code)' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      if (!formData.role) {
        setError('Please select a role')
        return
      }
      setStep(2)
      setError('')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if ((formData.role === 'employee' || formData.role === 'manager') && !formData.employeeCode) {
      setError('Please enter the employee/manager code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        role: formData.role,
        name: formData.name
      }))

      router.push('/auth/login')
    } catch (err) {
      setError('Signup failed. Please try again.')
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
            <p className="text-white/80 text-sm">Create your account to get started</p>
          </div>

          <div className="px-8 pt-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-burgundy text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > 1 ? <FaCheck /> : '1'}
              </div>
              <div className={`w-16 h-1 rounded ${step > 1 ? 'bg-burgundy' : 'bg-gray-200'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-burgundy text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-2">
            {step === 1 ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-lg font-bold text-charcoal mb-4 text-center">Select Account Type</h3>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.id })}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        formData.role === role.id
                          ? 'border-burgundy bg-burgundy/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 ${role.color} rounded-xl flex items-center justify-center`}>
                        <role.icon className="text-white text-xl" />
                      </div>
                      <div className="text-left">
                        <p className={`font-semibold ${formData.role === role.id ? 'text-burgundy' : 'text-charcoal'}`}>
                          {role.label}
                        </p>
                        <p className="text-xs text-gray-500">{role.description}</p>
                      </div>
                      {formData.role === role.id && (
                        <FaCheck className="ml-auto text-burgundy" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Phone Number</label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy"
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

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Confirm Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {(formData.role === 'employee' || formData.role === 'manager') && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      {formData.role === 'manager' ? 'Manager Code' : 'Employee Code'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.employeeCode}
                      onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy"
                      placeholder="Enter access code"
                    />
                    <p className="text-xs text-gray-500 mt-1">Contact admin to get your access code</p>
                  </div>
                )}

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" required className="w-4 h-4 mt-1 text-burgundy rounded border-gray-300 focus:ring-burgundy" />
                  <span className="text-sm text-gray-600">
                    I agree to the <Link href="/terms" className="text-burgundy hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-burgundy hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              </motion.div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-charcoal py-3 rounded-xl font-semibold transition-all"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-burgundy hover:bg-primary text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : step === 1 ? (
                  'Continue'
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-burgundy font-semibold hover:underline">
                Sign In
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

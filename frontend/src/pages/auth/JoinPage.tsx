import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/services/api'

export default function JoinPage() {
  const { joinBatch, loginWithOtp } = useAuth()
  const [tab, setTab] = useState<'join' | 'otp'>('join')
  const [joinCode, setJoinCode] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [otpIdentifier, setOtpIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await joinBatch(joinCode.toUpperCase(), name, contact)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid join code or details')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async () => {
    setError('')
    setLoading(true)
    try {
      await apiClient.post('/api/auth/otp/send', { identifier: otpIdentifier })
      setOtpSent(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithOtp(otpIdentifier, otp)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Join Training</h1>
        <p className="text-center text-gray-500 mb-6">Enter your join code or sign in with OTP</p>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button onClick={() => { setTab('join'); setError('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'join' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
            Join Code
          </button>
          <button onClick={() => { setTab('otp'); setError('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'otp' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
            Returning Student
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-4">{error}</div>}

        {tab === 'join' ? (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Code</label>
              <input value={joinCode} onChange={(e) => setJoinCode(e.target.value)}
                className="w-full px-3 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="JAVA42" maxLength={10} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Rahul Sharma" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
              <input value={contact} onChange={(e) => setContact(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="rahul@email.com or 9876543210" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {loading ? 'Joining...' : 'Join Training'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
              <div className="flex gap-2">
                <input value={otpIdentifier} onChange={(e) => setOtpIdentifier(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="rahul@email.com" required disabled={otpSent} />
                <button type="button" onClick={handleSendOtp} disabled={loading || !otpIdentifier}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors whitespace-nowrap text-sm">
                  {otpSent ? 'Resend' : 'Send OTP'}
                </button>
              </div>
            </div>
            {otpSent && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                  <input value={otp} onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="000000" maxLength={6} required />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {loading ? 'Verifying...' : 'Sign In'}
                </button>
              </>
            )}
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Faculty? <Link to="/login" className="text-blue-600 hover:underline">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

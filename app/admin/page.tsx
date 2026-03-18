'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { supabase } from '@/lib/supabase'
import { User } from '@/types'
import { Shield, Users, AlertTriangle, Settings, Search } from 'lucide-react'

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<'users' | 'reports' | 'settings'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (user?.is_super_admin) {
      fetchUsers()
    }
  }, [user])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data as User[])
    } catch (error: any) {
      toast.error('ব্যবহারকারীদের তথ্য লোড করতে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    try {
      // Assuming RPC function exists, fallback to direct update if not
      const { error } = await supabase
        .from('users')
        .update({ is_blocked: !isBlocked, is_active: isBlocked })
        .eq('id', userId)

      if (error) throw error
      
      toast.success(isBlocked ? 'ব্যবহারকারী আনব্লক করা হয়েছে' : 'ব্যবহারকারী ব্লক করা হয়েছে')
      fetchUsers()
    } catch (error: any) {
      toast.error('অ্যাকশন সম্পন্ন করতে সমস্যা হয়েছে')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই ব্যবহারকারীকে মুছে ফেলতে চান?')) return

    try {
      // Assuming RPC function exists, fallback to direct delete if not
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error
      
      toast.success('ব্যবহারকারী মুছে ফেলা হয়েছে')
      fetchUsers()
    } catch (error: any) {
      toast.error('অ্যাকশন সম্পন্ন করতে সমস্যা হয়েছে')
    }
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!user || !user.is_super_admin) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)] bg-gray-50">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">অ্যাক্সেস ডিনাইড</h2>
        <p className="text-gray-600">এই পেজটি দেখার অনুমতি আপনার নেই।</p>
      </div>
    )
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.phone.includes(searchQuery)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <Shield className="text-red-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">অ্যাডমিন প্যানেল</h2>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Users size={18} />
                ব্যবহারকারী
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <AlertTriangle size={18} />
                রিপোর্ট
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Settings size={18} />
                সেটিংস
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">সকল ব্যবহারকারী ({users.length})</h3>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="নাম বা নম্বর দিয়ে খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 text-sm font-semibold text-gray-600">নাম</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">নম্বর</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">গ্রুপ</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">স্ট্যাটাস</th>
                      <th className="p-4 text-sm font-semibold text-gray-600 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">লোড হচ্ছে...</td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">কোনো ব্যবহারকারী পাওয়া যায়নি</td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="font-medium text-gray-900">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.district}</div>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{u.phone}</td>
                          <td className="p-4">
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                              {u.blood_group}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${u.is_blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {u.is_blocked ? 'ব্লকড' : 'অ্যাকটিভ'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleBlockUser(u.id, u.is_blocked)}
                              className={`px-3 py-1.5 rounded text-xs font-medium ${u.is_blocked ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                            >
                              {u.is_blocked ? 'আনব্লক' : 'ব্লক'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="px-3 py-1.5 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              ডিলিট
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">রিপোর্টসমূহ</h3>
              <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-xl">বর্তমানে কোনো রিপোর্ট নেই</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">অ্যাডমিন সেটিংস</h3>
              <div className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adsterra Header Slot ID</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" placeholder="e.g. 1234567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adsterra Footer Slot ID</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" placeholder="e.g. 7654321" />
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium">
                  সেভ করুন
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

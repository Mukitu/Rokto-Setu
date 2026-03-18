'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types'
import { Search, Phone, MapPin, Droplet, Stethoscope, Truck, Ban, CheckCircle, Trash2, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import BlockModal from './BlockModal'
import DeleteModal from './DeleteModal'
import { BLOOD_GROUPS } from '@/lib/constants'

export default function UsersTab() {
  const toast = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState({ name: '', phone: '', blood: '' })
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 300)
    return () => clearTimeout(timer)
  }, [page, filters])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * 20, (page + 1) * 20 - 1)

      if (filters.name) query = query.ilike('name', `%${filters.name}%`)
      if (filters.phone) query = query.ilike('phone', `%${filters.phone}%`)
      if (filters.blood) query = query.eq('blood_group', filters.blood)

      const { data, count, error } = await query
      if (error) throw error
      
      setUsers(data as User[])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBlock = async (reason: string) => {
    if (!selectedUser) return
    try {
      const { error } = await supabase.rpc('admin_block_user', {
        target_user_id: selectedUser.id,
        block_reason_text: reason
      })
      if (error) throw error
      toast.success('ব্লক করা হয়েছে ✓')
      fetchUsers()
      setShowBlockModal(false)
    } catch (error) {
      toast.error('সমস্যা হয়েছে, আবার চেষ্টা করুন')
    }
  }

  const handleUnblock = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('admin_unblock_user', {
        target_user_id: userId
      })
      if (error) throw error
      toast.success('আনব্লক করা হয়েছে ✓')
      fetchUsers()
    } catch (error) {
      toast.error('সমস্যা হয়েছে, আবার চেষ্টা করুন')
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    try {
      const { error } = await supabase.rpc('admin_delete_user', {
        target_user_id: selectedUser.id
      })
      if (error) throw error
      toast.success('মুছে ফেলা হয়েছে ✓')
      fetchUsers()
      setShowDeleteModal(false)
    } catch (error) {
      toast.error('সমস্যা হয়েছে, আবার চেষ্টা করুন')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="নাম দিয়ে খুঁজুন"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C0001A]"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
            </div>
            <div className="relative w-full md:w-64">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="ফোন নম্বর দিয়ে খুঁজুন"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C0001A]"
                value={filters.phone}
                onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
              />
            </div>
            <select
              className="w-full md:w-48 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C0001A]"
              value={filters.blood}
              onChange={(e) => setFilters({ ...filters, blood: e.target.value })}
            >
              <option value="">সব রক্তের গ্রুপ</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div className="bg-red-50 text-[#C0001A] px-4 py-2 rounded-xl text-sm font-bold">
            মোট {totalCount} জন
          </div>
        </div>
      </div>

      {/* User Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C0001A]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1">{user.name}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Phone size={12} /> {user.phone}
                    </p>
                  </div>
                </div>
                <span className="bg-red-100 text-[#C0001A] px-2 py-1 rounded-lg text-xs font-bold">
                  {user.blood_group}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-600 flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400" />
                  {user.upazila}, {user.district}
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.is_donor && (
                    <span className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      <Droplet size={10} /> দাতা
                    </span>
                  )}
                  {user.is_doctor && (
                    <span className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      <Stethoscope size={10} /> ডাক্তার
                    </span>
                  )}
                  {user.is_ambulance && (
                    <span className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      <Truck size={10} /> অ্যাম্বুলেন্স
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 border-t border-gray-50 pt-2">
                  <span>💉 {user.total_donations} দান</span>
                  <span>⭐ {user.avg_rating.toFixed(1)}</span>
                  <span>📅 {new Date(user.created_at).toLocaleDateString('bn-BD')}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.is_blocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {user.is_blocked ? '🚫 ব্লকড' : '✅ সক্রিয়'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {user.is_blocked ? (
                    <button
                      onClick={() => handleUnblock(user.id)}
                      className="flex-1 bg-green-100 text-green-800 hover:bg-green-200 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={14} /> আনব্লক
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setShowBlockModal(true)
                      }}
                      className="flex-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Ban size={14} /> ব্লক
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedUser(user)
                      setShowDeleteModal(true)
                    }}
                    className="bg-red-100 text-red-800 hover:bg-red-200 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <p className="text-sm text-gray-500">
          পৃষ্ঠা <span className="font-bold text-gray-900">{page + 1}</span> / {Math.ceil(totalCount / 20)}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            disabled={(page + 1) * 20 >= totalCount}
            onClick={() => setPage(page + 1)}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {showBlockModal && selectedUser && (
        <BlockModal
          name={selectedUser.name}
          onConfirm={handleBlock}
          onClose={() => setShowBlockModal(false)}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteModal
          name={selectedUser.name}
          onConfirm={handleDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

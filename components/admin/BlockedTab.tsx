'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminTable from './AdminTable'
import { CheckCircle, Ban } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

export default function BlockedTab() {
  const toast = useToast()
  const [blockedList, setBlockedList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlockedList()
  }, [])

  const fetchBlockedList = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('blocked_phones')
        .select('*')
        .order('blocked_at', { ascending: false })

      if (error) throw error
      setBlockedList(data || [])
    } catch (error) {
      console.error('Error fetching blocked list:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnblock = async (phone: string) => {
    try {
      // Find user by phone
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('phone', phone)
        .single()
      
      if (userError) throw userError

      const { error } = await supabase.rpc('admin_unblock_user', {
        target_user_id: userData.id
      })
      
      if (error) throw error
      
      toast.success('আনব্লক করা হয়েছে ✓')
      fetchBlockedList()
    } catch (error) {
      toast.error('সমস্যা হয়েছে, আবার চেষ্টা করুন')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-3">
        <div className="bg-red-100 p-3 rounded-xl text-red-600">
          <Ban size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">ব্লকড ফোন লিস্ট</h3>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C0001A]"></div>
        </div>
      ) : (
        <AdminTable headers={['ফোন নম্বর', 'কারণ', 'ব্লক তারিখ', 'কাজ']}>
          {blockedList.map((item) => (
            <tr key={item.phone} className="hover:bg-orange-50 transition-colors">
              <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.phone}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{item.reason}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(item.blocked_at).toLocaleDateString('bn-BD')}
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => handleUnblock(item.phone)}
                  className="bg-green-100 text-green-800 hover:bg-green-200 rounded-lg px-4 py-2 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <CheckCircle size={14} /> আনব্লক করুন
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  )
}

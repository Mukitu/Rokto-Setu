'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { BloodRequest } from '@/types'
import AdminTable from './AdminTable'
import { Trash2, Filter } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

export default function RequestsTab() {
  const toast = useToast()
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchRequests()
  }, [statusFilter])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('blood_requests')
        .select(`
          *,
          requester:users!blood_requests_requester_id_fkey(name, phone),
          donor:users!blood_requests_donor_id_fkey(name, phone)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query
      if (error) throw error
      setRequests(data as BloodRequest[])
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (requestId: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে আপনি এই অনুরোধটি মুছে ফেলতে চান?')) return
    try {
      const { error } = await supabase
        .from('blood_requests')
        .delete()
        .eq('id', requestId)
      if (error) throw error
      toast.success('মুছে ফেলা হয়েছে ✓')
      fetchRequests()
    } catch (error) {
      toast.error('সমস্যা হয়েছে, আবার চেষ্টা করুন')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full text-xs font-bold">⏳ অপেক্ষায়</span>
      case 'accepted':
        return <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-bold">✅ গৃহীত</span>
      case 'declined':
        return <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-xs font-bold">❌ প্রত্যাখ্যাত</span>
      default:
        return <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">রক্তের অনুরোধসমূহ</h3>
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-gray-400" />
          <select
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#C0001A]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">সব অবস্থা</option>
            <option value="pending">অপেক্ষমান</option>
            <option value="accepted">গৃহীত</option>
            <option value="declined">প্রত্যাখ্যাত</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C0001A]"></div>
        </div>
      ) : (
        <AdminTable headers={['অনুরোধকারী', 'ডোনার', 'রক্ত', 'রোগী', 'হাসপাতাল', 'অবস্থা', 'তারিখ', 'কাজ']}>
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-orange-50 transition-colors">
              <td className="px-6 py-4 text-sm">
                <div className="font-medium text-gray-900">{req.requester?.name}</div>
                <div className="text-xs text-gray-500">{req.requester?.phone}</div>
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="font-medium text-gray-900">{req.donor?.name}</div>
                <div className="text-xs text-gray-500">{req.donor?.phone}</div>
              </td>
              <td className="px-6 py-4 text-sm">
                <span className="bg-red-100 text-[#C0001A] px-2 py-1 rounded-full text-xs font-bold">
                  {req.blood_group}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{req.patient_name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{req.hospital_name}</td>
              <td className="px-6 py-4 text-sm">
                {getStatusBadge(req.status)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(req.created_at).toLocaleDateString('bn-BD')}
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => handleDelete(req.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminTable from './AdminTable'
import { Trash2, Star } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

export default function RatingsTab() {
  const toast = useToast()
  const [ratings, setRatings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRatings()
  }, [])

  const fetchRatings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          rater:users!ratings_rater_id_fkey(name, phone),
          receiver:users!ratings_receiver_id_fkey(name, phone)
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setRatings(data || [])
    } catch (error) {
      console.error('Error fetching ratings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (ratingId: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে আপনি এই রেটিংটি মুছে ফেলতে চান?')) return
    try {
      const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('id', ratingId)
      if (error) throw error
      toast.success('মুছে ফেলা হয়েছে ✓')
      fetchRatings()
    } catch (error) {
      toast.error('সমস্যা হয়েছে, আবার চেষ্টা করুন')
    }
  }

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star 
            key={s} 
            size={14} 
            className={s <= count ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-gray-300'} 
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900">ব্যবহারকারী রেটিং</h3>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C0001A]"></div>
        </div>
      ) : (
        <AdminTable headers={['রেটার', 'যাকে দিয়েছে', 'তারকা', 'মন্তব্য', 'তারিখ', 'কাজ']}>
          {ratings.map((rating) => (
            <tr key={rating.id} className={`hover:bg-orange-50 transition-colors ${rating.stars <= 2 ? 'bg-red-50/50' : ''}`}>
              <td className="px-6 py-4 text-sm">
                <div className="font-medium text-gray-900">{rating.rater?.name}</div>
                <div className="text-xs text-gray-500">{rating.rater?.phone}</div>
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="font-medium text-gray-900">{rating.receiver?.name}</div>
                <div className="text-xs text-gray-500">{rating.receiver?.phone}</div>
              </td>
              <td className="px-6 py-4 text-sm">
                {renderStars(rating.stars)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{rating.comment}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(rating.created_at).toLocaleDateString('bn-BD')}
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => handleDelete(rating.id)}
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

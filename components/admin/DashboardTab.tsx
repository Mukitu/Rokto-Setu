'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import StatsCard from './StatsCard'
import AdminTable from './AdminTable'
import { User } from '@/types'

export default function DashboardTab() {
  const [stats, setStats] = useState<any>(null)
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const { data: statsData, error: statsError } = await supabase.rpc('get_admin_stats')
      if (statsError) throw statsError
      setStats(statsData)

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      if (usersError) throw usersError
      setRecentUsers(usersData as User[])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C0001A]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard number={stats?.total_users || 0} label="মোট ব্যবহারকারী" />
        <StatsCard number={stats?.total_donors || 0} label="রক্তদাতা" />
        <StatsCard number={stats?.total_doctors || 0} label="ডাক্তার" />
        <StatsCard number={stats?.total_ambulances || 0} label="অ্যাম্বুলেন্স" />
        <StatsCard number={stats?.today_requests || 0} label="আজকের অনুরোধ" />
        <StatsCard number={stats?.accepted_requests || 0} label="গৃহীত অনুরোধ" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">সাম্প্রতিক রেজিস্ট্রেশন</h3>
        <AdminTable headers={['নাম', 'ফোন', 'রক্ত', 'জেলা', 'তারিখ']}>
          {recentUsers.map((user) => (
            <tr key={user.id} className="hover:bg-orange-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
              <td className="px-6 py-4 text-sm">
                <span className="bg-red-100 text-[#C0001A] px-2 py-1 rounded-full text-xs font-bold">
                  {user.blood_group}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.district}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(user.created_at).toLocaleDateString('bn-BD')}
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  )
}

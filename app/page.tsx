'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Droplet, Stethoscope, Truck } from 'lucide-react'
import { BLOOD_GROUPS, DISTRICTS } from '@/lib/constants'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()
  const [bloodGroup, setBloodGroup] = useState('')
  const [district, setDistrict] = useState('')
  const [stats, setStats] = useState({ users: 0, donors: 0 })

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, donorsRes] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact', head: true }),
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('is_donor', true),
        ])

        setStats({
          users: usersRes.count || 0,
          donors: donorsRes.count || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?type=blood&bloodGroup=${encodeURIComponent(bloodGroup)}&district=${encodeURIComponent(district)}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">রক্ত দিন, জীবন বাঁচান</h1>
          <p className="text-lg md:text-xl mb-10 opacity-90">
            আপনার এক ফোঁটা রক্ত হতে পারে একটি মুমূর্ষু রোগীর জীবন বাঁচানোর কারণ।
          </p>

          {/* Search Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">জেলা নির্বাচন করুন</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Search size={20} />
                খুঁজুন
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.users}</h3>
              <p className="text-gray-600 font-medium">মোট ব্যবহারকারী</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                <Droplet size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.donors}</h3>
              <p className="text-gray-600 font-medium">নিবন্ধিত রক্তদাতা</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">আমাদের সেবাসমূহ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-6">
                <Droplet size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">রক্তদাতা খুঁজুন</h3>
              <p className="text-gray-600 mb-6">
                আপনার এলাকার আশেপাশে জরুরি মুহূর্তে রক্তদাতা খুঁজে পেতে আমাদের সার্চ ব্যবহার করুন।
              </p>
              <button onClick={() => router.push('/search?type=blood')} className="text-red-600 font-semibold hover:text-red-700">
                খুঁজুন &rarr;
              </button>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-6">
                <Stethoscope size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">ডাক্তার খুঁজুন</h3>
              <p className="text-gray-600 mb-6">
                আপনার প্রয়োজনীয় বিশেষজ্ঞ ডাক্তার খুঁজে পেতে এবং সিরিয়াল দিতে আমাদের প্ল্যাটফর্ম ব্যবহার করুন।
              </p>
              <button onClick={() => router.push('/search?type=doctor')} className="text-blue-600 font-semibold hover:text-blue-700">
                খুঁজুন &rarr;
              </button>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-50 text-yellow-600 mb-6">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">অ্যাম্বুলেন্স খুঁজুন</h3>
              <p className="text-gray-600 mb-6">
                জরুরি মুহূর্তে আপনার নিকটস্থ অ্যাম্বুলেন্স খুঁজে পেতে আমাদের ডিরেক্টরি ব্যবহার করুন।
              </p>
              <button onClick={() => router.push('/search?type=ambulance')} className="text-yellow-600 font-semibold hover:text-yellow-700">
                খুঁজুন &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">কীভাবে কাজ করে?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">১</div>
              <h3 className="text-xl font-bold mb-2">সার্চ করুন</h3>
              <p className="text-gray-600">আপনার প্রয়োজনীয় রক্তের গ্রুপ এবং জেলা নির্বাচন করে সার্চ করুন।</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">২</div>
              <h3 className="text-xl font-bold mb-2">যোগাযোগ করুন</h3>
              <p className="text-gray-600">রক্তদাতার প্রোফাইল দেখে সরাসরি কল করুন বা অনুরোধ পাঠান।</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">৩</div>
              <h3 className="text-xl font-bold mb-2">রক্ত গ্রহণ করুন</h3>
              <p className="text-gray-600">রক্তদাতা সম্মত হলে নির্ধারিত স্থানে রক্ত গ্রহণ করুন।</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

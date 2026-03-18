'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { DollarSign, Save } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

export default function AdsenseTab() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    adsense_publisher_id: '',
    adsense_slot_header: '',
    adsense_slot_infeed: '',
    adsense_slot_profile: '',
    adsense_enabled: 'false'
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('admin_settings')
        .select('*')
      
      if (data) {
        const map: any = { ...settings }
        data.forEach(row => {
          if (row.key in map) map[row.key] = row.value
        })
        setSettings(map)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const upserts = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('admin_settings')
        .upsert(upserts)

      if (error) throw error
      toast.success('সেভ হয়েছে ✓')
    } catch (error) {
      toast.error('সমস্যা হয়েছে, আবার চেষ্টা করুন')
    } finally {
      setSaving(false)
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
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
            <DollarSign size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">💰 Google AdSense সেটিংস</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Publisher ID</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-sm"
              placeholder="ca-pub-XXXXXXXXXXXXXXXXX"
              value={settings.adsense_publisher_id}
              onChange={(e) => setSettings({ ...settings, adsense_publisher_id: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Header Slot ID</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-sm"
              placeholder="XXXXXXXXXX"
              value={settings.adsense_slot_header}
              onChange={(e) => setSettings({ ...settings, adsense_slot_header: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">In-feed Slot ID</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-sm"
              placeholder="XXXXXXXXXX"
              value={settings.adsense_slot_infeed}
              onChange={(e) => setSettings({ ...settings, adsense_slot_infeed: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Page Slot ID</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-sm"
              placeholder="XXXXXXXXXX"
              value={settings.adsense_slot_profile}
              onChange={(e) => setSettings({ ...settings, adsense_slot_profile: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="text-sm font-semibold text-gray-700">AdSense চালু/বন্ধ</span>
            <button
              onClick={() => setSettings({ ...settings, adsense_enabled: settings.adsense_enabled === 'true' ? 'false' : 'true' })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.adsense_enabled === 'true' ? 'bg-[#C0001A]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.adsense_enabled === 'true' ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#C0001A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#8B0000] transition-colors shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
          >
            {saving ? 'সেভ হচ্ছে...' : <><Save size={18} /> সেভ করুন</>}
          </button>
        </div>
      </div>
    </div>
  )
}

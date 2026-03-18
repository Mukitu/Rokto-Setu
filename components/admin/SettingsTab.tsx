'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Settings, Save, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

export default function SettingsTab() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    site_name: 'রক্তসেতু',
    site_tagline: 'রক্ত দিন, জীবন বাঁচান',
    contact_email: 'contact@roktosetu.app',
    contact_phone: '01XXXXXXXXX',
    maintenance_mode: 'false'
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
          <div className="bg-red-100 p-3 rounded-xl text-red-600">
            <Settings size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">⚙️ সাইট সেটিংস</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">সাইটের নাম</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-sm"
              placeholder="রক্তসেতু"
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ট্যাগলাইন</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-sm"
              placeholder="রক্ত দিন, জীবন বাঁচান"
              value={settings.site_tagline}
              onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">যোগাযোগ ইমেইল</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-sm"
              placeholder="contact@roktosetu.app"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">যোগাযোগ ফোন</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-sm"
              placeholder="01XXXXXXXXX"
              value={settings.contact_phone}
              onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={20} />
              <div>
                <span className="text-sm font-bold text-red-900">রক্ষণাবেক্ষণ মোড</span>
                <p className="text-[10px] text-red-700">চালু করলে সাইট বন্ধ দেখাবে</p>
              </div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, maintenance_mode: settings.maintenance_mode === 'true' ? 'false' : 'true' })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenance_mode === 'true' ? 'bg-[#C0001A]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenance_mode === 'true' ? 'left-7' : 'left-1'}`} />
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

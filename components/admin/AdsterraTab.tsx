'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Globe, Save, Info } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

export default function AdsterraTab() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    adsterra_header: '',
    adsterra_infeed: '',
    adsterra_footer: '',
    adsterra_popunder: '',
    adsterra_enabled: 'false'
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
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Globe size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">🌐 Adsterra সেটিংস</h3>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 flex items-start gap-3">
          <Info size={20} className="text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-700">📌 Adsterra থেকে ad code কপি করে paste করুন</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Header Ad Code</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-xs font-mono h-24"
              placeholder="Paste code here..."
              value={settings.adsterra_header}
              onChange={(e) => setSettings({ ...settings, adsterra_header: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">In-feed Ad Code</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-xs font-mono h-24"
              placeholder="Paste code here..."
              value={settings.adsterra_infeed}
              onChange={(e) => setSettings({ ...settings, adsterra_infeed: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Footer Ad Code</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-xs font-mono h-24"
              placeholder="Paste code here..."
              value={settings.adsterra_footer}
              onChange={(e) => setSettings({ ...settings, adsterra_footer: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Popunder / Social Bar Code</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-xs font-mono h-24"
              placeholder="Paste code here..."
              value={settings.adsterra_popunder}
              onChange={(e) => setSettings({ ...settings, adsterra_popunder: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="text-sm font-semibold text-gray-700">Adsterra চালু/বন্ধ</span>
            <button
              onClick={() => setSettings({ ...settings, adsterra_enabled: settings.adsterra_enabled === 'true' ? 'false' : 'true' })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.adsterra_enabled === 'true' ? 'bg-[#C0001A]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.adsterra_enabled === 'true' ? 'left-7' : 'left-1'}`} />
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

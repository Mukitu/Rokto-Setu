'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Image as ImageIcon, Save, Info, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

export default function BannersTab() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    banner1_image: '', banner1_link: '', banner1_alt: '', banner1_enabled: 'false',
    banner2_image: '', banner2_link: '', banner2_alt: '', banner2_enabled: 'false',
    banner3_image: '', banner3_link: '', banner3_alt: '', banner3_enabled: 'false'
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

  const BannerForm = ({ num, title }: { num: number, title: string }) => {
    const imgKey = `banner${num}_image` as keyof typeof settings
    const linkKey = `banner${num}_link` as keyof typeof settings
    const altKey = `banner${num}_alt` as keyof typeof settings
    const enabledKey = `banner${num}_enabled` as keyof typeof settings

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-900">{title}</h4>
          <button
            onClick={() => setSettings({ ...settings, [enabledKey]: settings[enabledKey] === 'true' ? 'false' : 'true' })}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings[enabledKey] === 'true' ? 'bg-[#C0001A]' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[enabledKey] === 'true' ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Image URL</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-sm"
                placeholder="https://example.com/banner.jpg"
                value={settings[imgKey]}
                onChange={(e) => setSettings({ ...settings, [imgKey]: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Click Link</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-sm"
                placeholder="https://example.com"
                value={settings[linkKey]}
                onChange={(e) => setSettings({ ...settings, [linkKey]: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Alt Text</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-sm"
                placeholder="Banner description"
                value={settings[altKey]}
                onChange={(e) => setSettings({ ...settings, [altKey]: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-4 min-h-[150px]">
            {settings[imgKey] ? (
              <div className="relative group w-full h-full">
                <img 
                  src={settings[imgKey]} 
                  alt="Preview" 
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x150?text=Invalid+Image+URL')}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <a href={settings[imgKey]} target="_blank" rel="noreferrer" className="text-white flex items-center gap-1 text-xs font-bold">
                    <ExternalLink size={14} /> View Full
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Image Preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C0001A]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-3 rounded-xl text-green-600">
            <ImageIcon size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">🖼️ বিজ্ঞাপন ব্যানার</h3>
        </div>
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 flex items-start gap-3">
          <Info size={20} className="text-green-600 mt-0.5" />
          <p className="text-sm text-green-700">📌 ছবির direct link দিন। Enable করলে সাইটে দেখাবে।</p>
        </div>

        <div className="space-y-6">
          <BannerForm num={1} title="ব্যানার ১ (Header এর নিচে)" />
          <BannerForm num={2} title="ব্যানার ২ (Results এর মাঝে)" />
          <BannerForm num={3} title="ব্যানার ৩ (Footer এর উপরে)" />

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#C0001A] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#8B0000] transition-colors shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 text-lg"
          >
            {saving ? 'সেভ হচ্ছে...' : <><Save size={20} /> সব সেভ করুন</>}
          </button>
        </div>
      </div>
    </div>
  )
}

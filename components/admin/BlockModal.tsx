'use client'

import { useState } from 'react'
import { X, Ban } from 'lucide-react'

interface BlockModalProps {
  name: string
  onConfirm: (reason: string) => void
  onClose: () => void
}

const reasons = [
  'ভুয়া অ্যাকাউন্ট',
  'স্প্যাম করেছে',
  'অপব্যবহার করেছে',
  'ভুল তথ্য দিয়েছে',
  'অন্য কারণ'
]

export default function BlockModal({ name, onConfirm, onClose }: BlockModalProps) {
  const [reason, setReason] = useState(reasons[0])
  const [customReason, setCustomReason] = useState('')

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
            <Ban size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">🚫 ব্লক করুন</h3>
        </div>

        <p className="text-gray-600 mb-6">
          <span className="font-bold text-gray-900">{name}</span> কে ব্লক করবেন?
        </p>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">কারণ নির্বাচন করুন</label>
            <select
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              {reasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {reason === 'অন্য কারণ' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">কারণ লিখুন</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#C0001A] text-sm"
                placeholder="এখানে লিখুন..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onConfirm(reason === 'অন্য কারণ' ? customReason : reason)}
            className="flex-1 bg-[#C0001A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#8B0000] transition-colors shadow-lg shadow-red-900/20"
          >
            🚫 ব্লক করুন
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            বাতিল
          </button>
        </div>
      </div>
    </div>
  )
}

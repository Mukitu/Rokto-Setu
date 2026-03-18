'use client'

import { X, Trash2, AlertTriangle } from 'lucide-react'

interface DeleteModalProps {
  name: string
  onConfirm: () => void
  onClose: () => void
}

export default function DeleteModal({ name, onConfirm, onClose }: DeleteModalProps) {
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
          <div className="bg-red-100 p-3 rounded-xl text-red-600">
            <Trash2 size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">🗑️ মুছে ফেলুন</h3>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center gap-3 text-yellow-800 font-bold mb-1">
            <AlertTriangle size={18} />
            সতর্কতা
          </div>
          <p className="text-sm text-yellow-700">
            <span className="font-bold text-gray-900">{name}</span> এর সব ডেটা মুছবে। এটি পূর্বাবস্থায় ফেরানো যাবে না।
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
          >
            🗑️ হ্যাঁ মুছুন
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

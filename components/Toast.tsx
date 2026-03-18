'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="text-white" size={20} />
      case 'error': return <XCircle className="text-white" size={20} />
      case 'info': return <Info className="text-white" size={20} />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-green-600'
      case 'error': return 'bg-red-600'
      case 'info': return 'bg-blue-600'
    }
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      } ${getBgColor()}`}
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <p className="text-white font-bold text-sm">{message}</p>
      <button 
        onClick={() => setIsVisible(false)}
        className="ml-4 text-white/60 hover:text-white transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  )
}

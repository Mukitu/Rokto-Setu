'use client'

interface StatsCardProps {
  number: number | string
  label: string
  color?: string
}

export default function StatsCard({ number, label, color = '#C0001A' }: StatsCardProps) {
  return (
    <div 
      className="bg-white rounded-xl p-5 shadow-sm border-t-4"
      style={{ borderTopColor: color }}
    >
      <p className="text-3xl font-bold text-gray-900 mb-1">{number}</p>
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  )
}

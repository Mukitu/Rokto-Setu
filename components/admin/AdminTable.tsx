'use client'

interface AdminTableProps {
  headers: string[]
  children: React.ReactNode
}

export default function AdminTable({ headers, children }: AdminTableProps) {
  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-red-50 text-[#C0001A] font-semibold text-left">
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-4 text-sm whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  )
}

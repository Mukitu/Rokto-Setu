import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2 text-red-600">
            <Heart className="h-6 w-6 fill-current" />
            <span className="text-xl font-bold">রক্তসেতু</span>
          </div>
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} রক্তসেতু. সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  )
}

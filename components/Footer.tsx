import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">NaviGo</span>
            <span className="text-sm text-gray-500">© {new Date().getFullYear()}</span>
          </div>
          
          <nav className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <a 
              href="mailto:support@navigo.com" 
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Support
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
} 
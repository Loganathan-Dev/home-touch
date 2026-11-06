import Link from 'next/link';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-[#0F172A] text-gray-400 py-12 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-brand-lavender-main text-white rounded-lg flex items-center justify-center text-lg">H</span>
            Home<span className="text-brand-orange-main">Match</span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            The easiest way to buy, sell, and rent properties. Discover verified listings across top cities in India.
          </p>
          {/* Social Icons */}
          <div className="flex gap-4 mt-2">
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-lavender-main hover:text-white transition">f</a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-lavender-main hover:text-white transition">𝕏</a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-lavender-main hover:text-white transition">in</a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-lavender-main hover:text-white transition">ig</a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Explore</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/properties" className="hover:text-brand-orange-main transition-colors">Browse Properties</Link></li>
            <li><Link href="/properties?listing_type=Rent" className="hover:text-brand-orange-main transition-colors">Rent a Home</Link></li>
            <li><Link href="/properties?listing_type=Sale" className="hover:text-brand-orange-main transition-colors">Buy a Home</Link></li>
            <li><Link href="/login" className="hover:text-brand-orange-main transition-colors">Login</Link></li>
            <li><Link href="/register" className="hover:text-brand-orange-main transition-colors">Create an Account</Link></li>
          </ul>
        </div>

        {/* For Owners */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">For Owners</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/add-property" className="hover:text-brand-orange-main transition-colors">Post a Property</Link></li>
            <li><Link href="/my-properties" className="hover:text-brand-orange-main transition-colors">My Properties</Link></li>
            <li><Link href="/received-inquiries" className="hover:text-brand-orange-main transition-colors">Manage Leads</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">📧 <a href="mailto:support@homematch.com" className="hover:text-brand-orange-main transition">support@homematch.com</a></li>
            <li className="flex items-center gap-2">📞 <a href="tel:+919876543210" className="hover:text-brand-orange-main transition">+91 98765 43210</a></li>
            <li className="flex items-start gap-2">📍 <span>123 Tech Park,<br/>Chennai, India 600001</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© {currentYear} HomeMatch. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}
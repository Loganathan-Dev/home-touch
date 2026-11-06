'use client';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-brand-grey-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 md:py-4 flex justify-between items-center">
        
        {/* Logo - Mobile Responsive */}
        <Link href="/" className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-lavender-main tracking-tight flex items-center gap-1.5 md:gap-2 group">
          <span className="w-8 h-8 md:w-10 md:h-10 bg-brand-lavender-main text-white rounded-lg md:rounded-xl flex items-center justify-center text-base md:text-xl shadow-md group-hover:scale-105 transition-transform">
            H
          </span>
          Home<span className="text-brand-orange-main">Match</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm lg:text-base font-medium text-brand-grey-800">
          <Link 
            href="/properties" 
            className={`transition-colors relative pb-1 ${isActive('/properties') ? 'text-brand-lavender-main font-bold border-b-2 border-brand-lavender-main' : 'hover:text-brand-lavender-main'}`}
          >
            Browse Properties
          </Link>
          
          {user ? (
            <>
              {/* OWNER VIEW */}
              {user.role === 'owner' && (
                <>
                  <Link 
                    href="/my-properties" 
                    className={`transition-colors relative pb-1 ${isActive('/my-properties') ? 'text-brand-lavender-main font-bold border-b-2 border-brand-lavender-main' : 'hover:text-brand-lavender-main'}`}
                  >
                    My Properties
                  </Link>
                  <Link 
                    href="/received-inquiries" 
                    className={`transition-colors relative pb-1 ${isActive('/received-inquiries') ? 'text-brand-lavender-main font-bold border-b-2 border-brand-lavender-main' : 'hover:text-brand-lavender-main'}`}
                  >
                    Leads
                  </Link>
                  <Link 
                    href="/add-property" 
                    className="bg-brand-orange-main text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg lg:rounded-xl hover:bg-brand-orange-hover transition-all shadow-md hover:shadow-lg font-semibold flex items-center gap-1 transform hover:-translate-y-0.5 text-sm lg:text-base"
                  >
                    + Post Property
                  </Link>
                </>
              )}

              {/* BUYER VIEW */}
              {user.role === 'buyer' && (
                <Link 
                  href="/my-inquiries" 
                  className={`transition-colors relative pb-1 ${isActive('/my-inquiries') ? 'text-brand-lavender-main font-bold border-b-2 border-brand-lavender-main' : 'hover:text-brand-lavender-main'}`}
                >
                  My Inquiries
                </Link>
              )}

              {/* USER PROFILE */}
              <div className="border-l border-brand-grey-200 pl-4 lg:pl-6 flex items-center gap-3 lg:gap-4">
                <div className="flex flex-col items-end leading-tight">
                  <span className="font-bold text-brand-grey-800 text-sm lg:text-base">Hi, {user.name.split(' ')[0]}</span>
                  <span className="text-[10px] lg:text-xs uppercase tracking-wider text-gray-500 font-bold">{user.role}</span>
                </div>
                <button 
                  onClick={logout} 
                  className="bg-brand-grey-50 border border-brand-grey-200 text-brand-grey-800 px-3 lg:px-5 py-1.5 lg:py-2 rounded-md lg:rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors text-xs lg:text-sm font-bold"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 lg:gap-4 border-l border-brand-grey-200 pl-4 lg:pl-6">
              <Link href="/login" className="hover:text-brand-lavender-main transition font-semibold text-sm lg:text-base">
                Login
              </Link>
              <Link href="/register" className="bg-brand-lavender-main text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg lg:rounded-xl hover:bg-brand-lavender-dark transition-all shadow-md hover:shadow-lg font-semibold text-sm lg:text-base transform hover:-translate-y-0.5">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-brand-grey-50 text-brand-lavender-main text-2xl hover:bg-brand-grey-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-brand-grey-100 shadow-xl transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="flex flex-col p-3 space-y-1">
          
          {/* Browse */}
          <Link 
            href="/properties" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`px-4 py-3.5 rounded-lg font-semibold text-sm transition-colors ${
              isActive('/properties') 
                ? 'bg-brand-lavender-light text-brand-lavender-main' 
                : 'hover:bg-brand-grey-50 text-brand-grey-800'
            }`}
          >
            Browse Properties
          </Link>
          
          {user ? (
            <>
              {/* Owner Links */}
              {user.role === 'owner' && (
                <>
                  <Link 
                    href="/my-properties" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className={`px-4 py-3.5 rounded-lg font-semibold text-sm transition-colors ${
                      isActive('/my-properties') 
                        ? 'bg-brand-lavender-light text-brand-lavender-main' 
                        : 'hover:bg-brand-grey-50 text-brand-grey-800'
                    }`}
                  >
                    My Properties
                  </Link>
                  <Link 
                    href="/received-inquiries" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className={`px-4 py-3.5 rounded-lg font-semibold text-sm transition-colors ${
                      isActive('/received-inquiries') 
                        ? 'bg-brand-lavender-light text-brand-lavender-main' 
                        : 'hover:bg-brand-grey-50 text-brand-grey-800'
                    }`}
                  >
                    Leads
                  </Link>
                  <Link 
                    href="/add-property" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="bg-brand-orange-main text-white text-center px-4 py-3.5 rounded-lg font-bold shadow-sm mt-2 text-sm"
                  >
                    + Post Property
                  </Link>
                </>
              )}

              {/* Buyer Links */}
              {user.role === 'buyer' && (
                <Link 
                  href="/my-inquiries" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`px-4 py-3.5 rounded-lg font-semibold text-sm transition-colors ${
                    isActive('/my-inquiries') 
                      ? 'bg-brand-lavender-light text-brand-lavender-main' 
                      : 'hover:bg-brand-grey-50 text-brand-grey-800'
                  }`}
                >
                  My Inquiries
                </Link>
              )}

              {/* Mobile User Card */}
              <div className="border-t border-brand-grey-100 mt-3 pt-4 px-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-brand-grey-800 text-sm">{user.name}</p>
                    <p className="text-[10px] text-brand-lavender-main font-bold uppercase tracking-wider">{user.role}</p>
                  </div>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-xs border border-red-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 border-t border-brand-grey-100 pt-4 mt-2 px-2">
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="px-4 py-3 text-center rounded-lg border border-brand-grey-200 text-brand-grey-800 font-bold text-sm"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="bg-brand-lavender-main text-white text-center px-4 py-3 rounded-lg font-bold shadow-sm text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
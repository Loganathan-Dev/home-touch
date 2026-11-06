'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'buyer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-select role from URL (?role=owner)
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'owner' || roleParam === 'buyer') {
      setFormData(prev => ({ ...prev, role: roleParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      // Save success toast
      alert('Account created successfully! Please login.');
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-grey-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          
          {/* HEADER */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-brand-grey-800">Create Your Account</h1>
            <p className="text-sm text-gray-500 mt-2">
              Join HomeMatch and find your perfect place.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-brand-grey-100">
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg mb-5 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ROLE SELECTOR */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'buyer' })}
                    className={`p-3 rounded-xl border-2 text-left transition ${
                      formData.role === 'buyer'
                        ? 'border-brand-lavender-main bg-brand-lavender-light/50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">🔍</span>
                    <p className="font-bold text-sm mt-1">Buyer</p>
                    <p className="text-[10px] text-gray-500">Looking for a home</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'owner' })}
                    className={`p-3 rounded-xl border-2 text-left transition ${
                      formData.role === 'owner'
                        ? 'border-brand-orange-main bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">🏠</span>
                    <p className="font-bold text-sm mt-1">Owner</p>
                    <p className="text-[10px] text-gray-500">Listing properties</p>
                  </button>
                </div>
              </div>

              {/* FULL NAME */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-lavender-main outline-none transition"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-lavender-main outline-none transition"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-lavender-main outline-none transition"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-lavender-main outline-none transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-semibold"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Use 6+ characters for security.
                </p>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-lavender-main text-white py-3.5 rounded-xl font-bold text-sm hover:bg-brand-lavender-dark transition shadow-md disabled:opacity-60 flex justify-center items-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* LOGIN LINK */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-brand-orange-main hover:underline">
                Login here
              </Link>
            </p>
          </div>

          {/* BOTTOM TRUST TEXT */}
          <p className="text-center text-xs text-gray-400 mt-6">
            By registering, you agree to our{' '}
            <Link href="#" className="underline">Terms</Link> and{' '}
            <Link href="#" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-lavender-main border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <RegisterFormContent />
    </Suspense>
  );
}
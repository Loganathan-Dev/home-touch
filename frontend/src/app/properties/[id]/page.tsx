'use client';
import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

function PropertyDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [property, setProperty] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!id) return;

    api.get(`/properties/${id}`).then(res => {
      setProperty(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));

    api.get(`/properties/${id}/similar`).then(res => setSimilar(res.data.data));
  }, [id]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to contact the owner.");
      router.push('/login');
      return;
    }
    
    setInquiryStatus('loading');
    try {
      await api.post('/inquiries', { property_id: id, message });
      setInquiryStatus('success');
      setMessage('');
    } catch (err: any) {
      setInquiryStatus('error');
      setErrorMsg(err.response?.data?.message || 'Failed to send inquiry');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-lavender-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-lavender-main font-bold">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">🏚️</p>
          <h2 className="text-2xl font-bold text-brand-grey-800">Property not found</h2>
          <Link href="/properties" className="mt-4 inline-block text-brand-lavender-main font-semibold hover:underline">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-grey-50 relative pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* LEFT: Images & Details */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            
            {/* IMAGE */}
            <div className="bg-gray-200 h-64 md:h-[450px] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm relative">
               <img 
                 src={property.main_image || 'https://placehold.co/800x600?text=No+Image'} 
                 alt={property.title} 
                 className="w-full h-full object-cover" 
                 onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x600?text=No+Image'; }}
               />
               <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-brand-orange-main text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full font-bold shadow-lg text-sm md:text-lg">
                 For {property.listing_type}
               </div>
               <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-black/60 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full font-semibold text-xs md:text-sm capitalize">
                 {property.property_type}
               </div>
            </div>

            {/* TITLE & DETAILS */}
            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-brand-grey-100">
              <h1 className="text-2xl md:text-4xl font-bold text-brand-grey-800 mb-2 md:mb-4">{property.title}</h1>
              <p className="text-sm md:text-xl text-gray-500 mb-4 md:mb-6">
                📍 {property.address}, {property.location}, {property.city}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-4 md:py-6 border-y">
                <div>
                  <p className="text-gray-500 text-xs md:text-base">Bedrooms</p>
                  <p className="text-xl md:text-2xl font-bold text-brand-lavender-main">{property.bedrooms} BHK</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs md:text-base">Bathrooms</p>
                  <p className="text-xl md:text-2xl font-bold text-brand-lavender-main">{property.bathrooms} Baths</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs md:text-base">Area</p>
                  <p className="text-xl md:text-2xl font-bold text-brand-lavender-main">{property.area_sqft} sqft</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs md:text-base">Furnishing</p>
                  <p className="text-lg md:text-xl font-bold text-brand-lavender-main">{property.furnishing_status || 'Unfurnished'}</p>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-brand-grey-800 mt-4 md:mt-8 mb-2 md:mb-4">About this property</h2>
              <p className="text-sm md:text-lg text-gray-600 leading-relaxed">{property.description}</p>
            </div>
          </div>

          {/* RIGHT: Price & Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-brand-grey-100 lg:sticky lg:top-28">
              <p className="text-gray-500 text-xs md:text-base mb-1">Asking Price</p>
              <p className="text-2xl md:text-4xl font-extrabold text-brand-grey-800 mb-4 md:mb-8">
                ₹{Number(property.price).toLocaleString('en-IN')}
              </p>
              
              <button 
                onClick={() => setShowModal(true)}
                className="w-full bg-brand-lavender-main hover:bg-brand-lavender-dark text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-xl transition shadow-lg shadow-brand-lavender-main/30 flex justify-center items-center gap-2"
              >
                📞 Contact Owner
              </button>
              <p className="text-xs md:text-sm text-center text-gray-400 mt-3 md:mt-4">
                🔒 Anti-spam protection active
              </p>
            </div>
          </div>
        </div>

        {/* SIMILAR PROPERTIES */}
        {similar.length > 0 && (
          <div className="mt-12 md:mt-16">
            <h2 className="text-xl md:text-3xl font-bold text-brand-grey-800 mb-4 md:mb-6">Similar Properties</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {similar.map((p: any) => (
                <Link 
                  href={`/properties/${p.id}`} 
                  key={p.id} 
                  className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="h-32 md:h-48 bg-gray-200">
                    <img 
                      src={p.main_image || 'https://placehold.co/400x300?text=No+Image'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition" 
                      alt={p.title} 
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image'; }}
                    />
                  </div>
                  <div className="p-3 md:p-5">
                    <h3 className="font-bold text-brand-grey-800 text-sm md:text-lg truncate">{p.title}</h3>
                    <p className="text-brand-orange-main font-bold text-base md:text-xl mt-1 md:mt-2">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] md:text-sm text-gray-500 mt-1 truncate">📍 {p.city}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* INQUIRY MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl md:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="bg-brand-lavender-main p-4 md:p-6 flex justify-between items-center">
              <h3 className="text-lg md:text-2xl font-bold text-white">Contact Owner</h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-white/80 hover:text-white text-2xl md:text-3xl font-bold w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            
            <div className="p-5 md:p-8">
              {inquiryStatus === 'success' ? (
                <div className="text-center py-4 md:py-6">
                  <div className="text-5xl md:text-6xl mb-4">✅</div>
                  <h4 className="text-xl md:text-2xl font-bold text-brand-grey-800 mb-2">Inquiry Sent!</h4>
                  <p className="text-sm md:text-lg text-gray-500">The owner will contact you shortly.</p>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="mt-6 md:mt-8 px-6 md:px-8 py-2.5 md:py-3 bg-gray-100 text-brand-grey-800 font-bold rounded-xl hover:bg-gray-200 text-sm md:text-base"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquiry}>
                  <p className="text-gray-500 text-sm md:text-base mb-3 md:mb-4">
                    Send a message directly to the owner.
                  </p>
                  
                  <textarea
                    required
                    placeholder="Hi, I am interested in this property..."
                    className="w-full border border-gray-300 p-3 md:p-4 rounded-xl text-sm md:text-lg h-28 md:h-32 focus:border-brand-lavender-main focus:ring-1 focus:ring-brand-lavender-main outline-none resize-none mb-4 md:mb-6"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  
                  {inquiryStatus === 'error' && (
                    <div className="bg-red-50 text-red-600 p-3 md:p-4 rounded-xl text-sm md:text-base mb-4 md:mb-6">
                      ⚠️ {errorMsg}
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={inquiryStatus === 'loading'}
                    className="w-full bg-brand-orange-main hover:bg-brand-orange-hover text-white py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition disabled:opacity-50"
                  >
                    {inquiryStatus === 'loading' ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PropertyDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-lavender-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-lavender-main font-bold">Loading Property...</p>
        </div>
      </div>
    }>
      <PropertyDetailsContent />
    </Suspense>
  );
}
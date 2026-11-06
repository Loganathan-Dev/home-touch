'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

// Helper to format date safely (avoids Next.js 16 new Date() prerender crash)
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function MyInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await api.get('/inquiries/my-inquiries');
        setInquiries(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  return (
    <div className="min-h-screen bg-brand-grey-50 pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-xs font-bold text-brand-orange-main uppercase tracking-widest mb-1">
            Buyer Dashboard
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-grey-800">
            My Inquiries
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Track the status of your property inquiries.
          </p>
        </div>

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-brand-grey-100 animate-pulse flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          
          /* EMPTY STATE */
          <div className="bg-white p-10 md:p-14 text-center rounded-3xl shadow-sm border border-brand-grey-100">
            <div className="text-5xl md:text-6xl mb-4">📬</div>
            <h2 className="text-xl md:text-2xl font-bold text-brand-grey-800 mb-2">
              No inquiries yet
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-6 max-w-md mx-auto">
              When you contact property owners, your inquiry history will appear here.
            </p>
            <Link 
              href="/properties" 
              className="inline-block bg-brand-lavender-main text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-brand-lavender-dark transition shadow-md"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          
          /* INQUIRY LIST */
          <div className="flex flex-col gap-4">
            {inquiries.map((inq: any) => (
              <div key={inq.id} className="bg-white rounded-2xl shadow-sm border border-brand-grey-100 overflow-hidden hover:shadow-md transition-shadow">
                
                {/* PROPERTY DETAILS HEADER */}
                <div className="p-5 flex flex-col sm:flex-row gap-4">
                  
                  {/* Property Thumbnail */}
                  <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={inq.main_image || 'https://placehold.co/200x200?text=Property'} 
                      alt={inq.property_title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-bold text-lg md:text-xl text-brand-grey-800 line-clamp-2">
                          {inq.property_title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide whitespace-nowrap ${
                          inq.status === 'Pending' ? 'bg-brand-orange-main text-white' :
                          inq.status === 'Contacted' ? 'bg-brand-lavender-light text-brand-lavender-main' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Inquiry sent on {formatDate(inq.created_at)}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span>📍 {inq.property_location}, {inq.property_city}</span>
                    </div>
                  </div>
                </div>

                {/* MESSAGE BODY */}
                <div className="px-5 pb-5">
                  <p className="text-sm md:text-base text-gray-700 bg-brand-grey-50 p-4 rounded-xl border-l-4 border-brand-lavender-main italic">
                    "{inq.message}"
                  </p>
                </div>
                
                {/* ACTION FOOTER */}
                <div className="bg-brand-grey-50/50 px-5 py-3 border-t border-brand-grey-100 flex justify-end">
                  <Link 
                    href={`/properties/${inq.property_id}`}
                    className="text-sm font-bold text-brand-lavender-main hover:text-brand-lavender-dark transition"
                  >
                    View Property →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
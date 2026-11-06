'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

// Safe date formatter
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export default function ReceivedInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/inquiries/received');
      setInquiries(res.data.data);
    } catch (err: any) {
      if (err.response?.status !== 401) {
        console.error("Failed to fetch inquiries:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/inquiries/${id}/status`, { status: newStatus });
      setInquiries(inquiries.map((inq: any) => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-brand-grey-50 pb-20">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        
        {/* HEADER */}
        <div className="mb-6 md:mb-8">
          <p className="text-xs font-bold text-brand-orange-main uppercase tracking-widest mb-1">
            Owner Dashboard
          </p>
          <h1 className="text-2xl md:text-4xl font-extrabold text-brand-grey-800">
            Received Leads
          </h1>
          <p className="text-sm text-gray-500 mt-1 md:mt-2">
            Respond to buyers who are interested in your properties.
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
            <div className="text-5xl md:text-6xl mb-4">📭</div>
            <h2 className="text-xl md:text-2xl font-bold text-brand-grey-800 mb-2">
              No leads yet
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-6 max-w-md mx-auto">
              When buyers are interested in your properties, their inquiries will appear here.
            </p>
            <Link 
              href="/my-properties" 
              className="inline-block bg-brand-lavender-main text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-brand-lavender-dark transition shadow-md"
            >
              View My Properties
            </Link>
          </div>
        ) : (
          
          /* INQUIRY LIST */
          <div className="flex flex-col gap-4 md:gap-5">
            {inquiries.map((inq: any) => (
              <div 
                key={inq.id} 
                className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-brand-grey-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                
                {/* HEADER: PROPERTY + BUYER */}
                <div className="p-4 md:p-5 flex flex-col sm:flex-row gap-4">
                  
                  {/* Property Thumbnail */}
                  <div className="w-full sm:w-28 h-32 sm:h-28 bg-gray-200 rounded-xl overflow-hidden shrink-0">
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
                        <h3 className="font-bold text-base md:text-lg text-brand-grey-800 line-clamp-1">
                          {inq.property_title}
                        </h3>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide whitespace-nowrap ${
                          inq.status === 'Pending' ? 'bg-brand-orange-main text-white' :
                          inq.status === 'Contacted' ? 'bg-brand-lavender-light text-brand-lavender-main' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {inq.status}
                        </span>
                      </div>

                      {/* Buyer Info */}
                      <div className="mt-1.5">
                        <p className="text-xs md:text-sm text-gray-500">
                          From: <span className="font-semibold text-brand-grey-800">{inq.buyer_name}</span>
                        </p>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <a href={`tel:${inq.buyer_phone}`} className="text-xs text-brand-lavender-main font-medium hover:underline">
                            📞 {inq.buyer_phone}
                          </a>
                          <a href={`mailto:${inq.buyer_email}`} className="text-xs text-brand-lavender-main font-medium hover:underline">
                            ✉️ {inq.buyer_email}
                          </a>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] md:text-xs text-gray-400 mt-2">
                      Received on {formatDate(inq.created_at)}
                    </p>
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="px-4 md:px-5 pb-4">
                  <p className="text-sm md:text-base text-gray-700 bg-brand-grey-50 p-3 md:p-4 rounded-xl border-l-4 border-brand-lavender-main italic">
                    "{inq.message}"
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="px-4 md:px-5 py-3 md:py-4 bg-brand-grey-50/50 border-t border-brand-grey-100 flex flex-col sm:flex-row justify-end gap-2">
                  <button 
                    onClick={() => updateStatus(inq.id, 'Contacted')}
                    disabled={inq.status === 'Contacted'}
                    className="text-sm font-semibold bg-brand-lavender-main text-white px-5 py-2.5 rounded-xl hover:bg-brand-lavender-dark transition disabled:opacity-50 w-full sm:w-auto"
                  >
                    {inq.status === 'Contacted' ? '✓ Contacted' : 'Mark as Contacted'}
                  </button>
                  <button 
                    onClick={() => updateStatus(inq.id, 'Closed')}
                    disabled={inq.status === 'Closed'}
                    className="text-sm font-semibold bg-white border border-brand-grey-200 text-brand-grey-800 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition disabled:opacity-50 w-full sm:w-auto"
                  >
                    {inq.status === 'Closed' ? '✓ Closed' : 'Close Inquiry'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
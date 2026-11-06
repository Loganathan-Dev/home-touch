'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMyProperties = async () => {
    try {
      const res = await api.get('/properties?my_properties=true&limit=100');
      setProperties(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties(properties.filter((p: any) => p.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete. Are you the owner?');
    }
  };

  return (
    <div className="min-h-screen bg-brand-grey-50 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-brand-orange-main uppercase tracking-widest mb-1">
              Owner Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-grey-800">
              My Properties
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Manage your listings and track their status.
            </p>
          </div>
          <Link 
            href="/add-property" 
            className="bg-brand-orange-main text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-orange-hover transition shadow-md flex items-center gap-2"
          >
            <span>+</span> Add New Property
          </Link>
        </div>

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-3xl border border-brand-grey-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          
          /* EMPTY STATE */
          <div className="bg-white rounded-3xl border border-brand-grey-100 p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">🏡</div>
            <h3 className="text-2xl font-bold text-brand-grey-800 mb-2">No properties yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't listed any properties yet. Start reaching thousands of potential buyers and tenants today.
            </p>
            <Link 
              href="/add-property" 
              className="inline-block bg-brand-lavender-main text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-lavender-dark transition shadow-md"
            >
              Post Your First Property
            </Link>
          </div>
          
        ) : (
          
          /* PROPERTY GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p: any) => (
              <div 
                key={p.id} 
                className="bg-white rounded-3xl border border-brand-grey-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* IMAGE */}
                <div className="relative h-52 bg-gray-200 overflow-hidden">
                  <img 
                    src={p.main_image || 'https://placehold.co/600x400?text=No+Image'} 
                    alt={p.title} 
                    className="w-full h-full object-cover" 
                  />
                  <span className="absolute top-3 left-3 bg-brand-orange-main text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                    {p.listing_type}
                  </span>
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold shadow uppercase ${
                    p.status === 'Available' ? 'bg-green-500 text-white' : 
                    p.status === 'Sold' ? 'bg-red-500 text-white' : 
                    'bg-gray-500 text-white'
                  }`}>
                    {p.status}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-brand-grey-800 truncate mb-1">{p.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 truncate">📍 {p.location}, {p.city}</p>
                  <p className="text-xl font-extrabold text-brand-lavender-main mb-4">
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-600 border-t border-brand-grey-100 pt-3 mb-4">
                    <span>🛏 {p.bedrooms} Beds</span>
                    <span>🛁 {p.bathrooms} Baths</span>
                    <span>📐 {p.area_sqft} sqft</span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-auto">
                    <Link 
                      href={`/add-property/${p.id}`} 
                      className="flex-1 text-center bg-brand-lavender-light text-brand-lavender-main py-2.5 rounded-xl font-bold text-sm hover:bg-brand-lavender-main hover:text-white transition"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 bg-red-50 text-red-500 py-2.5 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
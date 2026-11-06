'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/services/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  location: string;
  property_type: string;
  listing_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  main_image?: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [listingType, setListingType] = useState('');
  const [page, setPage] = useState(1);

  const [mobileFilters, setMobileFilters] = useState(false);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '6',
        ...(city && { city }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(propertyType && { property_type: propertyType }),
        ...(bedrooms && { bedrooms }),
        ...(listingType && { listing_type: listingType }),
      });

      const res = await api.get(`/properties?${query}`);
      setProperties(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [page, city, minPrice, maxPrice, propertyType, bedrooms, listingType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProperties]);

  const clearFilters = () => {
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setPropertyType('');
    setBedrooms('');
    setListingType('');
    setPage(1);
  };

  const formatPrice = (price: number) => {
    return Number(price).toLocaleString('en-IN');
  };

  const activeFilters = [city, minPrice, maxPrice, propertyType, bedrooms, listingType].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
      <Navbar />

      {/* HERO SECTION - Reduced padding on mobile */}
      <section className="bg-gradient-to-r from-[#26145c] to-[#6841bd] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16">
          <div className="max-w-2xl">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[3px] text-purple-200">
              Discover your next home
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mt-3 md:mt-4 leading-tight">
              Find a place where<br />life feels like home.
            </h1>
            <p className="text-purple-100 mt-3 md:mt-4 text-xs sm:text-base">
              Explore beautiful properties, compare prices and find your perfect place with HomeMatch.
            </p>
          </div>

          {/* SEARCH BAR - Better mobile spacing */}
          <div className="mt-6 md:mt-8 bg-white rounded-xl md:rounded-2xl p-2 md:p-3 shadow-xl max-w-4xl">
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <div className="flex-1 flex items-center gap-2 md:gap-3 px-3 bg-slate-50 rounded-lg md:rounded-none md:bg-transparent">
                <span className="text-base md:text-xl">📍</span>
                <input
                  type="text"
                  placeholder="Search city, location..."
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setPage(1); }}
                  className="w-full py-3 text-xs md:text-sm text-slate-800 outline-none placeholder:text-slate-400 bg-transparent"
                />
              </div>
              <select
                value={listingType}
                onChange={(e) => { setListingType(e.target.value); setPage(1); }}
                className="sm:w-40 px-3 py-3 rounded-lg md:rounded-xl bg-slate-50 text-xs md:text-sm text-slate-700 outline-none"
              >
                <option value="">Buy or Rent</option>
                <option value="Sale">Buy</option>
                <option value="Rent">Rent</option>
              </select>
              <button
                onClick={fetchProperties}
                className="bg-[#7044d5] hover:bg-[#5831b3] text-white font-semibold px-6 md:px-8 py-3 rounded-lg md:rounded-xl transition text-xs md:text-sm"
              >
                Search Properties
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-6 mt-5 md:mt-7 text-[10px] md:text-sm text-purple-100">
            <span>✓ Verified listings</span>
            <span>✓ Easy discovery</span>
            <span>✓ Direct owner inquiries</span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <div className="flex flex-wrap justify-between items-center gap-3 md:gap-4 mb-5 md:mb-7">
          <div>
            <p className="text-[10px] md:text-sm text-slate-500">Home / Properties</p>
            <h2 className="text-xl md:text-2xl font-extrabold mt-1 md:mt-2">Explore Properties</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Find the right property for your lifestyle.</p>
          </div>
          <button
            onClick={() => setMobileFilters(!mobileFilters)}
            className="md:hidden flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold"
          >
            ⚙ Filters ({activeFilters})
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:gap-7">
          {/* FILTER SIDEBAR */}
          <aside className={`w-full md:w-72 shrink-0 ${mobileFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm sticky top-20 md:top-24">
              <div className="flex justify-between items-center border-b pb-3 md:pb-4 mb-4 md:mb-5">
                <div>
                  <h3 className="font-bold text-base md:text-lg">Filters</h3>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-1">Refine your search</p>
                </div>
                <button onClick={clearFilters} className="text-xs font-bold text-purple-600 hover:text-purple-800">
                  Clear all
                </button>
              </div>

              <div className="mb-5 md:mb-6">
                <h4 className="text-xs md:text-sm font-bold mb-2 md:mb-3">Listing Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Sale', 'Rent'].map((type) => (
                    <button
                      key={type}
                      onClick={() => { setListingType(listingType === type ? '' : type); setPage(1); }}
                      className={`py-2 md:py-2.5 rounded-lg border text-xs md:text-sm font-semibold transition ${
                        listingType === type ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-slate-200 text-slate-600 hover:border-purple-300'
                      }`}
                    >
                      {type === 'Sale' ? 'Buy' : 'Rent'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5 md:mb-6">
                <h4 className="text-xs md:text-sm font-bold mb-2 md:mb-3">Location</h4>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setPage(1); }}
                  placeholder="Enter city name"
                  className="w-full border border-slate-200 rounded-lg md:rounded-xl px-3 py-2.5 md:py-3 text-xs md:text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div className="mb-5 md:mb-6">
                <h4 className="text-xs md:text-sm font-bold mb-2 md:mb-3">Your Budget (₹)</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    className="w-1/2 min-w-0 border border-slate-200 rounded-lg px-2 py-2.5 md:py-3 text-[10px] md:text-xs outline-none focus:border-purple-500"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    className="w-1/2 min-w-0 border border-slate-200 rounded-lg px-2 py-2.5 md:py-3 text-[10px] md:text-xs outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="mb-5 md:mb-6">
                <h4 className="text-xs md:text-sm font-bold mb-2 md:mb-3">Bedrooms</h4>
                <div className="grid grid-cols-4 gap-1.5 md:gap-2">
                  {['1', '2', '3', '4'].map((b) => (
                    <button
                      key={b}
                      onClick={() => { setBedrooms(bedrooms === b ? '' : b); setPage(1); }}
                      className={`py-1.5 md:py-2 rounded-lg border text-xs md:text-sm font-medium ${
                        bedrooms === b ? 'bg-purple-600 text-white border-purple-600' : 'border-slate-200 hover:border-purple-400'
                      }`}
                    >
                      {b}+
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5 md:mb-6">
                <h4 className="text-xs md:text-sm font-bold mb-2 md:mb-3">Property Type</h4>
                <select
                  value={propertyType}
                  onChange={(e) => { setPropertyType(e.target.value); setPage(1); }}
                  className="w-full border border-slate-200 rounded-lg md:rounded-xl p-2.5 md:p-3 text-xs md:text-sm outline-none focus:border-purple-500"
                >
                  <option value="">All Property Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Residential Land">Residential Land</option>
                  <option value="Commercial Property">Commercial Property</option>
                </select>
              </div>

              <button onClick={() => setMobileFilters(false)} className="md:hidden w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-sm">
                Show Properties
              </button>
            </div>
          </aside>

          {/* PROPERTY RESULTS */}
          <section className="flex-1 min-w-0">
            <div className="flex flex-wrap justify-between items-center gap-2 md:gap-3 mb-4 md:mb-5">
              <div>
                <h3 className="font-bold text-base md:text-lg">Available Properties</h3>
                <p className="text-[10px] md:text-xs text-slate-500 mt-1">
                  {loading ? 'Searching...' : `${properties.length} properties on this page`}
                </p>
              </div>
              <span className="text-[10px] md:text-xs text-slate-500 bg-white border rounded-lg px-2.5 md:px-3 py-1.5 md:py-2">Page {page}</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-white rounded-xl md:rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 md:h-52 bg-slate-200" />
                    <div className="p-3 md:p-4 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                      <div className="h-10 bg-slate-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-xl md:rounded-2xl border p-10 md:p-12 text-center">
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">🏡</div>
                <h3 className="font-bold text-lg md:text-xl">No properties found</h3>
                <p className="text-xs md:text-sm text-slate-500 mt-2">Try changing your filters to discover more properties.</p>
                <button onClick={clearFilters} className="mt-4 md:mt-5 px-5 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-purple-600 text-white text-xs md:text-sm font-semibold">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {properties.map((p) => (
                  <article key={p.id} className="bg-white rounded-xl md:rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="relative h-44 md:h-52 overflow-hidden bg-slate-100">
                      <img
                        src={p.main_image || 'https://placehold.co/600x400?text=Property'}
                        alt={p.title}
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400?text=Property'; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 md:top-3 left-2.5 md:left-3 bg-white/95 text-purple-700 px-2.5 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg text-[9px] md:text-xs font-bold shadow-sm">
                        {p.listing_type === 'Sale' ? 'FOR SALE' : 'FOR RENT'}
                      </span>
                      <span className="absolute bottom-2.5 md:bottom-3 left-2.5 md:left-3 bg-black/60 text-white px-2.5 md:px-3 py-1 rounded-md text-[9px] md:text-xs">
                        {p.property_type}
                      </span>
                    </div>
                    <div className="p-3.5 md:p-4">
                      <div className="mb-2.5 md:mb-3">
                        <p className="text-lg md:text-xl font-extrabold text-purple-700">₹{formatPrice(p.price)}</p>
                        <h3 className="font-bold text-sm md:text-base text-slate-800 mt-1.5 md:mt-2 line-clamp-1">{p.title}</h3>
                        <p className="text-[10px] md:text-xs text-slate-500 mt-1 truncate">📍 {p.location}, {p.city}</p>
                      </div>
                      <div className="flex justify-between gap-2 py-2.5 md:py-3 border-y border-slate-100 text-center">
                        <div>
                          <p className="font-bold text-xs md:text-sm">{p.bedrooms ?? '-'}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-400">Bedrooms</p>
                        </div>
                        <div className="border-l border-slate-100 pl-3">
                          <p className="font-bold text-xs md:text-sm">{p.bathrooms ?? '-'}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-400">Bathrooms</p>
                        </div>
                        <div className="border-l border-slate-100 pl-3">
                          <p className="font-bold text-xs md:text-sm">{p.area_sqft}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-400">Sq.ft</p>
                        </div>
                      </div>
                      <p className="text-[10px] md:text-xs text-slate-500 mt-2.5 md:mt-3 line-clamp-2 min-h-8 md:min-h-9">{p.description}</p>
                      <Link href={`/properties/${p.id}`} className="mt-3.5 md:mt-4 flex justify-center items-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition">
                        View Details <span>→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="flex justify-center items-center gap-3 md:gap-4 mt-8 md:mt-10">
              <button disabled={page === 1 || loading} onClick={() => setPage((p) => p - 1)} className="px-4 md:px-5 py-2 md:py-2.5 bg-white border border-slate-200 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold disabled:opacity-40 hover:border-purple-500">
                ← Previous
              </button>
              <span className="bg-purple-100 text-purple-700 px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold text-xs md:text-sm">{page}</span>
              <button disabled={properties.length < 6 || loading} onClick={() => setPage((p) => p + 1)} className="px-4 md:px-5 py-2 md:py-2.5 bg-white border border-slate-200 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold disabled:opacity-40 hover:border-purple-500">
                Next →
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
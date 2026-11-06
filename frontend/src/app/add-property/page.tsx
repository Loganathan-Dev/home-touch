'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AddPropertyPage({ editId }: { editId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!editId);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', city: '', location: '', address: '',
    property_type: 'Apartment', listing_type: 'Sale', bedrooms: 1, bathrooms: 1,
    area_sqft: '', furnishing_status: 'Unfurnished', status: 'Available', main_image: ''
  });

  useEffect(() => {
    if (editId) {
      api.get(`/properties/${editId}`).then(res => {
        const d = res.data.data;
        setFormData({
          title: d.title || '',
          description: d.description || '',
          price: d.price || '',
          city: d.city || '',
          location: d.location || '',
          address: d.address || '',
          property_type: d.property_type || 'Apartment',
          listing_type: d.listing_type || 'Sale',
          bedrooms: d.bedrooms || 1,
          bathrooms: d.bathrooms || 1,
          area_sqft: d.area_sqft || '',
          furnishing_status: d.furnishing_status || 'Unfurnished',
          status: d.status || 'Available',
          main_image: d.main_image || ''
        });
        setLoading(false);
      }).catch(() => {
        setError('Failed to load property data');
        setLoading(false);
      });
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: formData.price ? Number(formData.price) : null,
        area_sqft: formData.area_sqft ? Number(formData.area_sqft) : null,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
      };

      if (editId) {
        await api.put(`/properties/${editId}`, payload);
        router.push('/my-properties');
      } else {
        await api.post('/properties', payload);
        router.push('/my-properties');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save property. Please check all fields.');
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-grey-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-lavender-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-lavender-main font-bold">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-grey-50 pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        
        {/* HEADER */}
        <div className="mb-6">
          <Link href="/my-properties" className="text-sm font-semibold text-brand-lavender-main hover:underline flex items-center gap-1 mb-3">
            ← Back to My Properties
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-grey-800">
            {editId ? 'Edit Property Details' : 'Post a New Property'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to {editId ? 'update' : 'publish'} your listing.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: BASIC INFO */}
          <div className="bg-white rounded-2xl border border-brand-grey-100 shadow-sm p-5 md:p-6">
            <h2 className="text-lg font-bold text-brand-grey-800 mb-4 border-b pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Property Title *</label>
                <input name="title" required className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-lavender-main outline-none" onChange={handleChange} value={formData.title} placeholder="e.g. Luxurious 3BHK Villa in Adyar" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Description *</label>
                <textarea name="description" required className="w-full border border-gray-300 p-3 rounded-xl text-sm h-28 focus:ring-2 focus:ring-brand-lavender-main outline-none resize-none" onChange={handleChange} value={formData.description} placeholder="Describe the property, nearby amenities, condition, etc." />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Property Type</label>
                <select name="property_type" className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none" onChange={handleChange} value={formData.property_type}>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Residential Land">Residential Land</option>
                  <option value="Commercial Property">Commercial Property</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Listing Type</label>
                <select name="listing_type" className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none" onChange={handleChange} value={formData.listing_type}>
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: PRICING & SIZE */}
          <div className="bg-white rounded-2xl border border-brand-grey-100 shadow-sm p-5 md:p-6">
            <h2 className="text-lg font-bold text-brand-grey-800 mb-4 border-b pb-2">Pricing & Size</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Price (₹) *</label>
                <input name="price" type="number" required className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-lavender-main outline-none" onChange={handleChange} value={formData.price} placeholder="e.g. 5000000" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Area (sq.ft) *</label>
                <input name="area_sqft" type="number" required className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-lavender-main outline-none" onChange={handleChange} value={formData.area_sqft} placeholder="e.g. 1200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Bedrooms *</label>
                <input name="bedrooms" type="number" required min="0" className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none" onChange={handleChange} value={formData.bedrooms} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Bathrooms *</label>
                <input name="bathrooms" type="number" required min="0" className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none" onChange={handleChange} value={formData.bathrooms} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Furnishing Status</label>
                <select name="furnishing_status" className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none" onChange={handleChange} value={formData.furnishing_status}>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Furnished">Furnished</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Status</label>
                <select name="status" className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none" onChange={handleChange} value={formData.status}>
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Rented">Rented</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: LOCATION */}
          <div className="bg-white rounded-2xl border border-brand-grey-100 shadow-sm p-5 md:p-6">
            <h2 className="text-lg font-bold text-brand-grey-800 mb-4 border-b pb-2">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">City *</label>
                <input name="city" required className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-lavender-main outline-none" onChange={handleChange} value={formData.city} placeholder="e.g. Chennai" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Locality / Area *</label>
                <input name="location" required className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-lavender-main outline-none" onChange={handleChange} value={formData.location} placeholder="e.g. Adyar" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Full Address *</label>
                <input name="address" required className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-lavender-main outline-none" onChange={handleChange} value={formData.address} placeholder="Flat No, Street Name, Landmark" />
              </div>
            </div>
          </div>

          {/* SECTION 4: IMAGE (WITH LIVE PREVIEW) */}
          <div className="bg-white rounded-2xl border border-brand-grey-100 shadow-sm p-5 md:p-6">
            <h2 className="text-lg font-bold text-brand-grey-800 mb-4 border-b pb-2">Property Image</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Image URL</label>
                <input name="main_image" className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-lavender-main outline-none" onChange={handleChange} value={formData.main_image} placeholder="https://images.unsplash.com/..." />
                <p className="text-[10px] text-gray-500 mt-2">
                  Paste a direct image link (from Unsplash, Imgur, or any hosting site).
                </p>
              </div>
              
              {/* LIVE PREVIEW BOX */}
              <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200">
                {formData.main_image ? (
                  <img 
                    src={formData.main_image} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300?text=Invalid+Image+URL'; }} 
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <p className="text-3xl">🖼️</p>
                    <p className="text-xs font-medium mt-1">Image Preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end gap-3 pt-2">
            <Link 
              href="/my-properties" 
              className="px-6 py-3 rounded-xl font-bold text-sm bg-white border border-brand-grey-200 text-brand-grey-800 hover:bg-brand-grey-50 transition"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-8 py-3 rounded-xl font-bold text-sm bg-brand-lavender-main text-white hover:bg-brand-lavender-dark transition shadow-md disabled:opacity-60 flex items-center gap-2"
            >
              {submitting ? 'Saving...' : (editId ? 'Save Changes' : 'Publish Property')}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
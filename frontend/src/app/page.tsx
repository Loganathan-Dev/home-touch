'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { api } from '@/services/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

const heroImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
];

const categories = [
  { label: 'Villas', type: 'Villa', icon: '🏡', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=70' },
  { label: 'Apartments', type: 'Apartment', icon: '🏢', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=70' },
  { label: 'Plots / Land', type: 'Residential Land', icon: '📐', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=70' },
  { label: 'Houses', type: 'Independent House', icon: '🏘️', img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=70' },
];

const popularCities = ['Chennai', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Coimbatore', 'Delhi', 'Kochi'];

const steps = [
  { n: '01', icon: '🔍', title: 'Search', text: 'Pick a city, budget and property type. Filters narrow it down in seconds.' },
  { n: '02', icon: '🏠', title: 'Shortlist', text: 'Save favourites, compare details and view photos, area and pricing at a glance.' },
  { n: '03', icon: '🤝', title: 'Connect', text: 'Talk directly to verified owners. No middlemen, no hidden charges.' },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Verified listings' },
  { value: 250, suffix: '+', label: 'Cities covered' },
  { value: 50000, suffix: '+', label: 'Happy buyers' },
  { value: 0, suffix: '₹', label: 'Brokerage fee', prefix: true },
];

const testimonials = [
  { name: 'Priya S.', city: 'Chennai', text: 'Found my 2BHK in under a week. Talking directly to the owner saved me a lot of money.' },
  { name: 'Arjun M.', city: 'Bengaluru', text: 'The filters are super clean and every listing felt genuine. Smooth experience.' },
  { name: 'Kavya R.', city: 'Coimbatore', text: 'Listed my villa for free and got serious enquiries within days. Highly recommend.' },
];

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

function Counter({ value, suffix = '', prefix = false }: { value: number; suffix?: string; prefix?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const duration = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        setN(Math.floor(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{prefix ? suffix : ''}{n.toLocaleString('en-IN')}{prefix ? '' : suffix}</span>;
}

export default function Home() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [listingTab, setListingTab] = useState<'Sale' | 'Rent'>('Sale');
  const [searchType, setSearchType] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [wishlist, setWishlist] = useState<Set<string | number>>(new Set());
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    api.get('/properties?limit=6')
      .then((res) => setProperties(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentImageIndex((p) => (p + 1) % heroImages.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollY(y);
      setScrollProgress(max > 0 ? (y / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goSearch = (city = searchCity) => {
    const q = new URLSearchParams();
    if (city) q.set('city', city);
    if (searchType) q.set('property_type', searchType);
    q.set('listing_type', listingTab);
    router.push(`/properties?${q.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); goSearch(); };

  const toggleWishlist = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    setWishlist((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const showStickySearch = scrollY > 520;
  const currentYear = 2026;

  return (
    <div className="min-h-screen bg-brand-grey-50 font-sans overflow-x-hidden">
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent">
        <div className="h-full bg-gradient-to-r from-brand-lavender-main to-brand-orange-main transition-[width] duration-100" style={{ width: `${scrollProgress}%` }} />
      </div>

      <Navbar />

      {/* Sticky compact search - MOBILE FIX: top-20 on mobile */}
      <div className={`fixed left-0 right-0 top-20 md:top-16 z-40 transition-all duration-300 ${showStickySearch ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="max-w-7xl mx-auto px-4 py-2">
          <form onSubmit={handleSearch} className="bg-white/90 backdrop-blur-md border border-brand-grey-100 shadow-lg rounded-full flex items-center gap-2 p-1.5 max-w-2xl mx-auto">
            <span className="pl-3 text-gray-400">🔍</span>
            <input type="text" placeholder="Search by city…" value={searchCity} onChange={(e) => setSearchCity(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none px-1 py-2" />
            <button type="submit" className="bg-brand-orange-main text-white text-sm font-bold px-6 py-2 rounded-full hover:bg-brand-orange-hover transition">Search</button>
          </form>
        </div>
      </div>

      {/* ============ 1. HERO - MOBILE FIX: reduced height */}
      <section className="relative h-[85vh] md:h-[92vh] min-h-[580px] md:min-h-[620px] flex flex-col items-center justify-center text-center px-4 pt-16 md:pt-0 overflow-hidden">
        {heroImages.map((img, i) => (
          <div key={img} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center',
              transform: `translateY(${scrollY * 0.25}px) scale(1.1)`,
            }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 max-w-4xl w-full" style={{ transform: `translateY(${scrollY * -0.08}px)`, opacity: Math.max(1 - scrollY / 700, 0) }}>
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 text-white text-[10px] md:text-xs font-semibold px-3 md:px-4 py-1.5 rounded-full mb-4 md:mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> 10,000+ verified listings
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 md:mb-5 tracking-tight leading-[1.05] drop-shadow-lg">
            Find a home that <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-brand-lavender-light to-orange-300 bg-clip-text text-transparent">fits your life.</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-200 mb-6 md:mb-10 max-w-xl mx-auto drop-shadow">
            Buy, sell or rent directly from verified owners. No brokers. No hidden fees.
          </p>

          {/* MOBILE FIX: better spacing for stacked form */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-2xl max-w-3xl mx-auto p-2.5 md:p-3 text-left">
            <div className="flex gap-1 mb-2 md:mb-3 px-1">
              {(['Sale', 'Rent'] as const).map((t) => (
                <button key={t} type="button" onClick={() => setListingTab(t)}
                  className={`px-4 md:px-5 py-1.5 rounded-full text-xs md:text-sm font-bold transition ${listingTab === t ? 'bg-brand-lavender-main text-white' : 'text-gray-600 hover:bg-brand-grey-50'}`}>
                  {t === 'Sale' ? 'Buy' : 'Rent'}
                </button>
              ))}
            </div>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 md:gap-2">
              <div className="flex-1 flex items-center gap-2 bg-brand-grey-50 rounded-xl md:rounded-2xl px-3 md:px-4 focus-within:ring-2 focus-within:ring-brand-lavender-main/30 transition">
                <span className="text-sm">📍</span>
                <input type="text" placeholder="City (e.g. Chennai)" value={searchCity} onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full py-2.5 md:py-3.5 text-xs md:text-sm text-brand-grey-800 bg-transparent outline-none" />
              </div>
              <select value={searchType} onChange={(e) => setSearchType(e.target.value)}
                className="md:w-44 bg-brand-grey-50 rounded-xl md:rounded-2xl px-3 md:px-4 py-2.5 md:py-3.5 text-xs md:text-sm text-gray-700 outline-none cursor-pointer">
                <option value="">All types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Independent House">Independent House</option>
                <option value="Residential Land">Plot / Land</option>
              </select>
              <button type="submit" className="bg-brand-orange-main text-white px-6 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm hover:bg-brand-orange-hover active:scale-95 transition shadow-md">
                Search
              </button>
            </form>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2 mt-4 md:mt-6">
            <span className="text-[10px] md:text-xs text-gray-300">Popular:</span>
            {popularCities.slice(0, 5).map((c) => (
              <button key={c} onClick={() => goSearch(c)}
                className="text-[10px] md:text-xs text-white bg-white/10 hover:bg-white/25 backdrop-blur border border-white/20 px-2.5 md:px-3 py-1 rounded-full transition">
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => setCurrentImageIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-8 bg-white' : 'w-3 bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>

        <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center text-white/70 text-[10px] tracking-widest uppercase animate-bounce">
          Scroll
          <svg className="w-4 h-4 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
        </div>
      </section>

      {/* ============ 2. CATEGORIES - MOBILE FIX: shorter aspect on mobile */}
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <Reveal>
          <div className="text-center mb-6 md:mb-10">
            <p className="text-[10px] md:text-xs font-bold text-brand-orange-main uppercase tracking-widest mb-2">Explore</p>
            <h2 className="text-xl md:text-4xl font-extrabold text-brand-grey-800">Browse by property type</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {categories.map((c, i) => (
            <Reveal key={c.type} delay={i * 80}>
              <Link href={`/properties?property_type=${encodeURIComponent(c.type)}`}
                className="group relative block aspect-square md:aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow">
                <img src={c.img} alt={c.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 flex items-end justify-between">
                  <div>
                    <div className="text-xl md:text-2xl mb-1">{c.icon}</div>
                    <h3 className="text-white font-bold text-xs md:text-lg">{c.label}</h3>
                  </div>
                  <span className="hidden md:flex w-9 h-9 rounded-full bg-white/20 backdrop-blur text-white items-center justify-center group-hover:bg-brand-orange-main group-hover:translate-x-1 transition-all">→</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ 3. FEATURED PROPERTIES ============ */}
      <section className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <Reveal>
          <div className="flex justify-between items-end mb-5 md:mb-8">
            <div>
              <p className="text-[10px] md:text-xs font-bold text-brand-orange-main uppercase tracking-widest mb-1 md:mb-2">Featured</p>
              <h2 className="text-xl md:text-4xl font-extrabold text-brand-grey-800">Recommended properties</h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Handpicked just for you</p>
            </div>
            <Link href="/properties" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand-lavender-main border border-brand-lavender-main/30 px-5 py-2.5 rounded-full hover:bg-brand-lavender-main hover:text-white transition">
              View all <span>→</span>
            </Link>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl md:rounded-3xl border border-brand-grey-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 md:p-5 space-y-3"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-1/2" /><div className="h-6 bg-gray-200 rounded w-1/3" /></div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-white rounded-2xl md:rounded-3xl border border-brand-grey-100">
            <div className="text-4xl md:text-5xl mb-3">🏠</div>
            <p className="text-sm text-gray-500">No properties available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {properties.map((p: any, i) => {
              const liked = wishlist.has(p.id);
              return (
                <Reveal key={p.id} delay={(i % 3) * 100}>
                  <article onClick={() => router.push(`/properties/${p.id}`)}
                    className="group bg-white rounded-2xl md:rounded-3xl border border-brand-grey-100 overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
                    <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                      <img src={p.main_image || 'https://via.placeholder.com/400x300'} alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute top-2.5 md:top-3 left-2.5 md:left-3 bg-brand-orange-main text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2.5 md:px-3 py-1 rounded-full shadow">
                        For {p.listing_type}
                      </span>
                      {/* MOBILE FIX: bigger touch target for wishlist */}
                      <button onClick={(e) => toggleWishlist(e, p.id)} aria-label="Save property"
                        className="absolute top-2.5 md:top-3 right-2.5 md:right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition">
                        <svg className={`w-5 h-5 ${liked ? 'text-red-500' : 'text-gray-500'}`} fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z" />
                        </svg>
                      </button>
                      <p className="absolute bottom-2.5 md:bottom-3 left-3 md:left-4 text-white text-lg md:text-xl font-extrabold drop-shadow">₹{Number(p.price).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="text-sm md:text-base font-bold text-brand-grey-800 truncate">{p.title}</h3>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-1 truncate">📍 {p.location}, {p.city}</p>
                      <div className="flex gap-1.5 md:gap-2 mt-3 md:mt-4 flex-wrap">
                        <span className="text-[9px] md:text-[11px] font-medium bg-brand-grey-50 text-gray-700 px-2.5 md:px-3 py-1 rounded-full">🛏 {p.bedrooms} Beds</span>
                        <span className="text-[9px] md:text-[11px] font-medium bg-brand-grey-50 text-gray-700 px-2.5 md:px-3 py-1 rounded-full">🛁 {p.bathrooms} Baths</span>
                        <span className="text-[9px] md:text-[11px] font-medium bg-brand-grey-50 text-gray-700 px-2.5 md:px-3 py-1 rounded-full">📐 {p.area_sqft} sqft</span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <Link href="/properties" className="inline-block text-sm font-semibold text-white bg-brand-lavender-main px-6 py-3 rounded-full">View all properties →</Link>
        </div>
      </section>

      {/* ============ 4. HOW IT WORKS ============ */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <Reveal>
          <div className="text-center mb-8 md:mb-12">
            <p className="text-[10px] md:text-xs font-bold text-brand-orange-main uppercase tracking-widest mb-2">Simple process</p>
            <h2 className="text-xl md:text-4xl font-extrabold text-brand-grey-800">How HomeMatch works</h2>
          </div>
        </Reveal>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="hidden md:block absolute top-14 left-[16%] right-[16%] border-t-2 border-dashed border-brand-lavender-main/30" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div className="relative bg-white rounded-2xl md:rounded-3xl p-5 md:p-7 text-center border border-brand-grey-100 shadow-sm hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto rounded-xl md:rounded-2xl bg-brand-lavender-light flex items-center justify-center text-2xl md:text-3xl mb-3 md:mb-4 relative z-10">{s.icon}</div>
                <span className="text-[10px] md:text-xs font-extrabold text-brand-orange-main tracking-widest">STEP {s.n}</span>
                <h3 className="text-base md:text-lg font-bold text-brand-grey-800 mt-1 mb-1 md:mb-2">{s.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ 5. STATS - MOBILE FIX: reduced gap */}
      <section className="bg-[#172339] py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl md:text-5xl font-extrabold text-white mb-1">
                <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
              </p>
              <p className="text-[10px] md:text-sm text-brand-lavender-light/80 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 6. WHY CHOOSE US ============ */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <Reveal>
          <div className="text-center mb-8 md:mb-12">
            <p className="text-[10px] md:text-xs font-bold text-brand-orange-main uppercase tracking-widest mb-2">Why us</p>
            <h2 className="text-xl md:text-4xl font-extrabold text-brand-grey-800">Why choose HomeMatch?</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-2">We make finding your next home simple and secure.</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            { icon: '🔒', title: '100% Verified', text: 'Every property listing is reviewed and verified by our team.' },
            { icon: '💬', title: 'Direct Connect', text: 'Chat and call property owners directly. Zero brokerage.' },
            { icon: '⚡', title: 'Fast & Easy', text: 'Search, filter and contact owners instantly from any device.' },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="group bg-white p-5 md:p-7 rounded-2xl md:rounded-3xl border border-brand-grey-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-lavender-light group-hover:bg-brand-lavender-main rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl mb-4 md:mb-5 transition-colors">{f.icon}</div>
                <h3 className="text-base md:text-lg font-bold text-brand-grey-800 mb-2">{f.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ 7. TESTIMONIALS ============ */}
      <section className="bg-brand-grey-100 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-8 md:mb-12">
              <p className="text-[10px] md:text-xs font-bold text-brand-orange-main uppercase tracking-widest mb-2">Testimonials</p>
              <h2 className="text-xl md:text-4xl font-extrabold text-brand-grey-800">Loved by home seekers</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-7 shadow-sm border border-brand-grey-100 h-full flex flex-col">
                  <div className="text-brand-orange-main text-base md:text-lg mb-2 md:mb-3">★★★★★</div>
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed flex-1">“{t.text}”</p>
                  <div className="flex items-center gap-3 mt-4 md:mt-6">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-lavender-main text-white font-bold flex items-center justify-center text-sm md:text-base">{t.name[0]}</div>
                    <div>
                      <p className="text-xs md:text-sm font-bold text-brand-grey-800">{t.name}</p>
                      <p className="text-[10px] md:text-xs text-gray-500">{t.city}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 8. CITIES ============ */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <Reveal>
          <h2 className="text-lg md:text-2xl font-bold text-brand-grey-800 mb-4 md:mb-5">Explore popular cities</h2>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {popularCities.map((c) => (
              <Link key={c} href={`/properties?city=${c}`}
                className="px-4 md:px-5 py-2 md:py-2.5 bg-white border border-brand-grey-100 rounded-full text-xs md:text-sm font-medium text-gray-700 hover:bg-brand-lavender-main hover:text-white hover:border-brand-lavender-main hover:-translate-y-0.5 transition-all shadow-sm">
                📍 {c}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ============ 9. CTA ============ */}
      {!user && (
        <section className="px-4 pb-12 md:pb-20">
          <Reveal>
            <div className="max-w-6xl mx-auto relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-[#172339] via-[#1f2f4d] to-brand-lavender-dark py-10 md:py-16 px-5 md:px-6 text-center">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand-orange-main/20 blur-3xl" />
              <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-brand-lavender-main/30 blur-3xl" />
              <div className="relative max-w-2xl mx-auto">
                <h2 className="text-xl md:text-4xl font-extrabold text-white mb-3 md:mb-4">Are you a property owner?</h2>
                <p className="text-brand-lavender-light text-xs md:text-base mb-5 md:mb-8 opacity-90">
                  List your property on HomeMatch for free and reach thousands of buyers.
                </p>
                <Link href="/register?role=owner"
                  className="inline-block bg-brand-orange-main text-white px-7 md:px-9 py-3 md:py-3.5 rounded-full font-bold text-xs md:text-sm hover:bg-brand-orange-hover hover:scale-105 active:scale-95 transition shadow-lg">
                  Post Property for Free →
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Back to top */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
        className={`fixed bottom-5 right-4 md:bottom-6 md:right-6 z-50 w-11 h-11 md:w-12 md:h-12 rounded-full bg-brand-lavender-main text-white shadow-xl flex items-center justify-center hover:bg-brand-lavender-dark hover:-translate-y-1 transition-all duration-300 ${scrollY > 700 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m18 15-6-6-6 6" /></svg>
      </button>
    </div>
  );
}
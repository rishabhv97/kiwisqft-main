import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, TrendingUp, Sparkles, ChevronRight, UserCheck, Phone, ShieldCheck, Home as HomeIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../src/types';

interface HomeProps {
  featuredProperties: Property[];
}

const Home: React.FC<HomeProps> = ({ featuredProperties }) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent' | 'sell'>('buy');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(4);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'rent') navigate('/rent');
    else if (activeTab === 'sell') navigate('/sell');
    else navigate('/buy');
  };

  const localities = [
    { name: 'Sector 150', count: '240+ Properties', price: '₹12k/sqft', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Sector 62', count: '180+ Properties', price: '₹10k/sqft', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Greater Noida W', count: '450+ Properties', price: '₹6k/sqft', image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Sector 137', count: '120+ Properties', price: '₹8.5k/sqft', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Sector 128', count: '95+ Properties', price: '₹15k/sqft', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Sector 44', count: '50+ Properties', price: '₹18k/sqft', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Sector 75', count: '310+ Properties', price: '₹7.5k/sqft', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Sector 18', count: '85+ Properties', price: '₹22k/sqft', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }
  ];

  const sellers = [
    {
      id: 1,
      name: 'Vaibhav Arora',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      experience: '22 Yrs',
      properties: '265',
      localities: ['Sector 150', 'Sector 137']
    },
    {
      id: 2,
      name: 'Sai Properties',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      experience: '18 Yrs',
      properties: '98',
      localities: ['Sector 62', 'Sector 18']
    },
    {
      id: 3,
      name: 'RS Associates',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      experience: '12 Yrs',
      properties: '150',
      localities: ['Greater Noida West', 'Sector 75']
    }
  ];

  return (
    <div className="bg-stone-50 min-h-screen font-sans">
      {/* Hero Section */}
      <div className="relative pt-12 pb-32 md:pb-48 px-4 rounded-b-[30px] md:rounded-b-[50px] shadow-2xl overflow-hidden bg-brand-green">
        
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Real Estate Background" 
            className="w-full h-full object-cover blur-[3px] scale-105"
          />
          {/* Dark Green/Brown Overlay for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green/90 via-emerald-900/80 to-brand-brown/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Abstract shapes for background interest */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-brand-lightGreen blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center md:text-left">
          
          <div className="flex flex-col md:items-start items-center">
            <h1 className="text-white text-2xl md:text-4xl font-semibold mb-2 drop-shadow-md">
              Properties to {activeTab === 'rent' ? 'rent' : (activeTab === 'sell' ? 'sell' : 'buy')} in <span className="font-bold">Noida</span>
            </h1>
            <p className="text-brand-lightGreen/90 text-sm md:text-base mb-6 font-medium drop-shadow-sm">
              Verified listings • 50k+ added daily
            </p>

            {/* City Pill */}
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium mb-8 border border-white/20 hover:bg-black/40 cursor-pointer transition-colors shadow-lg">
              <MapPin size={14} className="text-brand-lightGreen" />
              Noida
              <ChevronRight size={14} className="opacity-50" />
            </div>

            {/* Search Container */}
            <div className="w-full">
              {/* Tabs - Grid Layout to fill space */}
              <div className="grid grid-cols-3 gap-2 mb-0 pb-2 md:pb-0 w-full">
                {['buy', 'rent', 'sell'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-3 rounded-t-lg md:rounded-lg text-sm md:text-base font-medium transition-all capitalize flex justify-center items-center ${
                      activeTab === tab
                        ? 'bg-white text-brand-green shadow-lg transform -translate-y-1 z-10 font-bold'
                        : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative group z-20">
                <div className="bg-white p-2 rounded-2xl md:rounded-xl shadow-2xl flex items-center h-16 md:h-20 transition-transform group-hover:scale-[1.01]">
                   <div className="hidden md:flex items-center justify-center w-16 text-gray-400 border-r border-gray-100">
                     <Search size={24} />
                   </div>
                   <input
                    type="text"
                    placeholder={activeTab === 'sell' ? "Enter location to post property..." : "Search 'Sector 62', '3BHK'..."}
                    className="flex-grow bg-transparent px-4 md:px-6 text-gray-800 placeholder-gray-400 text-lg outline-none w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   />
                   <button 
                    type="submit"
                    className="bg-brand-brown hover:bg-amber-900 text-white h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-lg font-bold text-lg shadow-lg shadow-brand-brown/20 transition-all flex items-center justify-center gap-2"
                   >
                     <Search size={22} className="md:hidden" />
                     <span className="hidden md:inline">{activeTab === 'sell' ? 'Post' : 'Search'}</span>
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Box (Replaces Owner Banner) */}
      <div className="max-w-4xl mx-auto px-4 -mt-24 md:-mt-32 relative z-20">
         <div className="relative rounded-3xl p-8 md:p-12 text-center shadow-xl flex flex-col items-center border border-white/20 overflow-hidden bg-gray-900 group">
            {/* Background Image Layer */}
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
              <img 
                src="https://images.unsplash.com/photo-1600596542815-3ad19eb6a269?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80" 
                alt="Background" 
                className="w-full h-full object-cover blur-[3px] brightness-[0.5]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                Sell your property <br className="hidden xs:block" /> or <span className="underline decoration-white/40 underline-offset-4">Get Expert Help</span>
              </h2>
              <p className="text-white/90 text-base md:text-lg mb-8 max-w-xl leading-relaxed font-medium drop-shadow-md">
                Reach over 1 Million+ potential buyers or connect with top-rated agents in your area.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link 
                  to="/sell" 
                  className="bg-white text-brand-green text-lg font-bold px-10 py-4 rounded-xl shadow-lg hover:bg-gray-50 transition-all hover:scale-105 transform duration-200"
                >
                  Post Property <span className="font-extrabold uppercase">FREE</span>
                </Link>
                <Link 
                  to="/find-agent"
                  className="bg-white/10 backdrop-blur-md text-white text-lg font-bold px-10 py-4 rounded-xl shadow-lg border border-white/30 hover:bg-white/20 transition-all hover:scale-105 transform duration-200 flex items-center justify-center gap-2"
                >
                  <UserCheck size={22} /> Find An Agent
                </Link>
              </div>
            </div>
         </div>
      </div>

      {/* Popular Localities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8">
        <div className="flex justify-between items-end mb-8">
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={24} className="text-brand-green" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Localities</h2>
              </div>
              <p className="text-gray-500">Explore top rated neighborhoods in Noida</p>
            </div>
          </div>
          <Link to="/buy" className="hidden sm:flex items-center gap-2 text-brand-green font-bold hover:gap-3 transition-all">
            See All <ArrowRight size={20} />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-6 gap-5 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {localities.map((loc) => (
            <div key={loc.name} className="min-w-[200px] sm:min-w-[240px] md:min-w-[260px] flex-shrink-0 snap-start group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer">
              <div className="relative h-32 md:h-40 overflow-hidden">
                <img 
                  src={loc.image} 
                  alt={loc.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-lg leading-tight">{loc.name}</h3>
                </div>
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                 <div>
                    <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-2">
                      <span className="bg-brand-lightGreen text-brand-green px-2 py-0.5 rounded">Trending</span>
                      <span>{loc.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{loc.count}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-2">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Properties</h2>
            <p className="text-gray-500 mt-1">Handpicked projects for you</p>
          </div>
          <Link to="/buy" className="hidden sm:flex items-center gap-2 text-brand-green font-bold hover:gap-3 transition-all">
            See All <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredProperties.slice(0, visibleCount).map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
        
        {visibleCount < featuredProperties.length && (
            <div className="flex justify-center mt-8">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 4)}
                  className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-brand-green hover:text-brand-green transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  Show More Properties <ChevronRight size={18} />
                </button>
            </div>
        )}
      </div>

      {/* Recommended Sellers (Replaces View All Properties Button) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
        <div className="mb-6">
           <h2 className="text-2xl font-bold text-gray-900">Recommended Sellers</h2>
           <p className="text-gray-500 mt-1">Sellers with complete knowledge about locality</p>
        </div>

        <div className="flex overflow-x-auto pb-6 gap-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {sellers.map((seller) => (
             <div key={seller.id} className="min-w-[85vw] sm:min-w-0 bg-white rounded-xl border border-gray-200 p-5 snap-center hover:shadow-lg transition-shadow flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                   <div className="relative">
                     <img src={seller.image} alt={seller.name} className="w-14 h-14 rounded-lg object-cover border border-gray-100 shadow-sm" />
                     <div className="absolute -bottom-1 -right-1 bg-brand-green text-white p-0.5 rounded-full border-2 border-white">
                        <ShieldCheck size={10} />
                     </div>
                   </div>
                   <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 flex items-center justify-between group cursor-pointer">
                         {seller.name} 
                         <ChevronRight size={18} className="text-gray-400 group-hover:text-brand-green transition-colors" />
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-green-600 font-medium bg-green-50 w-fit px-2 py-0.5 rounded-full mt-1">
                        Verified Seller
                      </div>
                   </div>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-5 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                   <div><span className="font-bold text-gray-900 text-lg">{seller.experience}</span> <span className="text-xs">Experience</span></div>
                   <div className="h-8 w-px bg-gray-200"></div>
                   <div><span className="font-bold text-gray-900 text-lg">{seller.properties}</span> <span className="text-xs">Properties</span></div>
                </div>

                {/* Localities */}
                <div className="flex flex-wrap gap-2 mb-6 flex-grow">
                   {seller.localities.map(loc => (
                      <span key={loc} className="bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                         {loc}
                      </span>
                   ))}
                </div>

                {/* Button */}
                <button className="w-full py-3 rounded-lg border-2 border-brand-green text-brand-green font-bold flex items-center justify-center gap-2 hover:bg-brand-green hover:text-white transition-all active:scale-[0.98]">
                   <Phone size={18} /> Show Contact
                </button>
             </div>
          ))}
        </div>
      </div>

      {/* Part of REA Group Branding */}
      <div className="flex justify-center items-center gap-3 py-10 pb-12 bg-white/50 border-t border-gray-100">
        <span className="text-xl sm:text-2xl font-medium text-gray-900 tracking-tight">Part of</span>
        <div className="bg-[#E4002B] rounded-full p-1.5 mx-1 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 shadow-sm">
           <HomeIcon className="text-white w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
        </div>
        <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">REA Group</span>
      </div>

    </div>
  );
};

export default Home;
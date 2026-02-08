import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Uses your new AuthContext
import { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import { Building, Plus, Loader2, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }

    const fetchMyProperties = async () => {
      try {
        // Fetch ALL properties from backend
        const response = await fetch('http://localhost:5000/api/properties');
        const data = await response.json();

        if (data) {
          // Filter locally for properties owned by the logged-in user
          // Note: In a real production app, you'd create a specific API endpoint like /api/my-properties
          const myProperties = data.filter((p: any) => p.owner_id === user.id);

          const mapped: Property[] = myProperties.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            price: p.price,
            location: p.location,
            city: p.city,
            type: p.type,
            listingType: p.listing_type,
            images: typeof p.images === 'string' 
                ? JSON.parse(p.images).map((img: string) => `http://localhost:5000${img}`)
                : [],
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            balconies: p.balconies,
            area: p.area,
            amenities: typeof p.amenities === 'string' ? JSON.parse(p.amenities) : [],
            ownerId: p.owner_id,
            status: p.status,
            datePosted: p.created_at,
            // ... map other fields as needed
          }));
          setProperties(mapped);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProperties();
  }, [user, navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-green"/></div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
           <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
              <p className="text-gray-500 text-sm mt-1">{user?.email} • {user?.role}</p>
           </div>
           <div className="flex gap-3">
              <button onClick={signOut} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 text-sm font-bold">
                  <LogOut size={16}/> Sign Out
              </button>
              <Link to="/sell" className="px-5 py-2 bg-brand-green text-white rounded-lg hover:bg-emerald-800 flex items-center gap-2 text-sm font-bold shadow-lg shadow-brand-green/20">
                  <Plus size={18}/> Post New Property
              </Link>
           </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-xs font-bold uppercase">Total Listings</p>
                <p className="text-3xl font-bold text-brand-green mt-2">{properties.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-xs font-bold uppercase">Active Leads</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">0</p> 
                {/* Note: You need to implement a Leads API to fetch this real number */}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-xs font-bold uppercase">Account Status</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">Active</p>
            </div>
        </div>

        {/* Listings */}
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Building size={20}/> My Properties</h2>
            
            {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map(property => (
                        <div key={property.id} className="relative group">
                            <PropertyCard property={property} />
                            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                                Status: <span className={`${property.status === 'Approved' ? 'text-green-600' : 'text-orange-500'}`}>{property.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="text-gray-400" size={30} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No properties posted yet</h3>
                    <p className="text-gray-500 mt-2 mb-6">Start selling or renting out your properties today.</p>
                    <Link to="/sell" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-lg font-bold hover:bg-emerald-800">
                        <Plus size={18}/> Post Your First Property
                    </Link>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
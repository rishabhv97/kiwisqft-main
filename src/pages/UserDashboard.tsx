import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Property, PropertyType, ListingType, FurnishedStatus, ConstructionStatus, Facing, ParkingType, ListedBy } from '../types';
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
        const response = await fetch(`http://localhost:5000/api/properties/user/${user.id}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          const mapped = data.map((p: any) => {
            
            // Helper to parse JSON fields safely
            const parseJson = (val: any) => {
                if (typeof val === 'string') {
                    try { return JSON.parse(val); } catch (e) { return []; }
                }
                return Array.isArray(val) ? val : [];
            };

            // Helper to parse images specifically
            const parseImages = (val: any) => {
                const parsed = parseJson(val);
                return parsed.map((img: string) => 
                    img.startsWith('http') ? img : `http://localhost:5000${img}`
                );
            };

            // Construct the Property object with explicit casting to fix Red Line
            const propertyObj: Property = {
                id: p.id,
                title: p.title,
                description: p.description,
                price: Number(p.price) || 0,
                location: p.location,
                city: p.city,
                
                // Cast Enums to 'any' or specific types to satisfy TypeScript
                type: p.type as PropertyType, 
                listingType: p.listing_type as ListingType,
                
                images: parseImages(p.images),
                bedrooms: Number(p.bedrooms) || 0,
                bathrooms: Number(p.bathrooms) || 0,
                balconies: Number(p.balconies) || 0,
                area: Number(p.area) || 0,
                
                // Optional fields mapped safely
                carpetArea: Number(p.carpet_area) || 0,
                builtUpArea: Number(p.built_up_area) || 0,
                superBuiltUpArea: Number(p.super_built_up_area) || 0,
                
                amenities: parseJson(p.amenities),
                additionalRooms: parseJson(p.additional_rooms),
                documents: parseJson(p.available_documents),
                views: parseJson(p.views),
                
                ownerId: p.owner_id,
                // These two were likely causing the Red Line if missing:
                ownerContact: p.owner_contact || user.phone || '', 
                listedBy: (p.listed_by as ListedBy) || 'Owner',

                status: p.status,
                datePosted: p.created_at,
                
                furnishedStatus: p.furnished_status as FurnishedStatus,
                constructionStatus: p.construction_status as ConstructionStatus,
                yearBuilt: Number(p.year_built) || 0,
                floor: Number(p.floor_no) || 0,
                totalFloors: Number(p.total_floors) || 0,
                facing: p.facing_entry as Facing,
                exitFacing: p.facing_exit as Facing,
                parkingType: p.parking_type as ParkingType,
                parkingSpaces: Number(p.parking_spaces) || 0,
                
                isFeatured: Boolean(p.is_featured),
                reraApproved: Boolean(p.rera_approved),
                allInclusivePrice: Boolean(p.is_all_inclusive_price),
                priceNegotiable: Boolean(p.price_negotiable),
                taxExcluded: Boolean(p.is_tax_excluded),
                hasShowcase: Boolean(p.is_virtual_showcase),
                has3DVideo: Boolean(p.is_3d_video),
            };

            return propertyObj;
          });
          
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
                            
                            {/* Status Badge */}
                            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-gray-100 z-10">
                                Status: <span className={`
                                    ${property.status === 'Approved' ? 'text-green-600' : ''}
                                    ${property.status === 'Pending' ? 'text-orange-500' : ''}
                                    ${property.status === 'Rejected' ? 'text-red-500' : ''}
                                `}>
                                    {property.status}
                                </span>
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
import React, { useState, useMemo } from 'react';
import { Property, ListingType, PropertyType, ConstructionStatus, ListedBy, FurnishedStatus, Facing, ViewType, ParkingType, OwnershipType } from '../src/types';
import PropertyCard from '../components/PropertyCard';
import { Filter, SlidersHorizontal, MapPin, ChevronDown, ChevronUp, Check, Video, Car, Calculator, Save, Download, BedDouble, Bath, Home, Info, Layers, Building, Compass, FileText } from 'lucide-react';

interface ListingsProps {
  properties: Property[];
  type: ListingType;
}

const Listings: React.FC<ListingsProps> = ({ properties, type }) => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[string, string]>(['', '']); 
  const [priceFilterMode, setPriceFilterMode] = useState<'list' | 'monthly'>('list');
  const [monthlyRange, setMonthlyRange] = useState<[number, number]>([0, 1000000]); // Max 10 Lakhs/mo
  
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<PropertyType[]>([]);
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState<ConstructionStatus[]>([]);
  const [selectedListedBy, setSelectedListedBy] = useState<ListedBy[]>([]);
  const [selectedFurnished, setSelectedFurnished] = useState<FurnishedStatus[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [reraOnly, setReraOnly] = useState(false);
  const [selectedOwnership, setSelectedOwnership] = useState<OwnershipType[]>([]);

  // Room Filters
  const [selectedBedrooms, setSelectedBedrooms] = useState<number[]>([]);
  const [selectedBathrooms, setSelectedBathrooms] = useState<number[]>([]);
  const [selectedBalconies, setSelectedBalconies] = useState<number[]>([]);
  const [selectedAdditionalRooms, setSelectedAdditionalRooms] = useState<string[]>([]);

  // New Filters
  const [houseTour, setHouseTour] = useState<{showcase: boolean, video3d: boolean}>({ showcase: false, video3d: false });
  const [minParking, setMinParking] = useState<number>(0); // 0 = Any
  
  // Area Filter - Specific Inputs
  const [minCarpetArea, setMinCarpetArea] = useState<string>('');
  const [minBuiltUpArea, setMinBuiltUpArea] = useState<string>('');
  const [minSuperArea, setMinSuperArea] = useState<string>('');

  const [yearBuiltRange, setYearBuiltRange] = useState<{min: string, max: string}>({ min: '', max: '' });
  const [selectedParkingTypes, setSelectedParkingTypes] = useState<ParkingType[]>([]);
  const [selectedViews, setSelectedViews] = useState<ViewType[]>([]);

  // Price Details Filters
  const [showAllInclusiveOnly, setShowAllInclusiveOnly] = useState(false);
  const [showNegotiableOnly, setShowNegotiableOnly] = useState(false);
  const [showTaxExcludedOnly, setShowTaxExcludedOnly] = useState(false);

  // New Requested Filters
  const [selectedFloorRanges, setSelectedFloorRanges] = useState<string[]>([]);
  const [selectedBuildingHeights, setSelectedBuildingHeights] = useState<string[]>([]);
  const [selectedEntryFacing, setSelectedEntryFacing] = useState<Facing[]>([]);
  const [selectedExitFacing, setSelectedExitFacing] = useState<Facing[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);


  // Toggle helper
  const toggleSelection = <T extends string>(item: T, list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const toggleNumberSelection = (num: number, list: number[], setList: React.Dispatch<React.SetStateAction<number[]>>) => {
      if (list.includes(num)) {
          setList(list.filter(i => i !== num));
      } else {
          setList([...list, num]);
      }
  };

  const calculateEMI = (price: number) => {
    // Assumptions: 20% Down Payment, 8.5% Interest Rate, 20 Years Tenure
    const principal = price * 0.8;
    const rate = 8.5 / 12 / 100;
    const months = 20 * 12;
    const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return emi;
  };

  const handleSaveSearch = () => {
    const searchData = {
        searchTerm,
        priceRange,
        priceFilterMode,
        monthlyRange,
        selectedPropertyTypes,
        selectedConstructionStatus,
        selectedListedBy,
        selectedFurnished,
        selectedAmenities,
        selectedEntryFacing,
        selectedExitFacing,
        reraOnly,
        selectedFloorRanges,
        selectedBuildingHeights,
        houseTour,
        minParking,
        minCarpetArea,
        minBuiltUpArea,
        minSuperArea,
        yearBuiltRange,
        selectedParkingTypes,
        selectedViews,
        selectedBedrooms,
        selectedBathrooms,
        selectedBalconies,
        selectedOwnership,
        selectedAdditionalRooms,
        showAllInclusiveOnly,
        showNegotiableOnly,
        showTaxExcludedOnly,
        selectedDocuments
    };
    localStorage.setItem('kiwi_saved_search', JSON.stringify(searchData));
    alert("Search filters saved successfully!");
  };

  const handleLoadSearch = () => {
    const saved = localStorage.getItem('kiwi_saved_search');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.searchTerm !== undefined) setSearchTerm(data.searchTerm);
            if (data.priceRange) setPriceRange(data.priceRange);
            if (data.priceFilterMode) setPriceFilterMode(data.priceFilterMode);
            if (data.monthlyRange) setMonthlyRange(data.monthlyRange);
            if (data.selectedPropertyTypes) setSelectedPropertyTypes(data.selectedPropertyTypes);
            if (data.selectedConstructionStatus) setSelectedConstructionStatus(data.selectedConstructionStatus);
            if (data.selectedListedBy) setSelectedListedBy(data.selectedListedBy);
            if (data.selectedFurnished) setSelectedFurnished(data.selectedFurnished);
            if (data.selectedAmenities) setSelectedAmenities(data.selectedAmenities);
            if (data.selectedEntryFacing) setSelectedEntryFacing(data.selectedEntryFacing);
            if (data.selectedExitFacing) setSelectedExitFacing(data.selectedExitFacing);
            if (data.reraOnly !== undefined) setReraOnly(data.reraOnly);
            if (data.selectedFloorRanges) setSelectedFloorRanges(data.selectedFloorRanges);
            if (data.selectedBuildingHeights) setSelectedBuildingHeights(data.selectedBuildingHeights);
            if (data.houseTour) setHouseTour(data.houseTour);
            if (data.minParking !== undefined) setMinParking(data.minParking);
            if (data.minCarpetArea) setMinCarpetArea(data.minCarpetArea);
            if (data.minBuiltUpArea) setMinBuiltUpArea(data.minBuiltUpArea);
            if (data.minSuperArea) setMinSuperArea(data.minSuperArea);
            if (data.yearBuiltRange) setYearBuiltRange(data.yearBuiltRange);
            if (data.selectedParkingTypes) setSelectedParkingTypes(data.selectedParkingTypes);
            if (data.selectedViews) setSelectedViews(data.selectedViews);
            if (data.selectedBedrooms) setSelectedBedrooms(data.selectedBedrooms);
            if (data.selectedBathrooms) setSelectedBathrooms(data.selectedBathrooms);
            if (data.selectedBalconies) setSelectedBalconies(data.selectedBalconies);
            if (data.selectedOwnership) setSelectedOwnership(data.selectedOwnership);
            if (data.selectedAdditionalRooms) setSelectedAdditionalRooms(data.selectedAdditionalRooms);
            if (data.showAllInclusiveOnly !== undefined) setShowAllInclusiveOnly(data.showAllInclusiveOnly);
            if (data.showNegotiableOnly !== undefined) setShowNegotiableOnly(data.showNegotiableOnly);
            if (data.showTaxExcludedOnly !== undefined) setShowTaxExcludedOnly(data.showTaxExcludedOnly);
            if (data.selectedDocuments) setSelectedDocuments(data.selectedDocuments);

        } catch (e) {
            console.error("Failed to load search", e);
            alert("Failed to load saved search.");
        }
    } else {
        alert("No saved search found.");
    }
  };

  // Helper to get the area value for calculation
  const activeArea = useMemo(() => {
    const s = minSuperArea ? parseInt(minSuperArea) : 0;
    const b = minBuiltUpArea ? parseInt(minBuiltUpArea) : 0;
    const c = minCarpetArea ? parseInt(minCarpetArea) : 0;
    return s || b || c || 0;
  }, [minSuperArea, minBuiltUpArea, minCarpetArea]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // 1. Basic Type (Sale/Rent)
      if (p.listingType !== type) return false;

      // 2. Search Term
      if (searchTerm && !p.location.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !p.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !p.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // 3. Price Logic (List Price vs Monthly Payment)
      if (type === 'sale' && priceFilterMode === 'monthly') {
          const emi = calculateEMI(p.price);
          if (emi < monthlyRange[0] || emi > monthlyRange[1]) return false;
      } else {
          const minP = priceRange[0] ? parseInt(priceRange[0]) : 0;
          const maxP = priceRange[1] ? parseInt(priceRange[1]) : Infinity;
          if (p.price < minP || p.price > maxP) return false;
      }

      // 3.6 Boolean Flags
      if (showAllInclusiveOnly && !p.allInclusivePrice) return false;
      if (showNegotiableOnly && !p.priceNegotiable) return false;
      if (showTaxExcludedOnly && !p.taxExcluded) return false;

      // 4. Property Type
      if (selectedPropertyTypes.length > 0 && !selectedPropertyTypes.includes(p.type)) return false;

      // 4.5 Room Configs (Bed, Bath, Balcony)
      if (selectedBedrooms.length > 0) {
          const hasMatch = selectedBedrooms.some(n => n === 5 ? p.bedrooms >= 4 : p.bedrooms === n);
          if (!hasMatch) return false;
      }
      if (selectedBathrooms.length > 0) {
          const hasMatch = selectedBathrooms.some(n => n === 4 ? p.bathrooms >= 4 : p.bathrooms === n);
          if (!hasMatch) return false;
      }
      if (selectedBalconies.length > 0) {
          const balconies = p.balconies || 0;
          const hasMatch = selectedBalconies.some(n => n === 4 ? balconies >= 3 : balconies === n);
          if (!hasMatch) return false;
      }

      // 4.6 Additional Rooms
      if (selectedAdditionalRooms.length > 0) {
        if (!p.additionalRooms) return false;
        // Must match all selected rooms
        const hasAllRooms = selectedAdditionalRooms.every(room => p.additionalRooms?.includes(room));
        if (!hasAllRooms) return false;
      }

      // 5. Construction Status
      if (selectedConstructionStatus.length > 0 && (!p.constructionStatus || !selectedConstructionStatus.includes(p.constructionStatus))) return false;

      // 6. Listed By
      if (selectedListedBy.length > 0 && (!p.listedBy || !selectedListedBy.includes(p.listedBy))) return false;

      // 7. Furnished
      if (selectedFurnished.length > 0 && (!p.furnishedStatus || !selectedFurnished.includes(p.furnishedStatus))) return false;

      // 7.5 Ownership
      if (selectedOwnership.length > 0 && (!p.ownershipType || !selectedOwnership.includes(p.ownershipType))) return false;

      // 8. RERA
      if (reraOnly && !p.reraApproved) return false;

      // 9. Amenities (Must match ALL selected)
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every(amenity => 
          p.amenities.some(pAmenity => pAmenity.toLowerCase().includes(amenity.toLowerCase()))
        );
        if (!hasAllAmenities) return false;
      }

      // 10. Floor Preference Logic
      if (selectedFloorRanges.length > 0 && p.floor !== undefined) {
         const floorMap: {[key: string]: (f: number) => boolean} = {
            'Ground - 5th Floor': (f) => f >= 0 && f <= 5,
            '5th - 10th Floor': (f) => f > 5 && f <= 10,
            '10th - 15th Floor': (f) => f > 10 && f <= 15,
            '15th - 20th Floor': (f) => f > 15 && f <= 20,
            '20th - 25th Floor': (f) => f > 20 && f <= 25,
            'Above 25th Floor': (f) => f > 25
         };
         
         const hasMatch = selectedFloorRanges.some(range => floorMap[range] ? floorMap[range](p.floor!) : false);
         if (!hasMatch) return false;
      }

      // 11. Building Heights Logic
      if (selectedBuildingHeights.length > 0 && !selectedBuildingHeights.includes('All') && p.totalFloors !== undefined) {
          const hasMatch = selectedBuildingHeights.some(height => {
              if (height === 'Low Rise') return p.totalFloors! <= 4;
              if (height === 'Mid Rise') return p.totalFloors! > 4 && p.totalFloors! <= 12;
              if (height === 'High Rise') return p.totalFloors! > 12;
              return false;
          });
          if (!hasMatch) return false;
      }

      // 12. Vaastu Entry Logic
      if (selectedEntryFacing.length > 0 && (!p.facing || !selectedEntryFacing.includes(p.facing))) return false;

      // 13. Vaastu Exit Logic
      if (selectedExitFacing.length > 0 && (!p.exitFacing || !selectedExitFacing.includes(p.exitFacing))) return false;


      // 14. House Tour
      if (houseTour.showcase && !p.hasShowcase) return false;
      if (houseTour.video3d && !p.has3DVideo) return false;

      // 15. Parking Spots
      if (minParking > 0 && (p.parkingSpaces || 0) < minParking) return false;

      // 16. Area Logic (Specific Inputs)
      if (minCarpetArea && (!p.carpetArea || p.carpetArea < parseInt(minCarpetArea))) return false;
      if (minBuiltUpArea && (!p.builtUpArea || p.builtUpArea < parseInt(minBuiltUpArea))) return false;
      if (minSuperArea && (!p.superBuiltUpArea || p.superBuiltUpArea < parseInt(minSuperArea))) return false;

      // 17. Year Built
      if (yearBuiltRange.min || yearBuiltRange.max) {
        if (!p.yearBuilt) return false;
        const minYear = yearBuiltRange.min ? parseInt(yearBuiltRange.min) : 0;
        const maxYear = yearBuiltRange.max ? parseInt(yearBuiltRange.max) : 9999;
        if (p.yearBuilt < minYear || p.yearBuilt > maxYear) return false;
      }

      // 18. Parking Type (Open/Covered)
      if (selectedParkingTypes.length > 0) {
        if (!p.parkingType || !selectedParkingTypes.includes(p.parkingType)) return false;
      }

      // 19. View
      if (selectedViews.length > 0) {
        if (!p.views || !p.views.some(v => selectedViews.includes(v))) return false;
      }
      
      // 20. Documents Filter
      if (selectedDocuments.length > 0) {
          if (!p.documents) return false;
          // Must have ALL selected documents
          const hasAllDocs = selectedDocuments.every(doc => p.documents?.includes(doc));
          if (!hasAllDocs) return false;
      }

      return true;
    });
  }, [
    properties, type, searchTerm, priceRange, priceFilterMode, monthlyRange, selectedPropertyTypes, 
    selectedConstructionStatus, selectedListedBy, selectedFurnished, 
    reraOnly, selectedAmenities, selectedEntryFacing, selectedExitFacing, selectedFloorRanges, selectedBuildingHeights,
    houseTour, minParking, minCarpetArea, minBuiltUpArea, minSuperArea, yearBuiltRange, selectedParkingTypes, selectedViews,
    selectedBedrooms, selectedBathrooms, selectedBalconies, selectedOwnership, selectedAdditionalRooms,
    showAllInclusiveOnly, showNegotiableOnly, showTaxExcludedOnly, selectedDocuments
  ]);

  const maxPriceValue = type === 'rent' ? 500000 : 100000000;

  const amenitiesList = [
    'Club House', 'Swimming Pool', 'Kids Play Area', 'Lift', 'Parking', 
    'Power Backup', 'Gym', 'Vaastu Compliant', 'Security Personnel', 'Gas Pipeline'
  ];
  
  const floorOptions = [
      'Ground - 5th Floor', '5th - 10th Floor', '10th - 15th Floor', 
      '15th - 20th Floor', '20th - 25th Floor', 'Above 25th Floor'
  ];
  
  const heightOptions = ['All', 'High Rise', 'Mid Rise', 'Low Rise'];
  
  const entryFacingOptions: Facing[] = ['East', 'North', 'North-East', 'West', 'North-West', 'South', 'South-East'];
  const exitFacingOptions: Facing[] = ['East', 'West', 'North', 'North-East', 'South-East'];

  const documentOptions = [
      'Sale Deed / Ownership Title',
      'Society/Authority Transfer Letter',
      'Occupancy Certificate (OC)',
      'Completion Certificate (CC)',
      'Encumbrance Certificate (EC)',
      'Property Tax Receipts',
      'NOC from Society/Builder',
      'RERA Registration',
      'Allotment Letter',
      'Possession Letter'
  ];


  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
            Properties for {type}
          </h1>
          <p className="text-gray-500">
            {filteredProperties.length} listings found matching your criteria
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden w-full flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="font-bold text-gray-700 flex items-center gap-2">
              <Filter size={18} className="text-brand-green" /> Filters
            </span>
            {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-brand-brown">
                  <Filter size={20} />
                  <h2 className="font-bold text-lg">Filters</h2>
                </div>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPropertyTypes([]);
                    setPriceRange(['', '']);
                    setPriceFilterMode('list');
                    setMonthlyRange([0, 1000000]);
                    setSelectedConstructionStatus([]);
                    setSelectedListedBy([]);
                    setSelectedFurnished([]);
                    setSelectedAmenities([]);
                    setSelectedEntryFacing([]);
                    setSelectedExitFacing([]);
                    setReraOnly(false);
                    setSelectedFloorRanges([]);
                    setSelectedBuildingHeights([]);
                    setHouseTour({ showcase: false, video3d: false });
                    setMinParking(0);
                    setMinCarpetArea('');
                    setMinBuiltUpArea('');
                    setMinSuperArea('');
                    setYearBuiltRange({ min: '', max: '' });
                    setSelectedParkingTypes([]);
                    setSelectedViews([]);
                    setSelectedBedrooms([]);
                    setSelectedBathrooms([]);
                    setSelectedBalconies([]);
                    setSelectedOwnership([]);
                    setSelectedAdditionalRooms([]);
                    setShowAllInclusiveOnly(false);
                    setShowNegotiableOnly(false);
                    setShowTaxExcludedOnly(false);
                    setSelectedDocuments([]);
                  }}
                  className="text-xs font-semibold text-brand-green hover:underline"
                >
                  Reset All
                </button>
              </div>

               {/* Save/Load Search Buttons */}
               <div className="flex gap-2 mb-6">
                 <button
                   onClick={handleSaveSearch}
                   className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-brand-lightGreen/50 text-brand-green border border-brand-green/20 rounded-lg text-xs font-bold hover:bg-brand-green hover:text-white transition-all shadow-sm"
                   title="Save current filters"
                 >
                   <Save size={14} /> Save
                 </button>
                 <button
                   onClick={handleLoadSearch}
                   className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-100 transition-all shadow-sm"
                   title="Load previously saved filters"
                 >
                   <Download size={14} /> Load
                 </button>
               </div>

              {/* Location Search */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="City or Locality"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-brand-green focus:border-brand-green bg-gray-50"
                  />
                </div>
              </div>

               {/* Home Type Filters */}
               <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Property Type</h3>
                <div className="space-y-2">
                  {['Apartment', 'Villa', '1 RK/Studio', 'House', 'Residential Land', 'Penthouse', 'Builder Floor'].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedPropertyTypes.includes(t as PropertyType) ? 'bg-brand-green border-brand-green' : 'border-gray-300 group-hover:border-brand-green'}`}>
                        {selectedPropertyTypes.includes(t as PropertyType) && <Check size={12} className="text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedPropertyTypes.includes(t as PropertyType)}
                        onChange={() => toggleSelection(t as PropertyType, selectedPropertyTypes, setSelectedPropertyTypes)}
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

               {/* Room Configuration */}
              <div className="mb-6 border-b border-gray-100 pb-4 space-y-4">
                 <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Bedrooms</h3>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(n => (
                            <button 
                                key={n}
                                onClick={() => toggleNumberSelection(n, selectedBedrooms, setSelectedBedrooms)}
                                className={`w-9 h-9 text-xs rounded-full font-bold border transition-all ${selectedBedrooms.includes(n) ? 'bg-brand-green text-white border-brand-green' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green'}`}
                            >
                                {n}{n===5 ? '+' : ''}
                            </button>
                        ))}
                    </div>
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Bathrooms</h3>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(n => (
                            <button 
                                key={n}
                                onClick={() => toggleNumberSelection(n, selectedBathrooms, setSelectedBathrooms)}
                                className={`w-9 h-9 text-xs rounded-full font-bold border transition-all ${selectedBathrooms.includes(n) ? 'bg-brand-green text-white border-brand-green' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green'}`}
                            >
                                {n}{n===4 ? '+' : ''}
                            </button>
                        ))}
                    </div>
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Balconies</h3>
                    <div className="flex gap-2">
                        {[0, 1, 2, 3, 4].map(n => (
                            <button 
                                key={n}
                                onClick={() => toggleNumberSelection(n, selectedBalconies, setSelectedBalconies)}
                                className={`w-9 h-9 text-xs rounded-full font-bold border transition-all ${selectedBalconies.includes(n) ? 'bg-brand-green text-white border-brand-green' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green'}`}
                            >
                                {n}{n===4 ? '+' : ''}
                            </button>
                        ))}
                    </div>
                 </div>
              </div>

               {/* Other Rooms (New) */}
              <div className="mb-6 border-b border-gray-100 pb-4">
                 <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Other Rooms</h3>
                 <div className="space-y-2">
                   {['Pooja Room', 'Study Room', 'Servant Room', 'Others'].map((t) => (
                     <label key={t} className="flex items-center gap-2 cursor-pointer group">
                       <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedAdditionalRooms.includes(t) ? 'bg-brand-green border-brand-green' : 'border-gray-300 group-hover:border-brand-green'}`}>
                         {selectedAdditionalRooms.includes(t) && <Check size={12} className="text-white" />}
                       </div>
                       <input
                         type="checkbox"
                         className="hidden"
                         checked={selectedAdditionalRooms.includes(t)}
                         onChange={() => toggleSelection(t, selectedAdditionalRooms, setSelectedAdditionalRooms)}
                       />
                       <span className="text-sm text-gray-600 group-hover:text-gray-900">{t}</span>
                     </label>
                   ))}
                 </div>
              </div>
              
              {/* Floor Preference (NEW) */}
              <div className="mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2"><Layers size={14}/> Floor Preference</h3>
                  <div className="space-y-2">
                      {floorOptions.map((f) => (
                        <label key={f} className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedFloorRanges.includes(f) ? 'bg-brand-green border-brand-green' : 'border-gray-300 group-hover:border-brand-green'}`}>
                                {selectedFloorRanges.includes(f) && <Check size={12} className="text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={selectedFloorRanges.includes(f)}
                                onChange={() => toggleSelection(f, selectedFloorRanges, setSelectedFloorRanges)}
                            />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">{f}</span>
                        </label>
                      ))}
                  </div>
              </div>

              {/* Building Heights (NEW) */}
              <div className="mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2"><Building size={14}/> Building Heights</h3>
                   <div className="space-y-2">
                      {heightOptions.map((h) => (
                        <label key={h} className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedBuildingHeights.includes(h) ? 'bg-brand-green border-brand-green' : 'border-gray-300 group-hover:border-brand-green'}`}>
                                {selectedBuildingHeights.includes(h) && <Check size={12} className="text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={selectedBuildingHeights.includes(h)}
                                onChange={() => toggleSelection(h, selectedBuildingHeights, setSelectedBuildingHeights)}
                            />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">{h}</span>
                        </label>
                      ))}
                  </div>
              </div>

              {/* Vaastu Preferences (NEW) */}
              <div className="mb-6 border-b border-gray-100 pb-4">
                 <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2"><Compass size={14}/> Vaastu Preferences</h3>
                 
                 <div className="mb-4">
                     <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Entry Facing</p>
                     <div className="space-y-2">
                        {entryFacingOptions.map((f) => (
                             <label key={f} className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedEntryFacing.includes(f) ? 'bg-brand-green border-brand-green' : 'border-gray-300 group-hover:border-brand-green'}`}>
                                    {selectedEntryFacing.includes(f) && <Check size={12} className="text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedEntryFacing.includes(f)}
                                    onChange={() => toggleSelection(f, selectedEntryFacing, setSelectedEntryFacing)}
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900">{f}</span>
                            </label>
                        ))}
                     </div>
                 </div>

                 <div>
                     <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Exit Facing</p>
                     <div className="space-y-2">
                        {exitFacingOptions.map((f) => (
                             <label key={f} className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedExitFacing.includes(f) ? 'bg-brand-green border-brand-green' : 'border-gray-300 group-hover:border-brand-green'}`}>
                                    {selectedExitFacing.includes(f) && <Check size={12} className="text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedExitFacing.includes(f)}
                                    onChange={() => toggleSelection(f, selectedExitFacing, setSelectedExitFacing)}
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900">{f}</span>
                            </label>
                        ))}
                     </div>
                 </div>
              </div>

              {/* Verified Documents Filter */}
              <div className="mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2"><FileText size={14}/> Verified Documents</h3>
                  <div className="space-y-2">
                      {documentOptions.map((doc) => (
                          <label key={doc} className="flex items-center gap-2 cursor-pointer group">
                              <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedDocuments.includes(doc) ? 'bg-brand-green border-brand-green' : 'border-gray-300 group-hover:border-brand-green'}`}>
                                  {selectedDocuments.includes(doc) && <Check size={12} className="text-white" />}
                              </div>
                              <input
                                  type="checkbox"
                                  className="hidden"
                                  checked={selectedDocuments.includes(doc)}
                                  onChange={() => toggleSelection(doc, selectedDocuments, setSelectedDocuments)}
                              />
                              <span className="text-sm text-gray-600 group-hover:text-gray-900">{doc}</span>
                          </label>
                      ))}
                  </div>
              </div>


               {/* Area Details - Specific Inputs */}
               <div className="mb-6 border-b border-gray-100 pb-4">
                 <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider">Area Details (Min)</h3>
                 
                 <div className="flex flex-col gap-3 mt-2">
                    {/* Carpet Area */}
                    <div className="border border-gray-300 rounded overflow-hidden flex items-center bg-white">
                        <div className="flex-1 relative">
                            <label className="absolute top-1 left-3 text-xs text-gray-500">Carpet Area</label>
                            <input 
                                type="number" 
                                value={minCarpetArea}
                                onChange={(e) => setMinCarpetArea(e.target.value)}
                                className="w-full pt-5 pb-1 px-3 outline-none text-sm text-gray-800" 
                                placeholder="0"
                            />
                        </div>
                        <div className="border-l border-gray-200 px-3 py-3 bg-gray-50 flex items-center gap-1 text-gray-600 text-xs font-medium">
                            sq.ft. <ChevronDown size={12} />
                        </div>
                    </div>

                    {/* Built-up Area */}
                    <div className="border border-gray-300 rounded overflow-hidden flex items-center bg-white">
                        <div className="flex-1 relative">
                            <label className="absolute top-1 left-3 text-xs text-gray-500">Built-up Area</label>
                            <input 
                                type="number" 
                                value={minBuiltUpArea}
                                onChange={(e) => setMinBuiltUpArea(e.target.value)}
                                className="w-full pt-5 pb-1 px-3 outline-none text-sm text-gray-800"
                                placeholder="0"
                            />
                        </div>
                        <div className="border-l border-gray-200 px-3 py-3 bg-gray-50 flex items-center gap-1 text-gray-600 text-xs font-medium">
                            sq.ft. <ChevronDown size={12} />
                        </div>
                    </div>

                    {/* Super Built-up Area */}
                    <div className="border border-gray-300 rounded overflow-hidden flex items-center bg-white">
                        <div className="flex-1 relative">
                            <label className="absolute top-1 left-3 text-xs text-gray-500">Super built-up</label>
                            <input 
                                type="number" 
                                value={minSuperArea}
                                onChange={(e) => setMinSuperArea(e.target.value)}
                                className="w-full pt-5 pb-1 px-3 outline-none text-sm text-gray-800"
                                placeholder="0"
                            />
                        </div>
                        <div className="border-l border-gray-200 px-3 py-3 bg-gray-50 flex items-center gap-1 text-gray-600 text-xs font-medium">
                            sq.ft. <ChevronDown size={12} />
                        </div>
                    </div>
                 </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6 border-b border-gray-100 pb-6">
                <label className="block text-sm font-bold text-gray-800 mb-3">Price Range</label>
                
                {type === 'sale' && (
                  <div className="flex rounded-lg border border-brand-green overflow-hidden mb-4">
                    <button
                      onClick={() => setPriceFilterMode('list')}
                      className={`flex-1 py-2 text-xs font-bold transition-colors ${
                        priceFilterMode === 'list' 
                          ? 'bg-brand-green text-white' 
                          : 'bg-white text-brand-green hover:bg-brand-lightGreen/20'
                      }`}
                    >
                      List Price
                    </button>
                    <div className="w-px bg-brand-green"></div>
                    <button
                      onClick={() => setPriceFilterMode('monthly')}
                      className={`flex-1 py-2 text-xs font-bold transition-colors ${
                        priceFilterMode === 'monthly' 
                          ? 'bg-brand-green text-white' 
                          : 'bg-white text-brand-green hover:bg-brand-lightGreen/20'
                      }`}
                    >
                      Monthly Payment
                    </button>
                  </div>
                )}

                {(priceFilterMode === 'list' || type === 'rent') ? (
                  <div className="flex gap-2">
                     <div className="border border-gray-300 rounded-lg overflow-hidden flex items-center bg-white flex-1 hover:border-brand-green transition-colors">
                        <div className="flex-1 relative">
                            <label className="absolute top-2 left-3 text-xs font-medium text-gray-500">Min Price</label>
                            <input 
                                type="number" 
                                value={priceRange[0]} 
                                onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
                                className="w-full pt-6 pb-2 px-3 outline-none text-sm text-gray-800 font-medium" 
                                placeholder="0"
                            />
                        </div>
                     </div>
                     <div className="border border-gray-300 rounded-lg overflow-hidden flex items-center bg-white flex-1 hover:border-brand-green transition-colors">
                        <div className="flex-1 relative">
                            <label className="absolute top-2 left-3 text-xs font-medium text-gray-500">Max Price</label>
                            <input 
                                type="number" 
                                value={priceRange[1]} 
                                onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                                className="w-full pt-6 pb-2 px-3 outline-none text-sm text-gray-800 font-medium" 
                                placeholder="Any"
                            />
                        </div>
                     </div>
                  </div>
                ) : (
                  <>
                     <div className="mb-3 flex items-start gap-2 text-xs text-gray-500 bg-blue-50 p-2 rounded-md border border-blue-100">
                        <Calculator size={14} className="mt-0.5 text-blue-500 flex-shrink-0" />
                        <span>Est. EMI (20% down, 8.5% rate, 20yrs)</span>
                     </div>
                     <div className="mb-2 flex items-center justify-between text-xs text-gray-500 font-medium">
                        <span>Min: ₹{monthlyRange[0].toLocaleString()}</span>
                        <span>Max: ₹{(monthlyRange[1]/100000).toFixed(1)}L/mo</span>
                     </div>
                     <input
                        type="range"
                        min="0"
                        max={1000000} // 10 Lakhs max monthly
                        step={5000}
                        value={monthlyRange[1]}
                        onChange={(e) => setMonthlyRange([0, parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
                      />
                  </>
                )}
                
                 {/* Real-time Rate Calculator */}
                 {type === 'sale' && priceFilterMode === 'list' && (
                    <div className="mt-3 bg-blue-50/50 rounded-lg p-3 border border-blue-100 transition-all">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 mb-2">
                             <Calculator size={14} />
                             <span>Price per Sq.ft Estimator</span>
                        </div>
                        
                        {activeArea > 0 ? (
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 text-xs">Based on {minSuperArea ? 'Super Area' : minBuiltUpArea ? 'Built-up' : 'Carpet Area'}:</span>
                                    <span className="font-bold text-gray-800">{activeArea} sq.ft</span>
                                </div>
                                <div className="h-px bg-blue-100 my-1"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Min Rate:</span>
                                    <span className="text-sm font-bold text-brand-green">
                                        {parseInt(priceRange[0]) > 0 
                                            ? `₹${Math.round(parseInt(priceRange[0]) / activeArea).toLocaleString()}/sq.ft` 
                                            : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Max Rate:</span>
                                    <span className="text-sm font-bold text-brand-green">
                                        {parseInt(priceRange[1]) > 0 
                                            ? `₹${Math.round(parseInt(priceRange[1]) / activeArea).toLocaleString()}/sq.ft` 
                                            : '-'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500 italic">
                                Enter a <b>Min Area</b> (Carpet, Built-up, or Super) above to see the calculated price per sq.ft range here.
                            </p>
                        )}
                    </div>
                 )}
              </div>
              
              {/* Additional Price Filters */}
              <div className="mb-6 border-b border-gray-100 pb-6 space-y-3">
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${showAllInclusiveOnly ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'}`}>
                        {showAllInclusiveOnly && <Check size={14} className="text-white" />}
                    </div>
                    <input type="checkbox" checked={showAllInclusiveOnly} onChange={() => setShowAllInclusiveOnly(!showAllInclusiveOnly)} className="hidden" />
                    <span className="text-gray-800 text-sm font-medium flex items-center gap-1">All Inclusive Price Only <Info size={14} className="text-gray-400"/></span>
                 </label>
                 
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${showNegotiableOnly ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'}`}>
                        {showNegotiableOnly && <Check size={14} className="text-white" />}
                    </div>
                    <input type="checkbox" checked={showNegotiableOnly} onChange={() => setShowNegotiableOnly(!showNegotiableOnly)} className="hidden" />
                    <span className="text-gray-800 text-sm">Price Negotiable Only</span>
                 </label>

                 <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${showTaxExcludedOnly ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'}`}>
                        {showTaxExcludedOnly && <Check size={14} className="text-white" />}
                    </div>
                    <input type="checkbox" checked={showTaxExcludedOnly} onChange={() => setShowTaxExcludedOnly(!showTaxExcludedOnly)} className="hidden" />
                    <span className="text-gray-800 text-sm">Tax Excluded Only</span>
                 </label>
              </div>

               {/* Construction Status */}
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Construction Status</h3>
                 <div className="space-y-2">
                  {['New Launch', 'Ready to Move', 'Under Construction'].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedConstructionStatus.includes(t as ConstructionStatus) ? 'bg-brand-green border-brand-green' : 'border-gray-300 group-hover:border-brand-green'}`}>
                        {selectedConstructionStatus.includes(t as ConstructionStatus) && <Check size={12} className="text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedConstructionStatus.includes(t as ConstructionStatus)}
                        onChange={() => toggleSelection(t as ConstructionStatus, selectedConstructionStatus, setSelectedConstructionStatus)}
                      />
                      <span className="text-sm text-gray-600">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

               {/* Furnishing (New) */}
               <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Furnishing</h3>
                 <div className="space-y-2">
                  {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedFurnished.includes(t as FurnishedStatus) ? 'bg-brand-green border-brand-green' : 'border-gray-300 group-hover:border-brand-green'}`}>
                        {selectedFurnished.includes(t as FurnishedStatus) && <Check size={12} className="text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedFurnished.includes(t as FurnishedStatus)}
                        onChange={() => toggleSelection(t as FurnishedStatus, selectedFurnished, setSelectedFurnished)}
                      />
                      <span className="text-sm text-gray-600">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

               {/* Ownership */}
               <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Ownership</h3>
                 <div className="space-y-2">
                  {['Freehold', 'Leasehold', 'Co-operative society', 'Power of Attorney'].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedOwnership.includes(t as OwnershipType) ? 'bg-brand-green border-brand-green' : 'border-gray-300 group-hover:border-brand-green'}`}>
                        {selectedOwnership.includes(t as OwnershipType) && <Check size={12} className="text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedOwnership.includes(t as OwnershipType)}
                        onChange={() => toggleSelection(t as OwnershipType, selectedOwnership, setSelectedOwnership)}
                      />
                      <span className="text-sm text-gray-600">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* RERA */}
              <div className="mb-6 border-b border-gray-100 pb-4">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${reraOnly ? 'bg-brand-green' : 'bg-gray-300'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${reraOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                    <input type="checkbox" className="hidden" checked={reraOnly} onChange={() => setReraOnly(!reraOnly)} />
                    <span className="text-sm font-bold text-gray-700">RERA Approved Only</span>
                 </label>
              </div>

              {/* Amenities */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Amenities</h3>
                 <div className="space-y-2">
                  {amenitiesList.map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer group">
                       <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedAmenities.includes(t) ? 'bg-brand-green border-brand-green' : 'border-gray-300 group-hover:border-brand-green'}`}>
                        {selectedAmenities.includes(t) && <Check size={12} className="text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedAmenities.includes(t)}
                        onChange={() => toggleSelection(t, selectedAmenities, setSelectedAmenities)}
                      />
                      <span className="text-sm text-gray-600">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:w-3/4">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="text-gray-400" size={30} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No properties found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to see more results.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPropertyTypes([]);
                    setPriceRange(['', '']);
                    setPriceFilterMode('list');
                    setMonthlyRange([0, 1000000]);
                    setSelectedConstructionStatus([]);
                    setSelectedListedBy([]);
                    setSelectedFurnished([]);
                    setSelectedAmenities([]);
                    setSelectedEntryFacing([]);
                    setSelectedExitFacing([]);
                    setReraOnly(false);
                    setSelectedFloorRanges([]);
                    setSelectedBuildingHeights([]);
                    setHouseTour({ showcase: false, video3d: false });
                    setMinParking(0);
                    setMinCarpetArea('');
                    setMinBuiltUpArea('');
                    setMinSuperArea('');
                    setYearBuiltRange({ min: '', max: '' });
                    setSelectedParkingTypes([]);
                    setSelectedViews([]);
                    setSelectedBedrooms([]);
                    setSelectedBathrooms([]);
                    setSelectedBalconies([]);
                    setSelectedOwnership([]);
                    setSelectedAdditionalRooms([]);
                    setShowAllInclusiveOnly(false);
                    setShowNegotiableOnly(false);
                    setShowTaxExcludedOnly(false);
                    setSelectedDocuments([]);
                  }}
                  className="mt-4 px-4 py-2 bg-brand-green text-white rounded-lg text-sm font-medium hover:bg-emerald-800"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
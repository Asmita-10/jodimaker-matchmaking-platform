'use client';

import React, { useState, useMemo } from 'react';
import { Profile } from '@/types';
import { Search, Filter, RefreshCw, Sparkles, User, MapPin } from 'lucide-react';

interface ClientListProps {
  profiles: Profile[];
  selectedClientId: string | null;
  onSelectClient: (client: Profile) => void;
}

export default function ClientList({ profiles, selectedClientId, onSelectClient }: ClientListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [maritalFilter, setMaritalFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Extract unique choices dynamically
  const cities = useMemo(() => ['All', ...Array.from(new Set(profiles.map(p => p.city))).sort()], [profiles]);
  const maritalStatuses = useMemo(() => ['All', ...Array.from(new Set(profiles.map(p => p.maritalStatus))).sort()], [profiles]);
  const statusTags = useMemo(() => ['All', ...Array.from(new Set(profiles.map(p => p.status))).sort()], [profiles]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setGenderFilter('All');
    setCityFilter('All');
    setMaritalFilter('All');
    setStatusFilter('All');
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = 
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGender = genderFilter === 'All' || profile.gender === genderFilter;
      const matchesCity = cityFilter === 'All' || profile.city === cityFilter;
      const matchesMarital = maritalFilter === 'All' || profile.maritalStatus === maritalFilter;
      const matchesStatus = statusFilter === 'All' || profile.status === statusFilter;

      return matchesSearch && matchesGender && matchesCity && matchesMarital && matchesStatus;
    });
  }, [profiles, searchQuery, genderFilter, cityFilter, maritalFilter, statusFilter]);

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';
      case 'Pending Match':
        return 'bg-amber-50 text-amber-700 border border-amber-200/50';
      case 'Matched':
        return 'bg-purple-50 text-purple-700 border border-purple-200/50';
      case 'On Hold':
        return 'bg-slate-50 text-slate-600 border border-slate-200/50';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200/50';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#faf7f2] border-r border-[#f0eae0] select-none">
      {/* Top Header */}
      <div className="p-5 border-b border-[#f0eae0] bg-[#faf7f2]">
        <h1 className="text-base font-extrabold text-[#1e1b4b] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#f43f5e] fill-current" />
          Clients Directory
          <span className="text-[10px] font-bold text-[#b45309] bg-[#fdf3f3] px-2 py-0.5 rounded-full border border-[#fce7e7] ml-auto">
            {filteredProfiles.length}
          </span>
        </h1>
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-3 bg-[#faf7f2] border-b border-[#f0eae0]">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name, profession, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#f0eae0] focus:border-[#f43f5e]/45 rounded-xl py-2.5 pl-9 pr-4 text-xs font-semibold text-[#1e1b4b] placeholder-slate-400 focus:outline-none transition-premium"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-semibold">
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-premium ${
              isFilterExpanded 
                ? 'bg-[#fce7e7] border-[#fbc4c4] text-[#e11d48]' 
                : 'bg-white border-[#f0eae0] text-slate-600 hover:text-[#1e1b4b] hover:border-slate-300'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {isFilterExpanded ? 'Hide Filters' : 'Show Filters'}
          </button>

          {(genderFilter !== 'All' || cityFilter !== 'All' || maritalFilter !== 'All' || statusFilter !== 'All' || searchQuery !== '') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[#f43f5e] hover:text-[#e11d48] transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Reset All
            </button>
          )}
        </div>

        {/* Filter Fields */}
        {isFilterExpanded && (
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#f0eae0] animate-slide-down">
            <div>
              <label className="block text-[9px] uppercase font-extrabold tracking-wider text-slate-400 mb-1">Gender</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="w-full bg-white border border-[#f0eae0] rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#f43f5e]/45"
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-extrabold tracking-wider text-slate-400 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white border border-[#f0eae0] rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#f43f5e]/45"
              >
                {statusTags.map(tag => (
                  <option key={tag} value={tag}>{tag === 'All' ? 'All Statuses' : tag}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-extrabold tracking-wider text-slate-400 mb-1">City</label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full bg-white border border-[#f0eae0] rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#f43f5e]/45"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-extrabold tracking-wider text-slate-400 mb-1">Marital Status</label>
              <select
                value={maritalFilter}
                onChange={(e) => setMaritalFilter(e.target.value)}
                className="w-full bg-white border border-[#f0eae0] rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#f43f5e]/45"
              >
                {maritalStatuses.map(status => (
                  <option key={status} value={status}>{status === 'All' ? 'All Maritals' : status}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Roster list */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#f5f1ea] custom-scrollbar px-3 py-2 space-y-1">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile) => {
            const isSelected = profile.id === selectedClientId;
            return (
              <button
                key={profile.id}
                onClick={() => onSelectClient(profile)}
                className={`w-full text-left p-3.5 rounded-2xl transition-all duration-300 flex items-start justify-between gap-3 focus:outline-none group ${
                  isSelected 
                    ? 'bg-white shadow-[0_10px_45px_rgba(79,70,40,0.045)] border-l-4 border-[#f43f5e] pl-2.5 translate-x-0.5' 
                    : 'hover:bg-white/60 hover:shadow-[0_5px_25px_rgba(79,70,40,0.02)] border-l-4 border-transparent pl-2.5 hover:scale-[1.01] hover:translate-x-0.5'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold text-sm text-[#1e1b4b] ${isSelected ? 'text-[#f43f5e]' : 'group-hover:text-[#f43f5e]'} transition-colors duration-300`}>
                      {profile.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold">
                      ({profile.age})
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium">
                    <span className="font-semibold text-slate-700">{profile.designation}</span> at <span className="font-semibold">{profile.company}</span>
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-[#b45309]" />
                      {profile.city}
                    </span>
                    <span>•</span>
                    <span>{profile.maritalStatus}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusBadgeStyles(profile.status)}`}>
                    {profile.status}
                  </span>
                  
                  <span className={`text-[9px] font-bold px-1.5 py-0.25 rounded-md ${
                    profile.gender === 'Male' 
                      ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                      : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {profile.gender}
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center h-48 space-y-2">
            <User className="w-8 h-8 text-slate-300" />
            <p className="text-xs">No clients found matching criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { Search } from 'lucide-react';

interface ContactFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  tags: string;
  onTagsChange: (value: string) => void;
}

export function ContactFilters({ 
  search, 
  onSearchChange, 
  status, 
  onStatusChange, 
  tags, 
  onTagsChange 
}: ContactFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
          <input
            type="text"
            placeholder="Search contacts by email or name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#e8e7e5] rounded-lg focus:ring-2 focus:ring-[#e9a589] focus:border-transparent text-[#3d3d3a] placeholder-[#6b6b6b]"
          />
        </div>
      </div>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2.5 border border-[#e8e7e5] rounded-lg focus:ring-2 focus:ring-[#e9a589] focus:border-transparent bg-card text-[#3d3d3a]"
      >
        <option value="">All Status</option>
        <option value="subscribed">Subscribed</option>
        <option value="unsubscribed">Unsubscribed</option>
        <option value="bounced">Bounced</option>
        <option value="complained">Complained</option>
      </select>

      {/* Tags Filter */}
      <input
        type="text"
        placeholder="Filter by tags..."
        value={tags}
        onChange={(e) => onTagsChange(e.target.value)}
        className="px-4 py-2.5 border border-[#e8e7e5] rounded-lg focus:ring-2 focus:ring-[#e9a589] focus:border-transparent w-full sm:w-48 text-[#3d3d3a] placeholder-[#6b6b6b]"
      />
    </div>
  );
}


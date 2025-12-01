'use client';

import { Search } from 'lucide-react';

interface CampaignFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
}

export function CampaignFilters({ 
  search, 
  onSearchChange, 
  status, 
  onStatusChange,
  type,
  onTypeChange
}: CampaignFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaigns by name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground bg-card"
          />
        </div>
      </div>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground"
      >
        <option value="">All Status</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="sending">Sending</option>
        <option value="sent">Sent</option>
        <option value="paused">Paused</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {/* Type Filter */}
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card w-full sm:w-48 text-foreground"
      >
        <option value="">All Types</option>
        <option value="one-time">One-Time</option>
        <option value="sequence">Sequence</option>
        <option value="automation">Automation</option>
      </select>
    </div>
  );
}


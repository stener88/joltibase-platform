'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ContactFilters } from '@/components/contacts/ContactFilters';
import { ContactTable } from '@/components/contacts/ContactTable';
import { Plus, Upload, Trash2 } from 'lucide-react';
import type { ContactWithLists } from '@/lib/types/contact';

type Contact = ContactWithLists;

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadContacts();
  }, [page, search, statusFilter, tagsFilter]);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });
      
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (tagsFilter) params.append('tags', tagsFilter);

      const response = await fetch(`/api/contacts?${params}`);
      const result = await response.json();

      if (result.success) {
        setContacts(result.data.contacts);
        setTotalPages(result.data.pagination.totalPages);
        setTotal(result.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadContacts();
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} contact(s)?`)) {
      return;
    }

    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/contacts/${id}`, { method: 'DELETE' })
        )
      );
      
      setSelectedIds(new Set());
      loadContacts();
    } catch (error) {
      console.error('Failed to delete contacts:', error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(contacts.map(c => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1);
      } else {
        loadContacts();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Action Buttons */}
        <div className="mb-8">
          <div className="flex items-center justify-end gap-3 mb-6">
              <button
                onClick={() => router.push('/dashboard/contacts/import')}
                className="group px-3 py-2 bg-transparent border border-border text-foreground rounded-lg hover:bg-muted hover:border-foreground transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                <Upload className="w-4 h-4 text-muted-foreground transition-colors" />
                Import CSV
              </button>
              <button
                onClick={() => router.push('/dashboard/contacts/new')}
                className="group px-3 py-2 bg-transparent border border-border text-foreground rounded-lg hover:bg-muted hover:border-foreground transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                <Plus className="w-4 h-4 text-muted-foreground transition-colors" />
                Add Contact
              </button>
          </div>

          {/* Filters */}
          <ContactFilters
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            tags={tagsFilter}
            onTagsChange={setTagsFilter}
          />
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="mb-4 p-4 bg-muted border border-border rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {selectedIds.size} contact{selectedIds.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && contacts.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <svg
              className="animate-spin h-12 w-12 text-foreground mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-600">Loading contacts...</p>
          </div>
        ) : (
          <ContactTable
            contacts={contacts}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onDelete={handleDelete}
            pagination={{ page, totalPages, total }}
            onPageChange={setPage}
          />
        )}
      </div>
    </DashboardLayout>
  );
}


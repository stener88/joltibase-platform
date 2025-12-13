'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ContactFilters } from '@/components/contacts/ContactFilters';
import { ContactTable } from '@/components/contacts/ContactTable';
import { ListsTab } from '@/components/contacts/ListsTab';
import { Plus, Upload, Trash2, Users, List } from 'lucide-react';
import { toast } from 'sonner';
import type { ContactWithLists } from '@/lib/types/contact';

type Contact = ContactWithLists;

type Tab = 'contacts' | 'lists';

export default function ContactsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const [lists, setLists] = useState<any[]>([]);
  const [selectedListIds, setSelectedListIds] = useState<Set<string>>(new Set());
  const [isAddingToList, setIsAddingToList] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (activeTab === 'contacts') {
      loadContacts();
    }
  }, [page, search, statusFilter, tagsFilter, activeTab]);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const response = await fetch('/api/lists');
      const result = await response.json();
      if (result.success) {
        setLists(result.data);
      }
    } catch (error) {
      console.error('Failed to load lists:', error);
    }
  };

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
        if (activeTab === 'contacts') {
          loadContacts();
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleAddToList = () => {
    if (selectedIds.size === 0) {
      toast.error('Please select contacts first');
      return;
    }
    setSelectedListIds(new Set());
    setShowAddToListModal(true);
  };

  const handleConfirmAddToList = async () => {
    if (selectedListIds.size === 0) {
      toast.error('Please select at least one list');
      return;
    }

    setIsAddingToList(true);
    try {
      const contactIds = Array.from(selectedIds);
      const listIdsArray = Array.from(selectedListIds);

      // Add contacts to each selected list
      await Promise.all(
        listIdsArray.map(listId =>
          fetch(`/api/lists/${listId}/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contactIds }),
          })
        )
      );

      toast.success(`Added ${contactIds.length} contact(s) to ${listIdsArray.length} list(s)`);
      setShowAddToListModal(false);
      setSelectedIds(new Set());
      loadLists();
    } catch (error) {
      console.error('Failed to add contacts to lists:', error);
      toast.error('Failed to add contacts to lists');
    } finally {
      setIsAddingToList(false);
    }
  };

  const toggleListSelection = (listId: string) => {
    setSelectedListIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(listId)) {
        newSet.delete(listId);
      } else {
        newSet.add(listId);
      }
      return newSet;
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`pb-3 px-1 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'contacts'
                  ? 'border-b-2 border-foreground text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" />
              Contacts
            </button>
            <button
              onClick={() => setActiveTab('lists')}
              className={`pb-3 px-1 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'lists'
                  ? 'border-b-2 border-foreground text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
              Lists
            </button>
          </div>

          {/* Action Buttons */}
          {activeTab === 'contacts' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard/contacts/import')}
                className="group px-3 py-2 bg-transparent border border-border text-foreground rounded-lg hover:bg-muted hover:border-foreground transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                <Upload className="w-4 h-4 text-muted-foreground transition-colors" />
                Import
              </button>
              <button
                onClick={() => router.push('/dashboard/contacts/new')}
                className="group px-3 py-2 bg-transparent border border-border text-foreground rounded-lg hover:bg-muted hover:border-foreground transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                <Plus className="w-4 h-4 text-muted-foreground transition-colors" />
                Add Contact
              </button>
            </div>
          )}
        </div>

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <>
            {/* Filters */}
            <div className="mb-6">
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
                    onClick={handleAddToList}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <List className="w-4 h-4" />
                    Add to List
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
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
          </>
        )}

        {/* Lists Tab */}
        {activeTab === 'lists' && (
          <ListsTab onSelectList={() => {}} />
        )}

        {/* Add to List Modal */}
        {showAddToListModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background border border-border rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">
                Add {selectedIds.size} contact{selectedIds.size !== 1 ? 's' : ''} to lists
              </h3>

              {lists.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No lists yet</p>
                  <button
                    onClick={() => {
                      setShowAddToListModal(false);
                      setActiveTab('lists');
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Create a list first
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
                  {lists.map((list) => (
                    <label
                      key={list.id}
                      className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedListIds.has(list.id)}
                        onChange={() => toggleListSelection(list.id)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{list.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {list.contact_count} contacts
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {lists.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleConfirmAddToList}
                    disabled={isAddingToList || selectedListIds.size === 0}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToList ? 'Adding...' : `Add to ${selectedListIds.size} list${selectedListIds.size !== 1 ? 's' : ''}`}
                  </button>
                  <button
                    onClick={() => setShowAddToListModal(false)}
                    disabled={isAddingToList}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


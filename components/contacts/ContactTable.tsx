'use client';

import { ContactRow } from './ContactRow';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ContactWithLists } from '@/lib/types/contact';

type Contact = ContactWithLists;

interface ContactTableProps {
  contacts: Contact[];
  selectedIds: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

export function ContactTable({
  contacts,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onDelete,
  pagination,
  onPageChange,
}: ContactTableProps) {
  const allSelected = contacts.length > 0 && contacts.every(c => selectedIds.has(c.id));
  const someSelected = contacts.some(c => selectedIds.has(c.id)) && !allSelected;

  if (contacts.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-[#e8e7e5] p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-[#3d3d3a] mb-2">No contacts found</h3>
        <p className="text-[#6b6b6b] mb-6">
          Get started by adding your first contact or importing from CSV
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-[#e8e7e5] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#e8e7e5]">
          <thead className="bg-muted">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-[#e9a589] border-[#e8e7e5] rounded focus:ring-[#e9a589]"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">
                Tags
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">
                Lists
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">
                Added
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#6b6b6b] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-[#e8e7e5]">
            {contacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                isSelected={selectedIds.has(contact.id)}
                onSelect={onSelectOne}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-[#e8e7e5] flex items-center justify-between">
        <div className="text-sm text-[#6b6b6b]">
          Showing page <span className="font-medium text-[#3d3d3a]">{pagination.page}</span> of{' '}
          <span className="font-medium text-[#3d3d3a]">{pagination.totalPages}</span>
          {' '}({pagination.total} total contacts)
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}


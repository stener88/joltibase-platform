'use client';

import Link from 'next/link';
import { StatusBadge } from './StatusBadge';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { ContactWithLists } from '@/lib/types/contact';

type Contact = ContactWithLists;

interface ContactRowProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
}

export function ContactRow({ contact, isSelected, onSelect, onDelete }: ContactRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const fullName = [contact.first_name, contact.last_name].filter(Boolean).join(' ') || '-';

  return (
    <tr className="hover:bg-muted transition-colors">
      {/* Checkbox */}
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(contact.id, e.target.checked)}
          className="w-4 h-4 text-[#e9a589] border-gray-300 rounded focus:ring-[#e9a589]"
        />
      </td>

      {/* Email */}
      <td className="px-6 py-4 whitespace-nowrap">
        <Link 
          href={`/dashboard/contacts/${contact.id}`}
          className="text-sm font-medium text-[#e9a589] hover:text-[#e9a589]/80"
        >
          {contact.email}
        </Link>
      </td>

      {/* Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{fullName}</div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={contact.status} />
      </td>

      {/* Tags */}
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {contact.tags && contact.tags.length > 0 ? (
            contact.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
          {contact.tags && contact.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{contact.tags.length - 3}</span>
          )}
        </div>
      </td>

      {/* Lists */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {contact.lists && contact.lists.length > 0 ? (
            <span>{contact.lists.length} list{contact.lists.length !== 1 ? 's' : ''}</span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      </td>

      {/* Added Date */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {new Date(contact.created_at).toLocaleDateString()}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-10">
              <Link
                href={`/dashboard/contacts/${contact.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={() => {
                  setShowMenu(false);
                  if (confirm('Are you sure you want to delete this contact?')) {
                    onDelete(contact.id);
                  }
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}


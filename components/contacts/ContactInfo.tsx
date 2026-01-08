import { Mail, User, Calendar, Tag, List } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { ContactWithLists } from '@/lib/types/contact';

type Contact = ContactWithLists & {
  updated_at: string;
};

interface ContactInfoProps {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
}

export function ContactInfo({ contact, onEdit, onDelete }: ContactInfoProps) {
  const fullName = [contact.first_name, contact.last_name].filter(Boolean).join(' ') || 'No name';
  const initial = contact.first_name?.charAt(0) || contact.email.charAt(0);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Avatar and Name */}
      <div className="text-center mb-6 pb-6 border-b border-border">
        <div className="w-20 h-20 rounded-full bg-[#1a1aff] text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
          {initial.toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-1">{fullName}</h2>
        <p className="text-muted-foreground mb-3">{contact.email}</p>
        <StatusBadge status={contact.status} />
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        {/* Email */}
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-sm text-foreground font-medium break-all">{contact.email}</p>
          </div>
        </div>

        {/* Name */}
        {(contact.first_name || contact.last_name) && (
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-sm text-gray-900 font-medium">{fullName}</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {contact.tags && contact.tags.length > 0 && (
          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {contact.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lists */}
        {contact.lists && contact.lists.length > 0 && (
          <div className="flex items-start gap-3">
            <List className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Lists</p>
              <div className="space-y-1">
                {contact.lists.map((list) => (
                  <p key={list.id} className="text-sm text-foreground">
                    {list.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="text-sm text-foreground font-medium">
              {new Date(contact.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {contact.subscribed_at && (
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Subscribed</p>
              <p className="text-sm text-foreground font-medium">
                {new Date(contact.subscribed_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6 border-t border-border">
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-2.5 bg-[#1a1aff] text-white rounded-lg hover:bg-[#0000cc] transition-colors"
        >
          Edit Contact
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2.5 bg-card border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}


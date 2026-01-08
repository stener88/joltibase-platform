'use client';

import { useRouter } from 'next/navigation';

interface Contact {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  engagement_score: number;
  emails_sent?: number;
  last_opened?: string | null;
}

interface ContactsTableProps {
  contacts: Contact[];
  title: string;
  emptyMessage?: string;
}

export function ContactsTable({ contacts, title, emptyMessage = 'No contacts found' }: ContactsTableProps) {
  const router = useRouter();

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-muted">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engagement
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => router.push(`/dashboard/contacts/${contact.id}`)}
                  className="hover:bg-muted cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">
                      {contact.first_name || contact.last_name 
                        ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                        : contact.email
                      }
                    </div>
                    {(contact.first_name || contact.last_name) && (
                      <div className="text-sm text-muted-foreground">{contact.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      contact.engagement_score >= 60
                        ? 'bg-green-100 text-green-800'
                        : contact.engagement_score >= 30
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {contact.engagement_score}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


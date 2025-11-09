// Contact Management Types
// Aligned with existing database schema

export type ContactStatus = 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
export type ContactSource = 'manual' | 'api' | 'import' | 'form';

export interface Contact {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  status: ContactStatus;
  engagement_score: number;
  metadata: Record<string, any>;
  tags: string[];
  source: ContactSource;
  subscribed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactWithLists extends Contact {
  lists?: Array<{ id: string; name: string }>;
}

export interface ContactWithEmailHistory extends ContactWithLists {
  emailHistory?: EmailEvent[];
}

export interface EmailEvent {
  id: string;
  subject: string;
  status: string;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  campaign_id: string | null;
  campaigns?: { name: string } | null;
}

export interface CreateContactInput {
  email: string;
  firstName?: string;
  lastName?: string;
  status?: ContactStatus;
  tags?: string[];
  metadata?: Record<string, any>;
  listIds?: string[];
}

export interface UpdateContactInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  status?: ContactStatus;
  tags?: string[];
  metadata?: Record<string, any>;
  listIds?: string[];
}

export interface ContactListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContactStatus | '';
  tags?: string;
}

export interface ContactListResponse {
  contacts: ContactWithLists[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


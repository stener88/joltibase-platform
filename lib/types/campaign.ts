// Campaign Management Types
// Aligned with existing database schema

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
export type CampaignType = 'one-time' | 'sequence' | 'automation';

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  ai_generated: boolean;
  ai_prompt: string | null;
  subject_line: string | null;
  preview_text: string | null;
  from_name: string;
  from_email: string;
  reply_to_email: string | null;
  html_content: string | null;
  plain_text: string | null;
  send_config: Record<string, any>;
  list_ids: string[];
  scheduled_at: string | null;
  sent_at: string | null;
  stats: CampaignStats;
  created_at: string;
  updated_at: string;
  ai_model: string | null;
  ai_metadata: Record<string, any> | null;
}

export interface CampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
}

export interface CampaignListParams {
  page?: number;
  limit?: number;
  status?: CampaignStatus | '';
  search?: string;
  type?: CampaignType | '';
}

export interface CampaignListResponse {
  campaigns: Campaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCampaignInput {
  name: string;
  type: CampaignType;
  from_name: string;
  from_email: string;
  reply_to_email?: string;
  subject_line?: string;
  preview_text?: string;
  html_content?: string;
  plain_text?: string;
  list_ids?: string[];
}


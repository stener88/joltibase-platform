// Campaign Management Types (V3)
// Aligned with campaigns_v3 database schema

export type CampaignStatus = 'draft' | 'ready' | 'scheduled' | 'sent';
export type CampaignType = 'one-time' | 'sequence' | 'automation';

export interface Campaign {
  id: string;
  user_id: string;
  
  // Campaign metadata
  name: string | null;
  status: CampaignStatus;
  subject_line: string;
  preview_text: string | null;
  
  // V3 Code generation
  component_filename: string;
  component_code: string;
  html_content: string;
  default_props: Record<string, any>;
  
  // RAG metadata
  patterns_used: string[] | null;
  generation_prompt: string | null;
  
  // Versioning
  version: number;
  previous_version_id: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  
  // Optional fields for sending
  type?: CampaignType;
  from_name?: string;
  from_email?: string;
  reply_to_email?: string | null;
  list_ids?: string[];
  scheduled_at?: string | null;
  stats?: CampaignStats;
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
  name?: string;
  subject_line: string;
  preview_text?: string;
  component_filename: string;
  component_code: string;
  html_content: string;
  default_props?: Record<string, any>;
  patterns_used?: string[];
  generation_prompt?: string;
  type?: CampaignType;
  from_name?: string;
  from_email?: string;
  reply_to_email?: string;
  list_ids?: string[];
}

// Visual Editor Types
export interface ComponentContext {
  type: 'text' | 'button' | 'heading' | 'section' | 'image' | 'container';
  id?: string;
  currentText?: string;
  currentStyles?: Record<string, string>;
  tagName?: string;
  className?: string;
  fullContent?: string;
  parentContext?: string;
}


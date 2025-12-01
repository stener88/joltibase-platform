/**
 * Brand Identity Types
 * Defines the structure for user-specific brand kits
 */

export interface BrandIdentity {
  id?: string;
  userId?: string;
  
  // Visual Identity
  companyName: string;
  primaryColor: string;
  secondaryColor?: string;
  logoUrl?: string;
  
  // Voice & Tone
  tone?: 'professional' | 'friendly' | 'casual' | 'luxurious' | 'playful';
  formality?: 'formal' | 'conversational' | 'casual';
  personality?: string;
  examplePhrases?: string[];
  
  // Settings
  enabled?: boolean; // Toggle to enable/disable brand application
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandKitDbRow {
  id: string;
  user_id: string;
  company_name: string;
  primary_color: string;
  secondary_color: string | null;
  logo_url: string | null;
  tone: BrandIdentity['tone'] | null;
  formality: BrandIdentity['formality'] | null;
  personality: string | null;
  example_phrases: string[] | null;
  enabled: boolean | null;
  created_at: string;
  updated_at: string;
}

/**
 * Convert database row to BrandIdentity interface
 */
export function fromDbRow(row: BrandKitDbRow): BrandIdentity {
  return {
    id: row.id,
    userId: row.user_id,
    companyName: row.company_name,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color || undefined,
    logoUrl: row.logo_url || undefined,
    tone: row.tone || undefined,
    formality: row.formality || undefined,
    personality: row.personality || undefined,
    examplePhrases: row.example_phrases || undefined,
    enabled: row.enabled !== false, // Default to true if null
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Convert BrandIdentity to database payload
 */
export function toDbPayload(brand: BrandIdentity, userId: string) {
  return {
    user_id: userId,
    company_name: brand.companyName,
    primary_color: brand.primaryColor,
    secondary_color: brand.secondaryColor || null,
    logo_url: brand.logoUrl || null,
    tone: brand.tone || null,
    formality: brand.formality || null,
    personality: brand.personality || null,
    example_phrases: brand.examplePhrases || null,
    enabled: brand.enabled !== false, // Default to true
  };
}


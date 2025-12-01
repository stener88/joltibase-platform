'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings2, Upload, X, Check, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { BrandIdentity } from '@/lib/types/brand';

interface BrandSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBrand?: BrandIdentity | null;
  onSave: (brand: BrandIdentity) => void;
}

export function BrandSettingsModal({ isOpen, onClose, currentBrand, onSave }: BrandSettingsModalProps) {
  const [companyName, setCompanyName] = useState(currentBrand?.companyName || '');
  const [primaryColor, setPrimaryColor] = useState(currentBrand?.primaryColor || '#5f6ad1');
  const [secondaryColor, setSecondaryColor] = useState(currentBrand?.secondaryColor || '#1a1a1a');
  const [logoUrl, setLogoUrl] = useState(currentBrand?.logoUrl || '');
  const [tone, setTone] = useState<BrandIdentity['tone']>(currentBrand?.tone || 'professional');
  const [formality, setFormality] = useState<BrandIdentity['formality']>(currentBrand?.formality || 'conversational');
  const [personality, setPersonality] = useState(currentBrand?.personality || '');
  const [enabled, setEnabled] = useState(currentBrand?.enabled !== false); // Default to true
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && currentBrand) {
      setCompanyName(currentBrand.companyName);
      setPrimaryColor(currentBrand.primaryColor);
      setSecondaryColor(currentBrand.secondaryColor || '#1a1a1a');
      setLogoUrl(currentBrand.logoUrl || '');
      setTone(currentBrand.tone || 'professional');
      setFormality(currentBrand.formality || 'conversational');
      setPersonality(currentBrand.personality || '');
      setEnabled(currentBrand.enabled !== false);
    }
  }, [isOpen, currentBrand]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo must be less than 2MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, JPG, or SVG file');
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/logo-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('brand-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('brand-logos')
        .getPublicUrl(fileName);

      setLogoUrl(publicUrl);
    } catch (error) {
      console.error('Logo upload failed:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!companyName || !primaryColor) return;

    setIsSaving(true);
    
    const brandData: BrandIdentity = {
      companyName,
      primaryColor,
      secondaryColor,
      logoUrl: logoUrl || undefined,
      tone,
      formality,
      personality: personality || undefined,
      enabled,
    };

    onSave(brandData);
    setIsSaving(false);
    onClose();
  };

  // Get sample text based on tone/formality
  const getSampleText = () => {
    if (tone === 'professional' && formality === 'formal') {
      return 'We are pleased to present our latest offering.';
    }
    if (tone === 'friendly' && formality === 'conversational') {
      return 'Hey there! Check out what we\'ve been working on.';
    }
    if (tone === 'casual' && formality === 'casual') {
      return 'Hey! You\'re gonna love this.';
    }
    if (tone === 'luxurious') {
      return 'Discover our exclusive collection.';
    }
    if (tone === 'playful') {
      return 'Ready for something awesome? 🎉';
    }
    return 'Check out our latest update.';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Settings2 className="w-4 h-4" />
            Brand Identity
          </DialogTitle>
          <DialogDescription className="text-xs">
            Customize your emails with your brand colors, logo, and voice.
          </DialogDescription>
        </DialogHeader>

        {/* Brand Toggle */}
        <div className="flex items-center justify-between p-3 bg-card border border-border rounded">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full border-2" 
              style={{ 
                backgroundColor: enabled ? primaryColor : 'transparent',
                borderColor: enabled ? primaryColor : 'hsl(var(--muted-foreground))'
              }}
            />
            <div>
              <p className="text-xs font-medium">
                {enabled ? 'Brand Active' : 'Brand Inactive'}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {enabled ? 'Your brand will be applied to all emails' : 'Generate emails without brand'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              enabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enabled ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Scrollable content with custom scrollbar */}
        <div className="overflow-y-auto flex-1 px-1 brand-modal-scroll">
          <div className="space-y-4 pr-2">
            {/* Company Name */}
            <div className="space-y-1.5">
              <Label htmlFor="company-name" className="text-xs">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company-name"
                placeholder="Acme Inc"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Colors - More compact */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="primary-color" className="text-xs">
                  Primary <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-1.5">
                  <Input
                    id="primary-color"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-9 p-0.5 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#5f6ad1"
                    className="flex-1 font-mono text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="secondary-color" className="text-xs">
                  Secondary
                </Label>
                <div className="flex gap-1.5">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-9 p-0.5 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    placeholder="#1a1a1a"
                    className="flex-1 font-mono text-xs h-9"
                  />
                </div>
              </div>
            </div>

            {/* Logo Upload - Compact with Loading State */}
            <div className="space-y-1.5">
              <Label htmlFor="logo" className="text-xs">
                Logo <span className="text-muted-foreground text-[10px]">(optional)</span>
              </Label>
              
              {logoUrl ? (
                <div className="border border-border rounded p-3 bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-12 h-12 border border-border rounded bg-background flex items-center justify-center overflow-hidden">
                        <img src={logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Logo uploaded</p>
                        <p className="text-[10px] text-muted-foreground">Ready to use</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLogoUrl('')}
                      type="button"
                      className="h-7 w-7 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ) : isUploading ? (
                <div className="border-2 border-dashed border-primary/50 rounded p-4 text-center bg-primary/5">
                  <div className="w-6 h-6 mx-auto mb-2 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-primary font-medium mb-0.5">Uploading logo...</p>
                  <p className="text-[10px] text-muted-foreground">Please wait</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded p-3 text-center bg-card hover:bg-muted transition-colors">
                  <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-foreground mb-0.5">Upload logo</p>
                  <p className="text-[10px] text-muted-foreground mb-2">PNG, JPG, SVG (max 2MB)</p>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('logo-upload')?.click();
                      }}
                      type="button"
                    >
                      Choose File
                    </Button>
                  </label>
                </div>
              )}
            </div>

            {/* Tone & Voice - Compact */}
            <div className="space-y-2 p-3 border border-border rounded bg-card">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <h4 className="font-semibold text-xs">Voice & Tone</h4>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Tone */}
                <div className="space-y-1.5">
                  <Label className="text-[10px]">Tone</Label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as BrandIdentity['tone'])}
                    className="w-full text-xs bg-background border border-border rounded px-2 py-1.5 text-foreground h-8"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="casual">Casual</option>
                    <option value="luxurious">Luxurious</option>
                    <option value="playful">Playful</option>
                  </select>
                </div>

                {/* Formality */}
                <div className="space-y-1.5">
                  <Label className="text-[10px]">Formality</Label>
                  <select
                    value={formality}
                    onChange={(e) => setFormality(e.target.value as BrandIdentity['formality'])}
                    className="w-full text-xs bg-background border border-border rounded px-2 py-1.5 text-foreground h-8"
                  >
                    <option value="formal">Formal</option>
                    <option value="conversational">Conversational</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>
              </div>

              {/* Personality */}
              <div className="space-y-1.5">
                <Label className="text-[10px]">Personality</Label>
                <Textarea
                  placeholder="e.g., Energetic and approachable"
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  className="text-xs min-h-[50px] resize-none"
                />
              </div>
            </div>

            {/* Preview - Compact */}
            <div className="space-y-1.5">
              <Label className="text-xs">Preview</Label>
              <div className="border border-border rounded p-3 bg-background space-y-2">
                <div className="flex items-center justify-between">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-6 object-contain" />
                  ) : (
                    <div className="text-xs font-semibold">
                      {companyName || 'Your Company'}
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {getSampleText()}
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium text-white rounded"
                  style={{ backgroundColor: primaryColor }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3">
          <Button variant="outline" onClick={onClose} type="button" className="h-8 text-xs">
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!companyName || !primaryColor || isSaving}
            type="button"
            className="h-8 text-xs"
          >
            {isSaving ? 'Saving...' : (
              <>
                <Check className="w-3 h-3 mr-1.5" />
                Save
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


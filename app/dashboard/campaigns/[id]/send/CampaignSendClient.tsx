'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ChevronLeft, Mail, Users, Send } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

type SendStep = 'sender' | 'subject' | 'contacts';

interface SenderAddress {
  id: string;
  email: string;
  name: string;
  is_verified: boolean;
}

interface ContactList {
  id: string;
  name: string;
  description: string | null;
  contact_count: number;
}

interface Campaign {
  id: string;
  html_content: string;
  subject_line: string | null;
  preview_text: string | null;
  status: string;
}

interface CampaignSendClientProps {
  campaign: Campaign;
  lists: ContactList[];
  sender: SenderAddress | null;
}

export function CampaignSendClient({ campaign, lists, sender: initialSender }: CampaignSendClientProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SendStep>('sender');
  
  // Step 1: Sender
  const [sender, setSender] = useState<SenderAddress | null>(initialSender);
  const [senderName, setSenderName] = useState(initialSender?.name || '');
  
  // Step 2: Subject & Preview
  const [subjectLine, setSubjectLine] = useState(campaign.subject_line || '');
  const [previewText, setPreviewText] = useState(campaign.preview_text || '');
  
  // Step 3: Contacts
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [totalContacts, setTotalContacts] = useState(0);
  
  // Loading states
  const [isSending, setIsSending] = useState(false);

  // Calculate total contacts when selection changes
  useEffect(() => {
    const total = lists
      .filter(list => selectedLists.includes(list.id))
      .reduce((sum, list) => sum + list.contact_count, 0);
    setTotalContacts(total);
  }, [selectedLists, lists]);

  const handleNext = () => {
    if (currentStep === 'sender') {
      if (!senderName.trim()) {
        toast.error('Please enter a sender name');
        return;
      }
      setCurrentStep('subject');
    } else if (currentStep === 'subject') {
      if (!subjectLine.trim()) {
        toast.error('Please enter a subject line');
        return;
      }
      setCurrentStep('contacts');
    }
  };

  const handleBack = () => {
    if (currentStep === 'subject') {
      setCurrentStep('sender');
    } else if (currentStep === 'contacts') {
      setCurrentStep('subject');
    }
  };

  const handleSend = async () => {
    if (selectedLists.length === 0) {
      toast.error('Please select at least one contact list');
      return;
    }

    if (totalContacts === 0) {
      toast.error('No contacts to send to');
      return;
    }

    if (!sender?.id) {
      toast.error('No sender address configured');
      return;
    }

    setIsSending(true);
    try {
      // Update campaign with final details first
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('campaigns_v3')
        .update({
          subject_line: subjectLine,
          preview_text: previewText,
        })
        .eq('id', campaign.id);

      if (updateError) {
        console.error('Failed to update campaign:', updateError);
        throw new Error('Failed to update campaign details');
      }

      // Send campaign via API
      const response = await fetch(`/api/v3/campaigns/${campaign.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName,
          senderAddressId: sender.id,
          listIds: selectedLists,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to send campaign');
      }

      // Success!
      toast.success(`🎉 Campaign sent to ${result.data.recipientCount} contacts!`);
      
      // Show success message for a moment, then redirect
      setTimeout(() => {
        router.push(`/dashboard/campaigns/${campaign.id}/preview`);
      }, 1500);

    } catch (error: any) {
      console.error('Failed to send campaign:', error);
      toast.error(error.message || 'Failed to send campaign');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Form */}
      <div className="w-[55%] p-12 overflow-y-auto border-r flex items-center justify-center">
        <div className="w-full max-w-lg">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className={`text-muted-foreground hover:text-foreground transition-colors mb-8 flex items-center gap-1 ${
              currentStep === 'sender' ? 'invisible' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className={`w-2 h-2 rounded-full transition-colors ${
              currentStep === 'sender' ? 'bg-foreground' : 'bg-muted-foreground/30'
            }`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${
              currentStep === 'subject' ? 'bg-foreground' : 'bg-muted-foreground/30'
            }`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${
              currentStep === 'contacts' ? 'bg-foreground' : 'bg-muted-foreground/30'
            }`} />
          </div>

          {/* Step Content */}
          {currentStep === 'sender' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-foreground text-center mb-8">
                Who's this email coming from?
              </h1>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="sender-name" className="text-xs font-normal text-muted-foreground">From name</Label>
                  <Input
                    id="sender-name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1 h-10 text-sm"
                  />
                </div>

                <div>
                  <Input
                    value={sender?.email || ''}
                    disabled
                    className="bg-muted/50 h-10 text-sm text-muted-foreground border-muted"
                  />
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                    If you'd like to send from a different email address,{' '}
                    <Link href="/dashboard/settings" className="text-foreground underline hover:no-underline">
                      manage senders here.
                    </Link>
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Button onClick={handleNext} className="w-full h-11 text-sm font-semibold">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'subject' && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-foreground text-center">
                Write your subject line
              </h1>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="subject" className="text-sm font-medium">Subject line</Label>
                  <div className="relative">
                    <Input
                      id="subject"
                      value={subjectLine}
                      onChange={(e) => setSubjectLine(e.target.value)}
                      placeholder="30% Off Storewide! Don't Miss Out"
                      className="mt-2 h-12 pr-16"
                      maxLength={100}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {subjectLine.length}/100
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="preview" className="text-sm font-medium">Preview text</Label>
                    <span className="text-xs text-muted-foreground">(optional)</span>
                  </div>
                  <div className="relative">
                    <Textarea
                      id="preview"
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      placeholder="Shop now and save big before..."
                      className="resize-none pr-16"
                      rows={3}
                      maxLength={90}
                    />
                    <span className="absolute right-3 bottom-3 text-xs text-muted-foreground">
                      {previewText.length}/90
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Button onClick={handleNext} className="w-full h-12 text-base font-semibold">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'contacts' && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-foreground text-center">
                Choose your recipients
              </h1>

              <div className="space-y-4">
                {lists.length === 0 ? (
                  <div className="text-center p-12 bg-muted/30 rounded-lg border-2 border-dashed">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4 text-sm">
                      You don't have any contact lists yet
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/dashboard/contacts')}
                      className="h-10"
                    >
                      Create Contact List
                    </Button>
                  </div>
                ) : (
                  <>
                    {lists.map((list) => (
                      <label
                        key={list.id}
                        className="flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer hover:border-primary/50 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLists.includes(list.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLists([...selectedLists, list.id]);
                            } else {
                              setSelectedLists(selectedLists.filter(id => id !== list.id));
                            }
                          }}
                          className="mt-0.5 w-4 h-4"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground">{list.name}</div>
                          {list.description && (
                            <div className="text-sm text-muted-foreground mt-1">{list.description}</div>
                          )}
                          <div className="text-xs text-muted-foreground mt-2">
                            {list.contact_count} {list.contact_count === 1 ? 'subscriber' : 'subscribers'}
                          </div>
                        </div>
                      </label>
                    ))}

                    {totalContacts > 0 && (
                      <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-5 mt-6">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">Total Recipients</span>
                          <span className="text-2xl font-bold text-primary">{totalContacts}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="pt-8">
                <Button 
                  onClick={handleSend} 
                  disabled={selectedLists.length === 0 || totalContacts === 0 || isSending}
                  className="w-full h-12 text-base font-semibold"
                >
                  {isSending ? 'Sending...' : `Send to ${totalContacts} ${totalContacts === 1 ? 'Contact' : 'Contacts'}`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Email Preview */}
      <div className="w-[45%] bg-muted/30 p-12 overflow-y-auto flex items-center justify-center">
        <div className="w-full max-w-sm">
          {/* Email Client Mockup */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
            {/* Email Body */}
            <iframe 
              srcDoc={campaign.html_content}
              className="w-full h-[450px] border-0"
              title="Email Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


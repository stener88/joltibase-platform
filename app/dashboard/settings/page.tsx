'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface SenderAddress {
  id: string;
  email: string;
  name: string;
  is_default: boolean;
  is_verified: boolean;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sender, setSender] = useState<SenderAddress | null>(null);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    fetchSenderAddress();
  }, []);

  const fetchSenderAddress = async () => {
    try {
      const response = await fetch('/api/sender-addresses');
      const result = await response.json();

      if (result.success && result.data.default) {
        setSender(result.data.default);
        setEditedName(result.data.default.name);
      }
    } catch (error) {
      console.error('Failed to fetch sender:', error);
      toast.error('Failed to load sender settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!sender || !editedName.trim()) return;

    setSaving(true);
    try {
      const response = await fetch('/api/sender-addresses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: sender.id,
          name: editedName.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Sender name updated successfully');
        setSender({ ...sender, name: editedName.trim() });
      } else {
        toast.error(result.error || 'Failed to update sender name');
      }
    } catch (error) {
      console.error('Failed to update sender:', error);
      toast.error('Failed to update sender name');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">
        Manage your sender addresses and email settings.
      </p>

      {/* Sender Address Section */}
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Default Sender Address
        </h2>
        
        {sender ? (
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                💡 <strong>Tip:</strong> Increase your chances of landing in the inbox and look more 
                professional with a custom domain sender address.{' '}
                <span className="underline cursor-not-allowed opacity-50">
                  Learn more
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender-name">From Name</Label>
              <p className="text-sm text-muted-foreground">
                Appears in the "from" area when you send an email
              </p>
              <Input
                id="sender-name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="e.g., John Smith"
                className="max-w-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender-email">From Email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="sender-email"
                  value={sender.email}
                  disabled
                  className="max-w-md bg-muted"
                />
                {sender.is_verified && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Your verified sending address
              </p>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSave}
                disabled={saving || editedName === sender.name}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">
            No sender address configured. Please contact support.
          </div>
        )}
      </div>

      {/* Coming Soon: Custom Domain */}
      <div className="bg-card rounded-lg border p-6 opacity-60">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Custom Domain Sender
        </h2>
        <p className="text-muted-foreground mb-4">
          Send from your own domain (e.g., hello@yourbrand.com) for better deliverability 
          and brand recognition.
        </p>
        <Button disabled variant="outline">
          Add Custom Domain (Coming Soon)
        </Button>
      </div>
    </div>
  );
}

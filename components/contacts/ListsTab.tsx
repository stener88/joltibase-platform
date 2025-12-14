'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface List {
  id: string;
  name: string;
  description: string | null;
  contact_count: number;
  created_at: string;
  updated_at: string;
}

interface ListsTabProps {
  onSelectList?: (listId: string) => void;
}

export function ListsTab({ onSelectList }: ListsTabProps) {
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingList, setEditingList] = useState<List | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/lists');
      const result = await response.json();

      if (result.success) {
        setLists(result.data);
      } else {
        toast.error('Failed to load lists');
      }
    } catch (error) {
      console.error('Failed to load lists:', error);
      toast.error('Failed to load lists');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({ name: '', description: '' });
    setEditingList(null);
    setShowCreateModal(true);
  };

  const handleEdit = (list: List) => {
    setFormData({ name: list.name, description: list.description || '' });
    setEditingList(list);
    setShowCreateModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('List name is required');
      return;
    }

    setIsSaving(true);
    try {
      const url = editingList ? `/api/lists/${editingList.id}` : '/api/lists';
      const method = editingList ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(editingList ? 'List updated' : 'List created');
        setShowCreateModal(false);
        loadLists();
      } else {
        toast.error(result.error || 'Failed to save list');
      }
    } catch (error) {
      console.error('Failed to save list:', error);
      toast.error('Failed to save list');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (list: List) => {
    if (!confirm(`Are you sure you want to delete "${list.name}"? This will remove all contacts from this list.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/lists/${list.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('List deleted');
        loadLists();
      } else {
        toast.error(result.error || 'Failed to delete list');
      }
    } catch (error) {
      console.error('Failed to delete list:', error);
      toast.error('Failed to delete list');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Lists</h2>
          <p className="text-sm text-muted-foreground">Organize your contacts into lists</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create List
        </Button>
      </div>

      {/* Lists Grid */}
      {lists.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground mb-4">No lists yet</p>
          <Button onClick={handleCreate} variant="outline" className="flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" />
            Create Your First List
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className="border border-border rounded-lg p-4 hover:border-foreground/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground truncate flex-1">{list.name}</h3>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => handleEdit(list)}
                    className="p-1.5 hover:bg-muted rounded transition-colors"
                    title="Edit list"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(list)}
                    className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                    title="Delete list"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
              {list.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {list.description}
                </p>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {list.contact_count} {list.contact_count === 1 ? 'contact' : 'contacts'}
                </span>
                <button
                  onClick={() => onSelectList?.(list.id)}
                  className="text-primary hover:underline font-medium"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingList ? 'Edit List' : 'Create New List'}
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="list-name">Name *</Label>
                <Input
                  id="list-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Newsletter Subscribers"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="list-description">Description</Label>
                <Textarea
                  id="list-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description for this list"
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Button
                onClick={handleSave}
                disabled={isSaving || !formData.name.trim()}
                className="flex-1"
              >
                {isSaving ? 'Saving...' : editingList ? 'Update' : 'Create'}
              </Button>
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


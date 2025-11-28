'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImagePickerUnsplash, type SelectedImage } from './ImagePickerUnsplash';
import { ImagePickerUrl } from './ImagePickerUrl';

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (image: SelectedImage) => void;
  currentSrc?: string;
  currentAlt?: string;
}

export function ImagePicker({ 
  isOpen, 
  onClose, 
  onSelectImage, 
  currentSrc = '', 
  currentAlt = '' 
}: ImagePickerProps) {
  const [activeTab, setActiveTab] = useState<'unsplash' | 'url'>('unsplash');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose Image</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'unsplash' | 'url')} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unsplash">
              🔍 Search Unsplash
            </TabsTrigger>
            <TabsTrigger value="url">
              🔗 Image URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unsplash" className="flex-1 overflow-hidden mt-4">
            <ImagePickerUnsplash 
              onSelect={onSelectImage}
              onClose={onClose}
            />
          </TabsContent>

          <TabsContent value="url" className="flex-1 overflow-auto mt-4">
            <ImagePickerUrl 
              onSelect={onSelectImage}
              onClose={onClose}
              currentSrc={currentSrc}
              currentAlt={currentAlt}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}


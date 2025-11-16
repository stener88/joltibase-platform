'use client';

import { useState, useEffect } from 'react';
import { EmailBlock, GlobalEmailSettings, getBlockDisplayName } from '@/lib/email/blocks/types';
import { SettingsTabs } from '../shared/SettingsTabs';
import { GlobalSettingsPanel } from './GlobalSettingsPanel';
import { TextBlockSettings } from './blocks/TextBlockSettings';
import { ButtonBlockSettings } from './blocks/ButtonBlockSettings';
import { ImageBlockSettings } from './blocks/ImageBlockSettings';
import { LogoBlockSettings } from './blocks/LogoBlockSettings';
import { LogoContentSettings } from './blocks/LogoContentSettings';
import { ImageContentSettings } from './blocks/ImageContentSettings';
import { SpacerBlockSettings } from './blocks/SpacerBlockSettings';
import { DividerBlockSettings } from './blocks/DividerBlockSettings';
import { SocialLinksBlockSettings } from './blocks/SocialLinksBlockSettings';
import { FooterBlockSettings } from './blocks/FooterBlockSettings';
import { LinkBarBlockSettings } from './blocks/LinkBarBlockSettings';
import { AddressBlockSettings } from './blocks/AddressBlockSettings';
import { LayoutBlockSettings } from './blocks/LayoutBlockSettings';
import { LayoutVariationSelector } from './layouts/LayoutVariationSelector';

interface BlockSettingsPanelProps {
  selectedBlock: EmailBlock | null;
  designConfig: GlobalEmailSettings;
  onUpdateBlock: (blockId: string, updates: Partial<EmailBlock>) => void;
  onUpdateDesignConfig: (updates: Partial<GlobalEmailSettings>) => void;
  campaignId?: string;
}

export function BlockSettingsPanel({
  selectedBlock,
  designConfig,
  onUpdateBlock,
  onUpdateDesignConfig,
  campaignId,
}: BlockSettingsPanelProps) {
  // Set default tab based on block type
  const getDefaultTab = () => {
    if (!selectedBlock) return 'block';
    if (selectedBlock.type === 'logo') return 'logo';
    if (selectedBlock.type === 'image') return 'image';
    return 'block';
  };
  
  const [activeTab, setActiveTab] = useState(getDefaultTab());
  
  // Reset tab when selected block changes
  useEffect(() => {
    if (selectedBlock) {
      setActiveTab(getDefaultTab());
    }
  }, [selectedBlock?.id, selectedBlock?.type]);

  // No block selected - show global settings
  if (!selectedBlock) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 text-center">
            Global Settings
          </h3>
        </div>
        <GlobalSettingsPanel
          designConfig={designConfig}
          onUpdate={onUpdateDesignConfig}
        />
      </div>
    );
  }

  // Block selected - show block-specific settings with tabs
  const renderBlockSettings = () => {
    // Handle v2 layouts block with generic settings
    if (selectedBlock.type === 'layouts') {
      return <LayoutBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} campaignId={campaignId} />;
    }
    
    // Handle other block types
    switch (selectedBlock.type) {
      case 'text':
        return <TextBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'button':
        return <ButtonBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'image':
        return <ImageBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'logo':
        return <LogoBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'spacer':
        return <SpacerBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'divider':
        return <DividerBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'social-links':
        return <SocialLinksBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'footer':
        return <FooterBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'link-bar':
        return <LinkBarBlockSettings block={selectedBlock} onUpdate={onUpdateBlock} />;
      case 'address':
        return <AddressBlockSettings block={selectedBlock} onUpdate={onUpdateBlock} />;
      default:
        return <div className="p-6 text-sm text-gray-500">No settings available for this block type.</div>;
    }
  };

  // Determine tabs based on block type
  let tabs;
  
  if (selectedBlock.type === 'spacer') {
    // Spacer blocks only have Block tab
    tabs = [
      {
        id: 'block',
        label: 'Block',
        content: renderBlockSettings(),
      },
    ];
  } else if (selectedBlock.type === 'logo') {
    // Logo blocks have Logo and Block tabs
    tabs = [
      {
        id: 'logo',
        label: 'Logo',
        content: <LogoContentSettings block={selectedBlock as any} onUpdate={onUpdateBlock} campaignId={campaignId} />,
      },
      {
        id: 'block',
        label: 'Block',
        content: renderBlockSettings(),
      },
    ];
  } else if (selectedBlock.type === 'image') {
    // Image blocks have Image and Block tabs
    tabs = [
      {
        id: 'image',
        label: 'Image',
        content: <ImageContentSettings block={selectedBlock as any} onUpdate={onUpdateBlock} campaignId={campaignId} />,
      },
      {
        id: 'block',
        label: 'Block',
        content: renderBlockSettings(),
      },
    ];
  } else if (selectedBlock.type === 'layouts') {
    // Layout blocks have Block and Layout tabs (with variation selector)
    tabs = [
      {
        id: 'block',
        label: 'Block',
        content: renderBlockSettings(),
      },
      {
        id: 'layout',
        label: 'Layout',
        content: <LayoutVariationSelector block={selectedBlock as any} onUpdate={onUpdateBlock} />,
      },
    ];
  } else {
    // Other blocks only have Block tab (removed legacy Layout/Link tabs)
    tabs = [
      {
        id: 'block',
        label: 'Block',
        content: renderBlockSettings(),
      },
    ];
  }

  return (
    <div className="flex flex-col h-full">
      <SettingsTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}


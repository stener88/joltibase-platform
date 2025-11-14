'use client';

import { useState, useEffect } from 'react';
import { EmailBlock, GlobalEmailSettings } from '@/lib/email/blocks/types';
import { SettingsTabs } from '../shared/SettingsTabs';
import { GlobalSettingsPanel } from './GlobalSettingsPanel';
import { HeadingBlockSettings } from './blocks/HeadingBlockSettings';
import { TextBlockSettings } from './blocks/TextBlockSettings';
import { ButtonBlockSettings } from './blocks/ButtonBlockSettings';
import { ImageBlockSettings } from './blocks/ImageBlockSettings';
import { LogoBlockSettings } from './blocks/LogoBlockSettings';
import { LogoContentSettings } from './blocks/LogoContentSettings';
import { ImageContentSettings } from './blocks/ImageContentSettings';
import { SpacerBlockSettings } from './blocks/SpacerBlockSettings';
import { DividerBlockSettings } from './blocks/DividerBlockSettings';
import { HeroBlockSettings } from './blocks/HeroBlockSettings';
import { StatsBlockSettings } from './blocks/StatsBlockSettings';
import { TestimonialBlockSettings } from './blocks/TestimonialBlockSettings';
import { FeatureGridBlockSettings } from './blocks/FeatureGridBlockSettings';
import { ComparisonBlockSettings } from './blocks/ComparisonBlockSettings';
import { SocialLinksBlockSettings } from './blocks/SocialLinksBlockSettings';
import { FooterBlockSettings } from './blocks/FooterBlockSettings';
import { SectionLibraryPanel } from './SectionLibraryPanel';

interface BlockSettingsPanelProps {
  selectedBlock: EmailBlock | null;
  designConfig: GlobalEmailSettings;
  onUpdateBlock: (blockId: string, updates: Partial<EmailBlock>) => void;
  onUpdateDesignConfig: (updates: Partial<GlobalEmailSettings>) => void;
  onInsertSection?: (sectionId: string) => void;
  campaignId?: string;
}

export function BlockSettingsPanel({
  selectedBlock,
  designConfig,
  onUpdateBlock,
  onUpdateDesignConfig,
  onInsertSection,
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
      <GlobalSettingsPanel
        designConfig={designConfig}
        onUpdate={onUpdateDesignConfig}
      />
    );
  }

  // Block selected - show block-specific settings with tabs
  const renderBlockSettings = () => {
    switch (selectedBlock.type) {
      case 'heading':
        return <HeadingBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
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
      case 'hero':
        return <HeroBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'stats':
        return <StatsBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'testimonial':
        return <TestimonialBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'feature-grid':
        return <FeatureGridBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'comparison':
        return <ComparisonBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'social-links':
        return <SocialLinksBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
      case 'footer':
        return <FooterBlockSettings block={selectedBlock as any} onUpdate={onUpdateBlock} />;
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
  } else {
    // Other blocks have Block, Layout, and Link tabs
    tabs = [
      {
        id: 'block',
        label: 'Block',
        content: renderBlockSettings(),
      },
      {
        id: 'layout',
        label: 'Layout',
        content: onInsertSection ? (
          <SectionLibraryPanel onInsertSection={onInsertSection} />
        ) : (
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500">Section library unavailable</p>
          </div>
        ),
      },
      {
        id: 'link',
        label: 'Link',
        content: (
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500">Link settings coming soon</p>
          </div>
        ),
      },
    ];
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 capitalize text-center">
          {selectedBlock.type} Block
        </h3>
      </div>
      <SettingsTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}


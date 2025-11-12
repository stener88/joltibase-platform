'use client';

import { useState } from 'react';
import { EmailBlock, GlobalEmailSettings } from '@/lib/email/blocks/types';
import { SettingsTabs } from '../shared/SettingsTabs';
import { GlobalSettingsPanel } from './GlobalSettingsPanel';
import { HeadingBlockSettings } from './blocks/HeadingBlockSettings';
import { TextBlockSettings } from './blocks/TextBlockSettings';
import { ButtonBlockSettings } from './blocks/ButtonBlockSettings';
import { ImageBlockSettings } from './blocks/ImageBlockSettings';
import { LogoBlockSettings } from './blocks/LogoBlockSettings';
import { SpacerBlockSettings } from './blocks/SpacerBlockSettings';
import { DividerBlockSettings } from './blocks/DividerBlockSettings';
import { HeroBlockSettings } from './blocks/HeroBlockSettings';
import { StatsBlockSettings } from './blocks/StatsBlockSettings';
import { TestimonialBlockSettings } from './blocks/TestimonialBlockSettings';
import { FeatureGridBlockSettings } from './blocks/FeatureGridBlockSettings';
import { ComparisonBlockSettings } from './blocks/ComparisonBlockSettings';
import { SocialLinksBlockSettings } from './blocks/SocialLinksBlockSettings';
import { FooterBlockSettings } from './blocks/FooterBlockSettings';

interface BlockSettingsPanelProps {
  selectedBlock: EmailBlock | null;
  designConfig: GlobalEmailSettings;
  onUpdateBlock: (blockId: string, updates: Partial<EmailBlock>) => void;
  onUpdateDesignConfig: (updates: Partial<GlobalEmailSettings>) => void;
}

export function BlockSettingsPanel({
  selectedBlock,
  designConfig,
  onUpdateBlock,
  onUpdateDesignConfig,
}: BlockSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState('block');

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

  const tabs = [
    {
      id: 'block',
      label: 'Block',
      content: renderBlockSettings(),
    },
    {
      id: 'layout',
      label: 'Layout',
      content: (
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-500">Layout settings coming soon</p>
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

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 capitalize">
          {selectedBlock.type} Block
        </h3>
      </div>
      <SettingsTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}


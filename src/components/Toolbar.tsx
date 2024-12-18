import React from 'react';
import { Icons, IconType } from './icons';

interface ToolbarProps {
  features: string[];
  onFeatureClick: (feature: string) => void;
  activeFeatures: Set<string>;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  features,
  onFeatureClick,
  activeFeatures
}) => {
  return (
    <div className="micropen-toolbar">
      {features.map(feature => {
        const Icon = Icons[feature as IconType] || (() => null);
        return (
          <button
            key={feature}
            className={`micropen-button ${activeFeatures.has(feature) ? 'active' : ''}`}
            onClick={() => onFeatureClick(feature)}
            title={feature.charAt(0).toUpperCase() + feature.slice(1)}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
};

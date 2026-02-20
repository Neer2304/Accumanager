// components/googleadminsettings/components/PricingSettings.tsx
import React from 'react';
import {
  Payment as PaymentIcon
} from '@mui/icons-material';
import { SettingsSection } from './SettingsSection';
import { SettingsFieldGroup } from './SettingsFieldGroup';
import { PriceInput } from '../form/PriceInput';
import { AppSettings } from './types';

interface PricingSettingsProps {
  settings: AppSettings;
  onUpdate: (pricing: Partial<AppSettings['pricing']>) => void;
}

export const PricingSettings: React.FC<PricingSettingsProps> = ({ settings, onUpdate }) => {
  return (
    <SettingsSection
      title="Pricing Settings"
      subtitle="Configure subscription pricing (INR)"
      icon={<PaymentIcon />}
      iconColor="warning.main"
    >
      <SettingsFieldGroup columns={3}>
        <PriceInput
          label="Monthly Price"
          value={settings.pricing.monthly}
          onChange={(value) => onUpdate({ monthly: value })}
        />
        <PriceInput
          label="Quarterly Price"
          value={settings.pricing.quarterly}
          onChange={(value) => onUpdate({ quarterly: value })}
        />
        <PriceInput
          label="Yearly Price"
          value={settings.pricing.yearly}
          onChange={(value) => onUpdate({ yearly: value })}
        />
      </SettingsFieldGroup>
    </SettingsSection>
  );
};
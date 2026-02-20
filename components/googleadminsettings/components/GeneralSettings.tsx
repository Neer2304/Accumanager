// components/googleadminsettings/components/GeneralSettings.tsx
import React from 'react';
import { Box } from '@mui/material';
import {
  Settings as SettingsIcon
} from '@mui/icons-material';
import { SettingsSection } from './SettingsSection';
import { SettingsFieldGroup } from './SettingsFieldGroup';
import { FormInput } from '../form/FormInput';
import { FormSwitch } from '../form/FormSwitch';
import { AppSettings } from './types';

interface GeneralSettingsProps {
  settings: AppSettings;
  onUpdate: (settings: Partial<AppSettings>) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings, onUpdate }) => {
  return (
    <SettingsSection
      title="General Settings"
      subtitle="Configure basic application settings"
      icon={<SettingsIcon />}
      iconColor="primary.main"
    >
      <SettingsFieldGroup columns={2}>
        <FormInput
          label="Site Name"
          name="siteName"
          value={settings.siteName}
          onChange={(e) => onUpdate({ siteName: e.target.value })}
        />
        <FormInput
          label="Site URL"
          name="siteUrl"
          value={settings.siteUrl}
          onChange={(e) => onUpdate({ siteUrl: e.target.value })}
        />
        <FormInput
          label="Support Email"
          name="supportEmail"
          type="email"
          value={settings.supportEmail}
          onChange={(e) => onUpdate({ supportEmail: e.target.value })}
        />
        <FormInput
          label="Trial Days"
          name="trialDays"
          type="number"
          value={settings.trialDays.toString()}
          onChange={(e) => onUpdate({ trialDays: parseInt(e.target.value) || 14 })}
        />
      </SettingsFieldGroup>
      
      <Box sx={{ mt: 2 }}>
        <FormSwitch
          label="Enable User Registration"
          checked={settings.enableRegistration}
          onChange={(checked) => onUpdate({ enableRegistration: checked })}
          helper="Allow new users to register on the platform"
        />
      </Box>
    </SettingsSection>
  );
};
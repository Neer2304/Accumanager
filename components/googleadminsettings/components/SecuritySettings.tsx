// components/googleadminsettings/components/SecuritySettings.tsx
import React from 'react';
import { Box } from '@mui/material';
import {
  Security as SecurityIcon
} from '@mui/icons-material';
import { SettingsSection } from './SettingsSection';
import { SettingsFieldGroup } from './SettingsFieldGroup';
import { FormInput } from '../form/FormInput';
import { FormSwitch } from '../form/FormSwitch';
import { AppSettings } from './types';

interface SecuritySettingsProps {
  settings: AppSettings;
  onUpdate: (security: Partial<AppSettings['security']>) => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ settings, onUpdate }) => {
  return (
    <SettingsSection
      title="Security Settings"
      subtitle="Configure application security settings"
      icon={<SecurityIcon />}
      iconColor="error.main"
    >
      <SettingsFieldGroup columns={2}>
        <Box>
          <FormSwitch
            label="Require Email Verification"
            checked={settings.security.requireEmailVerification}
            onChange={(checked) => onUpdate({ requireEmailVerification: checked })}
            helper="Users must verify email before accessing the platform"
          />
        </Box>
        
        <FormInput
          label="Max Login Attempts"
          name="maxLoginAttempts"
          type="number"
          value={settings.security.maxLoginAttempts.toString()}
          onChange={(e) => onUpdate({ maxLoginAttempts: parseInt(e.target.value) || 5 })}
          helperText="Maximum failed login attempts before account lock"
        />
        
        <FormInput
          label="Session Timeout (hours)"
          name="sessionTimeout"
          type="number"
          value={settings.security.sessionTimeout.toString()}
          onChange={(e) => onUpdate({ sessionTimeout: parseInt(e.target.value) || 24 })}
          helperText="User session timeout in hours"
        />
      </SettingsFieldGroup>
    </SettingsSection>
  );
};
import React from 'react';
import {
  CreditCard as CreditCardIcon,
  AccountBalanceWallet as WalletIcon,
  Savings as SavingsIcon,
  LocalAtm as CashIcon,
  PhoneAndroid as UpiIcon,
} from '@mui/icons-material';

export const PaymentMethodIcons = {
  cash: CashIcon,
  card: CreditCardIcon,
  upi: UpiIcon,
  'bank-transfer': WalletIcon,
  'digital-wallet': SavingsIcon,
};

export const getPaymentMethodIcon = (method: string): React.ComponentType => {
  return PaymentMethodIcons[method as keyof typeof PaymentMethodIcons] || CashIcon;
};
'use client'
import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import { LogoutDialog } from '@/components/dialogs/LogoutDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { DeleteDialog } from '@/components/dialogs/DeleteDialog';
import { SuccessDialog } from '@/components/dialogs/SuccessDialog';

// Change from named export to default export
export default function DialogTestPage() {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  return (
    <>
      <Stack direction="row" spacing={2} p={3}>
        <Button variant="outlined" onClick={() => setLogoutOpen(true)}>
          Show Logout
        </Button>
        <Button variant="outlined" onClick={() => setConfirmOpen(true)}>
          Show Confirm
        </Button>
        <Button variant="outlined" color="error" onClick={() => setDeleteOpen(true)}>
          Show Delete
        </Button>
        <Button variant="outlined" color="success" onClick={() => setSuccessOpen(true)}>
          Show Success
        </Button>
      </Stack>

      <LogoutDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          console.log('Logging out...');
          setLogoutOpen(false);
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          console.log('Confirmed!');
          setConfirmOpen(false);
        }}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
        severity="info"
      />

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          console.log('Deleting...');
          setDeleteOpen(false);
        }}
        itemName="Product X"
        itemType="product"
      />

      <SuccessDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Product Deleted"
        message="The product has been successfully removed from your inventory."
      />
    </>
  );
}
import axios from 'axios';

interface UPIWebhookData {
  transaction_id: string;
  upi_id: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  timestamp: string;
  merchant_transaction_id: string;
  customer_name?: string;
  customer_email?: string;
  plan_id: string;
}

interface UPIQRData {
  upi_id: string;
  merchant_name: string;
  amount: number;
  transaction_note: string;
  merchant_code?: string;
}

class UPIWebhookHandler {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  async verifyTransaction(transactionId: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.webhookUrl}/verify/${transactionId}`);
      return response.data.status === 'SUCCESS';
    } catch (error) {
      console.error('Transaction verification failed:', error);
      return false;
    }
  }

  async processWebhook(data: UPIWebhookData): Promise<{ success: boolean; message: string }> {
    try {
      // Verify the webhook signature (if provided by payment gateway)
      const isValid = await this.validateWebhookSignature(data);
      
      if (!isValid) {
        return { success: false, message: 'Invalid webhook signature' };
      }

      // Update payment status in database
      await this.updatePaymentStatus(data);

      // Send confirmation email
      if (data.status === 'SUCCESS' && data.customer_email) {
        await this.sendConfirmationEmail(data);
      }

      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      console.error('Webhook processing error:', error);
      return { success: false, message: 'Failed to process webhook' };
    }
  }

  private async validateWebhookSignature(data: UPIWebhookData): Promise<boolean> {
    // Implement your webhook signature validation logic here
    // This depends on your payment gateway provider
    return true; // For demo purposes
  }

  private async updatePaymentStatus(data: UPIWebhookData): Promise<void> {
    // Update payment status in your database
    // This should connect to your payments collection/table
    console.log(`Updating payment status for transaction ${data.transaction_id}: ${data.status}`);
  }

  private async sendConfirmationEmail(data: UPIWebhookData): Promise<void> {
    // Send confirmation email to customer
    console.log(`Sending confirmation email to ${data.customer_email}`);
  }
}

export { UPIWebhookHandler, type UPIWebhookData, type UPIQRData };
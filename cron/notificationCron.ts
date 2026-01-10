// cron/notificationCron.js
const cron = require('node-cron');

// Run every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('🕘 Running daily notification generation...');
  
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/notifications/generate`);
    const result = await response.json();
    console.log('✅ Daily notifications generated:', result);
  } catch (error) {
    console.error('❌ Error in cron job:', error);
  }
});

// Run every hour to check for urgent notifications
cron.schedule('0 * * * *', async () => {
  console.log('⏰ Running hourly notification check...');
  // Add hourly checks here
});
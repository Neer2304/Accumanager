// services/paymentService.ts - UPDATED
import { PRICING_PLANS, UPI_CONFIG } from '@/config/pricing';
import Payment from '@/models/Payment';
import User from '@/models/User';

export class PaymentService {
  // Create UPI payment request
  static async createUPIPayment(userId: string, plan: 'monthly' | 'quarterly' | 'yearly') {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const planConfig = PRICING_PLANS[plan];
    
    // Generate unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    // Create payment record
    const payment = new Payment({
      userId,
      plan,
      amount: planConfig.price,
      status: 'pending',
      paymentDetails: {
        upiId: UPI_CONFIG.upiId,
        merchantId: UPI_CONFIG.merchantCode,
        transactionNote: `Payment for ${planConfig.name} - AccumaManage`
      }
    });
    
    await payment.save();
    
    // Generate UPI payment URL
    const upiUrl = this.generateUPIUrl({
      pa: UPI_CONFIG.upiId,
      pn: UPI_CONFIG.merchantName,
      tid: transactionId,
      tr: payment._id.toString(),
      tn: `AccumaManage ${planConfig.name} Subscription`,
      am: planConfig.price.toString(),
      cu: 'INR'
    });
    
    return {
      paymentId: payment._id.toString(),
      upiUrl,
      transactionId,
      amount: planConfig.price,
      plan: planConfig.name,
      currency: 'INR'
    };
  }
  
  private static generateUPIUrl(params: any): string {
    const baseUrl = 'upi://pay';
    const queryParams = new URLSearchParams(params).toString();
    return `${baseUrl}?${queryParams}`;
  }
  
  // Verify payment and activate subscription
  static async verifyPayment(paymentId: string, upiTransactionId: string) {
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    if (payment.status !== 'pending') {
      throw new Error('Payment already processed');
    }
    
    // Update payment status
    payment.status = 'completed';
    payment.upiTransactionId = upiTransactionId;
    await payment.save();
    
    // Activate user subscription
    await this.activateSubscription(payment.userId.toString(), payment.plan);
    
    return { success: true, payment };
  }
  
  // Activate user subscription with plan features
  private static async activateSubscription(userId: string, plan: 'monthly' | 'quarterly' | 'yearly') {
    const planConfig = PRICING_PLANS[plan];
    const currentDate = new Date();
    const periodEnd = new Date(currentDate.getTime() + planConfig.duration * 24 * 60 * 60 * 1000);
    
    const updateData = {
      'subscription.plan': plan,
      'subscription.status': 'active',
      'subscription.currentPeriodStart': currentDate,
      'subscription.currentPeriodEnd': periodEnd,
      'subscription.lastPaymentDate': currentDate,
      'subscription.features': planConfig.features
    };
    
    await User.findByIdAndUpdate(userId, updateData);
  }
  
  // Check subscription status and features
  static async checkSubscription(userId: string) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const now = new Date();
    const isTrialActive = user.subscription.status === 'trial' && now < user.subscription.trialEndsAt;
    const isSubscriptionActive = user.subscription.status === 'active' && now < user.subscription.currentPeriodEnd;
    const isActive = isTrialActive || isSubscriptionActive;
    
    // Auto-expire trial if ended
    if (user.subscription.status === 'trial' && now >= user.subscription.trialEndsAt) {
      user.subscription.status = 'expired';
      await user.save();
    }
    
    const currentPlan = user.subscription.plan;
    const planConfig = PRICING_PLANS[currentPlan];
    
    return {
      isActive,
      plan: currentPlan,
      status: user.subscription.status,
      trialEndsAt: user.subscription.trialEndsAt,
      currentPeriodEnd: user.subscription.currentPeriodEnd,
      daysRemaining: Math.ceil((user.subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      features: user.subscription.features,
      limits: planConfig.limits,
      usage: user.usage
    };
  }
  
  // Check if user can perform action based on their plan limits
  static async checkUsageLimit(userId: string, resource: 'products' | 'customers' | 'invoices' | 'storageMB', increment: number = 1) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const subscription = await this.checkSubscription(userId);
    
    if (!subscription.isActive) {
      throw new Error('Subscription is not active');
    }
    
    const planLimits = PRICING_PLANS[user.subscription.plan].limits;
    const currentUsage = user.usage[resource];
    const limit = planLimits[resource];
    const newUsage = currentUsage + increment;
    
    return {
      canProceed: newUsage <= limit,
      currentUsage,
      newUsage,
      limit,
      remaining: limit - currentUsage
    };
  }
  
  // Update usage when user creates resources
  static async updateUsage(userId: string, resource: 'products' | 'customers' | 'invoices' | 'storageMB', increment: number = 1) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check limit before updating
    const limitCheck = await this.checkUsageLimit(userId, resource, increment);
    
    if (!limitCheck.canProceed) {
      throw new Error(`${resource.charAt(0).toUpperCase() + resource.slice(1)} limit reached! Current: ${limitCheck.currentUsage}, Limit: ${limitCheck.limit}. Upgrade your plan to continue.`);
    }
    
    // Update usage
    user.usage[resource] += increment;
    await user.save();
    
    return user.usage;
  }
  
  // Start free trial for new users
  static async startFreeTrial(userId: string) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Set trial subscription
    const trialConfig = PRICING_PLANS.trial;
    const trialEnds = new Date(Date.now() + trialConfig.duration * 24 * 60 * 60 * 1000);
    
    user.subscription = {
      plan: 'trial',
      status: 'trial',
      trialEndsAt: trialEnds,
      currentPeriodStart: new Date(),
      currentPeriodEnd: trialEnds,
      autoRenew: false,
      features: trialConfig.features
    };
    
    await user.save();
    
    return {
      success: true,
      trialEndsAt: trialEnds,
      features: trialConfig.features,
      limits: trialConfig.limits
    };
  }
}
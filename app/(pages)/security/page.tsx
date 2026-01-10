// app/security/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  Server,
  Database,
  Globe,
  CheckCircle,
  FileText,
  Users,
  RefreshCw,
  Cpu,
  Cloud,
  ArrowRight,
  Zap,
  Building,
  CreditCard,
  Eye,
  Key,
  Fingerprint,
  ShieldCheck,
  AlertCircle,
  Bell,
} from "lucide-react";
import { Mail } from "@mui/icons-material";

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                AccumaManage Security
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                Pricing
              </Link>
              <Link
                href="/security"
                className="text-blue-600 font-semibold text-sm"
              >
                Security
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 mb-6">
              <ShieldCheck className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Enterprise-Grade Security</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Data is <span className="text-blue-600">Protected</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              We implement robust security measures to protect your business data.
              Transparency and security are at the core of everything we do.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* API Security Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Cpu className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                API Security
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <Key className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="font-bold text-lg text-gray-900">API Authentication</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>JWT-based authentication</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>API key management with rate limiting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>OAuth 2.0 support</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="font-bold text-lg text-gray-900">Request Security</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>HTTPS-only API endpoints</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>CORS policy implementation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Input validation and sanitization</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <RefreshCw className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="font-bold text-lg text-gray-900">Monitoring</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Real-time API usage monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Anomaly detection for suspicious activity</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Detailed access logs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Security Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Database className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Data Security
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-4">Encryption</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <Lock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Data at Rest</h4>
                          <p className="text-gray-600 text-sm">
                            AES-256 encryption for all stored data
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <Globe className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Data in Transit</h4>
                          <p className="text-gray-600 text-sm">
                            TLS 1.3 encryption for all communications
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-4">Storage & Backup</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <Cloud className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Secure Infrastructure</h4>
                          <p className="text-gray-600 text-sm">
                            Data hosted on secure cloud infrastructure with regular security audits
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <RefreshCw className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Regular Backups</h4>
                          <p className="text-gray-600 text-sm">
                            Automated daily backups with 30-day retention
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Access & Authentication */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                User Access & Authentication
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <Fingerprint className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="font-bold text-lg text-gray-900">Authentication</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Secure password hashing with bcrypt</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Optional two-factor authentication</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Session management with auto-expiry</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="font-bold text-lg text-gray-900">Access Control</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Role-based access control (RBAC)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Granular permission system</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Activity logging for all user actions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Infrastructure Security */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Server className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Infrastructure Security
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-4">Network Security</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Firewall protection</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>DDoS protection and mitigation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Regular vulnerability scans</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-4">Application Security</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Regular security updates and patches</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Secure coding practices</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Dependency vulnerability monitoring</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Security */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Payment Security
              </h2>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Secure Processing</h3>
                  <p className="text-gray-600 text-sm">
                    We never store your payment card details. All payments are processed through PCI DSS compliant payment gateways.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Encrypted Transactions</h3>
                  <p className="text-gray-600 text-sm">
                    All payment transactions are encrypted end-to-end. We support secure UPI payments and other digital payment methods.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Verification</h3>
                  <p className="text-gray-600 text-sm">
                    Every payment is verified before account activation. You receive immediate confirmation of successful payments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Response */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <AlertCircle className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Incident Response & Transparency
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Security Incident Response</h3>
                    <p className="text-gray-600">
                      We maintain a documented incident response plan. In the event of a security incident, affected users will be notified promptly with details and remediation steps.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Transparency</h3>
                    <p className="text-gray-600">
                      We believe in transparency. Any significant security changes or incidents will be communicated to our users through our status page and email notifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Reporting */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="max-w-3xl mx-auto text-center text-white">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Security Questions or Concerns?
                  </h2>
                  <p className="text-lg opacity-90 mb-8">
                    We take security seriously. If you have any security concerns or questions about our practices, please don't hesitate to reach out.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Mail className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base mb-1">Email Security Team</h3>
                      <p className="text-xs opacity-80">security@accumamanage.com</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Building className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base mb-1">Security Vulnerability Reporting</h3>
                      <p className="text-xs opacity-80">report@accumamanage.com</p>
                    </div>
                  </div>

                  <div className="text-sm opacity-80">
                    <p>We appreciate responsible disclosure of security vulnerabilities.</p>
                    <p className="mt-1">Response time: Within 24-48 hours for security-related inquiries.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Security FAQs
            </h2>
            
            <div className="max-w-4xl mx-auto grid gap-4">
              {[
                {
                  question: "Where is my data stored?",
                  answer: "Your data is stored on secure cloud servers with multiple layers of protection. We use industry-leading infrastructure providers who maintain high security standards.",
                },
                {
                  question: "Who has access to my data?",
                  answer: "Only you and authorized users from your account can access your business data. Our support team may access data only with your explicit permission for troubleshooting purposes.",
                },
                {
                  question: "How often are security audits performed?",
                  answer: "We conduct regular security assessments, including automated vulnerability scans and manual penetration testing by security professionals.",
                },
                {
                  question: "What happens if there's a data breach?",
                  answer: "In the unlikely event of a breach, we have an incident response plan that includes immediate notification to affected users, investigation, and remediation steps.",
                },
                {
                  question: "Can I export my data?",
                  answer: "Yes, you can export your data at any time through the dashboard. We provide data in standard formats for easy migration.",
                },
                {
                  question: "How are backups handled?",
                  answer: "Automated daily backups are performed with 30-day retention. Backups are encrypted and stored in geographically separate locations for disaster recovery.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Shield className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 text-sm pl-6">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6" />
                <span className="text-lg font-bold">AccumaManage</span>
              </div>
              <p className="text-gray-400 text-sm">
                Secure business management platform built with privacy in mind.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-base">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link></li>
                <li><Link href="/security" className="text-gray-400 hover:text-white transition-colors text-sm">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-base">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-base">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400 text-sm">support@accumamanage.com</li>
                <li className="text-gray-400 text-sm">security@accumamanage.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} AccumaManage. All rights reserved.</p>
            <p className="mt-1">Built with security and privacy as our top priorities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SecurityPage;
// Base API service for companies
export const companyService = {
  // ============ COMPANY CRUD ============
  
  // Get all companies for current user
  async getCompanies() {
    const res = await fetch('/api/companies');
    return res.json();
  },

  // Get single company by ID
  async getCompany(id: string) {
    const res = await fetch(`/api/companies/detail?id=${id}`);
    return res.json();
  },

  // Create new company
  async createCompany(data: any) {
    const res = await fetch('/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Update company
  async updateCompany(id: string, data: any) {
    const res = await fetch(`/api/companies/detail?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Delete company (soft delete)
  async deleteCompany(id: string) {
    const res = await fetch(`/api/companies/detail?id=${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Switch active company
  async switchCompany(id: string) {
    const res = await fetch(`/api/companies/switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId: id })
    });
    return res.json();
  },

  // ============ COMPANY LIMITS ============
  
  // Check company creation limits
  async checkLimits() {
    const res = await fetch('/api/companies/limits');
    return res.json();
  },

  // ============ MEMBER MANAGEMENT ============
  
  // Get all members of a company
  async getMembers(companyId: string) {
    const res = await fetch(`/api/companies/members?companyId=${companyId}`);
    return res.json();
  },

  // Add member to company
  async addMember(companyId: string, data: { email: string; name?: string; role: string }) {
    const res = await fetch(`/api/companies/members?companyId=${companyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Update member role
  async updateMemberRole(companyId: string, memberId: string, role: string) {
    const res = await fetch(`/api/companies/members?companyId=${companyId}&memberId=${memberId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return res.json();
  },

  // Remove member from company
  async removeMember(companyId: string, memberId: string) {
    const res = await fetch(`/api/companies/members?companyId=${companyId}&memberId=${memberId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // ============ COMPANY STATS ============
  
  // Get company dashboard stats
  async getCompanyStats(companyId: string) {
    const res = await fetch(`/api/companies/stats?companyId=${companyId}`);
    return res.json();
  }
};
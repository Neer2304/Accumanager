// components/googleapidocs/components/types.ts
export interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  category: 'customers' | 'products' | 'invoices' | 'analytics';
  requiresAuth: boolean;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  exampleRequest?: string;
  exampleResponse?: string;
}

export interface Category {
  value: string;
  label: string;
}

export interface ApiStats {
  totalEndpoints: number;
  authRequired: number;
  categories: number;
  methods: number;
}
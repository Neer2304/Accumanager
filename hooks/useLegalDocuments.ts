// hooks/useLegalDocuments.ts
import { useState, useCallback } from 'react';
import { LegalDocument, DocumentTypeConfig } from '@/types/legal';

interface UseLegalDocumentsProps {
  documentTypes: DocumentTypeConfig[];
}

export const useLegalDocuments = ({ documentTypes }: UseLegalDocumentsProps) => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDocument = useCallback(async (docType: DocumentTypeConfig) => {
    try {
      const response = await fetch(`/api/admin/legal/${docType.apiEndpoint}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch ${docType.label}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`Error fetching ${docType.label}:`, error);
      return null;
    }
  }, []);

  const fetchAllDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const promises = documentTypes.map(docType => fetchDocument(docType));
      const results = await Promise.all(promises);

      const docs: LegalDocument[] = results
        .filter(doc => doc !== null)
        .map(doc => ({
          ...doc,
          type: doc.type
        }));

      setDocuments(docs);
    } catch (err: any) {
      setError(err.message || "Failed to load documents");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  }, [documentTypes, fetchDocument]);

  const getDocumentByType = useCallback((type: string) => {
    return documents.find((doc) => doc.type === type);
  }, [documents]);

  const createInitialDocument = useCallback((docType: DocumentTypeConfig): LegalDocument => {
    return {
      _id: "",
      type: docType.type,
      title: docType.label,
      content: `# ${docType.label}\n\nStart typing your content here...`,
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: { _id: "", name: "", email: "" },
      isActive: true
    };
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  return {
    documents,
    loading,
    error,
    fetchAllDocuments,
    getDocumentByType,
    createInitialDocument,
    formatDate,
    setDocuments,
    setLoading,
    setError
  };
};
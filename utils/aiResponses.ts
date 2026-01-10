// utils/aiResponses.ts
export const aiResponses = {
  dashboard: {
    triggers: ['dashboard', 'data', 'chart', 'graph', 'statistics'],
    response: "Dashboard data issues are often related to: 1) API endpoint configuration 2) Data formatting 3) Authentication tokens 4) CORS settings. Check your network tab in developer tools to see if API calls are successful."
  },
  authentication: {
    triggers: ['login', 'auth', 'signin', 'signup', 'logout', 'token'],
    response: "Authentication problems can be due to: 1) Invalid tokens 2) Session storage issues 3) Backend validation failures 4) CORS configuration. Verify your auth flow and check localStorage/sessionStorage."
  },
  api: {
    triggers: ['api', 'endpoint', 'fetch', 'axios', 'connection'],
    response: "API connection issues: 1) Check if the server is running 2) Verify endpoint URLs 3) Check for CORS errors 4) Validate request/response formats. Use browser network tab to debug."
  },
  database: {
    triggers: ['database', 'db', 'data', 'sync', 'mongodb', 'mysql'],
    response: "Database sync issues: 1) Check database connection 2) Verify query syntax 3) Ensure proper indexing 4) Check for data consistency between frontend and backend."
  },
  error: {
    triggers: ['error', 'bug', 'issue', 'problem', 'crash', 'fail'],
    response: "For general errors: 1) Check browser console (F12) 2) Look for error messages 3) Verify all dependencies 4) Check network requests. Can you share the specific error message?"
  }
};
export default function TestPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Test Page</h1>
      <p>If you can see this, the admin route is accessible.</p>
      <div style={{ marginTop: '20px' }}>
        <h3>API Endpoints:</h3>
        <ul>
          <li><a href="/api/admin/setup/check">/api/admin/setup/check</a></li>
          <li><a href="/api/admin/auth/me">/api/admin/auth/me</a></li>
          <li><a href="/api/admin/users">/api/admin/users</a></li>
        </ul>
      </div>
    </div>
  );
}
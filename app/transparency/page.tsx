export default function Transparency() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Teos AI Engine Transparency Portal</h1>
      <p>Access compliance and operational endpoints:</p>
      <ul style={{ lineHeight: '1.8' }}>
        <li>
          <a href="/api/health" target="_blank" rel="noopener noreferrer">
            /api/health – Service health check (includes request ID)
          </a>
        </li>
        <li>
          <a href="/api/audit" target="_blank" rel="noopener noreferrer">
            /api/audit – Audit log (to be implemented)
          </a>
        </li>
        <li>
          <a href="/api/rules.json" target="_blank" rel="noopener noreferrer">
            /api/rules.json – Compliance rules (to be implemented)
          </a>
        </li>
        <li>
          <a href="/api/test-cases.json" target="_blank" rel="noopener noreferrer">
            /api/test-cases.json – Test cases (to be implemented)
          </a>
        </li>
        <li>
          <a href="/api/audit-example.json" target="_blank" rel="noopener noreferrer">
            /api/audit-example.json – Example audit entry (to be implemented)
          </a>
        </li>
      </ul>
      <p>
        <small>
          This portal provides transparency into system operation and compliance.
          For source code, visit{' '}
          <a href="https://github.com/Elmahrosa/Teos-AI-Engine" target="_blank" rel="noopener noreferrer">
            github.com/Elmahrosa/Teos-AI-Engine
          </a>
          .
        </small>
      </p>
    </main>
  );
}

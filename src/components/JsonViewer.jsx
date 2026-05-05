import { useFormBuilder } from '../context/FormBuilderContext';
import { Code2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function JsonViewer() {
  const { schema } = useFormBuilder();
  const [copied, setCopied] = useState(false);

  const jsonStr = JSON.stringify(schema, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="main-content">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Code2 size={18} color="var(--accent)" />
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Schema JSON Output</span>
          </div>
          <button className="btn btn--secondary btn--sm" onClick={handleCopy}>
            {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy JSON</>}
          </button>
        </div>
        <div className="json-panel" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <pre>{jsonStr}</pre>
        </div>
      </div>
    </div>
  );
}

import { useParams } from 'react-router-dom';

export function FinalizePage() {
  const { testId } = useParams<{ testId: string }>();

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.5em' }}>
      Finalize Page for Test ID: <b>{testId || 'Not specified'}</b>
    </div>
  );
}
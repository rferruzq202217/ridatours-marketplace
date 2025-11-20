'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestExperiences() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      console.log('🔍 Loading experiences...');
      const { data: exp, error: err } = await supabase
        .from('experiences')
        .select('*');
      
      console.log('Result:', exp);
      console.log('Error:', err);
      
      setData(exp || []);
      setError(err);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Cargando...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Experiences</h1>
      
      {error && (
        <div style={{ color: 'red' }}>
          Error: {JSON.stringify(error)}
        </div>
      )}
      
      <p><strong>Total: {data.length} experiences</strong></p>
      
      {data.map(exp => (
        <div key={exp.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{exp.title}</h3>
          <p>ID: {exp.id}</p>
          <p>Slug: {exp.slug}</p>
          <p>City ID: {exp.city_id || 'NULL'}</p>
        </div>
      ))}
    </div>
  );
}

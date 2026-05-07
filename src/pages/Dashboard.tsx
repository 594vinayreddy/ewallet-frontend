// src/pages/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import type { ServiceHealth } from '../types/index';

const SERVICES: ServiceHealth[] = [
  { name: 'API Gateway',         port: 8080, status: 'UNKNOWN' },
  { name: 'Auth Service',        port: 8081, status: 'UNKNOWN' },
  { name: 'User Service',        port: 8082, status: 'UNKNOWN' },
  { name: 'Transaction Service', port: 8083, status: 'UNKNOWN' },
  { name: 'Wallet Service',      port: 8084, status: 'UNKNOWN' },
  { name: 'Eureka Discovery',    port: 8761, status: 'UNKNOWN' },
];

// Maps actuator health response to our ServiceHealth status type
function resolveStatus(status?: string): ServiceHealth['status'] {
  if (status === 'UP') return 'UP';
  if (status === 'DOWN') return 'DOWN';
  return 'UNKNOWN';
}

export default function Dashboard() {
  const { data: health, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await axiosClient.get('/actuator/health');
      return res.data; // { status: 'UP', components: { ... } }
    },
    refetchInterval: 10000,
  });

  // Merge live health data into our static service list
  const services: ServiceHealth[] = SERVICES.map((svc) => ({
    ...svc,
    status: resolveStatus(health?.status),
  }));

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Service Health Dashboard</h1>
      {isLoading && <p>Checking services...</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {services.map((svc) => (
          <div
            key={svc.name}
            style={{
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
              borderLeft: `4px solid ${
                svc.status === 'UP' ? 'green' :
                svc.status === 'DOWN' ? 'red' : 'orange'
              }`,
            }}
          >
            <h3 style={{ margin: 0 }}>{svc.name}</h3>
            <p style={{ color: '#666' }}>Port: {svc.port}</p>
            <span
              style={{
                fontWeight: 'bold',
                color:
                  svc.status === 'UP' ? 'green' :
                  svc.status === 'DOWN' ? 'red' : 'orange',
              }}
            >
              ● {svc.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
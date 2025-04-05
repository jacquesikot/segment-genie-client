import client from './client';

export interface Status {
  data: {
    status: 'ok' | 'error';
  };
}

export const getStatus = async () => {
  const response = await client.get<Status>('/status');
  return response.data;
};

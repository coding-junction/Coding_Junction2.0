import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: 'ozbeszd1', // find this in sanity.json or your project dashboard
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
});
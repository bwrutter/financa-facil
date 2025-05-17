import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = JSON.parse(process.env.GCP_SA_KEY);

initializeApp({
  credential: cert(serviceAccount),
});

export { getAuth };

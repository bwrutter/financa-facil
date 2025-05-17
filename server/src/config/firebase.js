import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccountJson = Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
  'base64'
).toString('utf-8');

const serviceAccount = JSON.parse(serviceAccountJson);

initializeApp({
  credential: cert(serviceAccount),
});

export { getAuth };

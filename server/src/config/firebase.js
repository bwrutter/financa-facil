import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import firebaseAdminConfig from './firebase-adminsdk.json' with { type: 'json' };

initializeApp({
  credential: cert(firebaseAdminConfig),
});

export { getAuth };

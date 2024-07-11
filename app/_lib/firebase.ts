import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import {
  StorageReference,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const FEEDBACK_COLLECTION = collection(db, "wasteTypeFeedback");
export const storage = getStorage(
  app,
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_URL
);

export const getUploadImageRef = (fileName: string) => {
  return ref(
    storage,
    `${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_IMAGE_UPLOAD_FOLDER}/${fileName}`
  );
};

export const uploadDataUrlFile = async (
  ref: StorageReference,
  dataUrl: string
) => {
  /**
   * Uploads a data URL to a Firebase Storage reference.
   * @param ref - The Firebase Storage reference to upload the data URL to.
   * @param dataUrl - The data URL to upload e.g. data:image/jpeg;base64,...
   * @returns A Promise that resolves to the cloud storage URL of the uploaded file.
   */
  await uploadString(ref, dataUrl, "data_url");
  return getDownloadURL(ref);
};

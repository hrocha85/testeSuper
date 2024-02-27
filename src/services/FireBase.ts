import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATxgc8nV8ACRsvDMoOhzW6fLLWa-uvSh0",
  authDomain: "testesuper-3c01e.firebaseapp.com",
  projectId: "testesuper-3c01e",
  storageBucket: "testesuper-3c01e.appspot.com",
  messagingSenderId: "921850191278",
  appId: "1:921850191278:web:a52b7693d56e6d7a777c3f",
};

// Initialize Firebase
export const appI = () => initializeApp(firebaseConfig);

// Initialize a Fire store
export const db = () => getFirestore();

// Adicionando dados
export const dbAdd = async (idUser: any, mensagem: string, data: Date) => {
  const firestore = db();

  try {
    const docRef = await addDoc(collection(firestore, "Conversas"), {
      mensagem: mensagem,
      idUser: idUser,
      dataMensagem: data,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};



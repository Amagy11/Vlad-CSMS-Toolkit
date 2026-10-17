// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAlMduGeljWyCDj9mje3-ynHiNavAlPC8I",
  authDomain: "vlad-csms-af6df.firebaseapp.com",
  databaseURL: "https://vlad-csms-af6df-default-rtdb.firebaseio.com",
  projectId: "vlad-csms-af6df",
  storageBucket: "vlad-csms-af6df.firebasestorage.app",
  messagingSenderId: "417297799117",
  appId: "1:417297799117:web:0a93dce429cd37db499684"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

// Главная функция: проверяет логин и отдаёт user в callback
export function requireAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // не вошёл — отправляем на страницу логина
      window.location.href = '/login.html';
      return;
    }
    // вошёл — вызываем код страницы, передавая user
    callback(user);
  });
}

// Выход
export function logout() {
  signOut(auth).then(() => {
    window.location.href = '/login.html';
  });
}

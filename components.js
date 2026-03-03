// // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgjwzfctB0Z9Lyak4WXTo_wxb2vS5L-rs",
  authDomain: "healthlogic-fe5bd.firebaseapp.com",
  projectId: "healthlogic-fe5bd",
  storageBucket: "healthlogic-fe5bd.firebasestorage.app",
  messagingSenderId: "177114233773",
  appId: "1:177114233773:web:0e341fb52efcf7dc2cff24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Инициализация Firebase (Бэкэнд-мозги сайта)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

// 1. АВТОМАТИЧЕСКАЯ ШАПКА (HEADER)
function renderHeader() {
    const headerHTML = `
    <header style="padding: 20px 5%; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #121212; background: #F5F5DC; position: sticky; top: 0; z-index: 1000; font-family: 'Inter', sans-serif;">
        <a href="index.html" style="font-weight: 900; font-size: 22px; text-decoration: none; color: #121212; letter-spacing: -1px;">HEALTHLOGIC.</a>
        <nav style="display: flex; gap: 20px; align-items: center;">
            <a href="index.html#about-target" style="text-decoration: none; color: #121212; font-weight: 700; font-size: 11px; text-transform: uppercase;">О нас</a>
            <a href="calc.html" style="text-decoration: none; color: #121212; font-weight: 700; font-size: 11px; text-transform: uppercase;">Калькулятор</a>
            <a href="auth.html" id="nav-auth-btn" style="text-decoration: none; color: white; font-weight: 700; font-size: 11px; text-transform: uppercase; background: #121212; padding: 8px 16px; border-radius: 2px; transition: 0.3s;">Вход</a>
        </nav>
    </header>`;
    
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Следим за входом юзера, чтобы менять кнопку "Вход" на "Профиль"
    auth.onAuthStateChanged(user => {
        const authBtn = document.getElementById('nav-auth-btn');
        if (user) {
            authBtn.innerText = 'ПРОФИЛЬ';
            authBtn.style.background = '#BC8F8F'; 
        } else {
            authBtn.innerText = 'ВХОД';
            authBtn.style.background = '#121212';
        }
    });
}

// 2. БЭКЭНД БЛОК: ЛАЙКИ И КОММЕНТАРИИ
function renderInteractions() {
    // Определяем уникальный ID страницы по названию файла (например, training, fiber)
    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    
    const interactHTML = `
    <section id="interactions-system" style="padding: 60px 10%; background: #fff; border-top: 2px solid #121212; font-family: 'Inter', sans-serif;">
        <div style="margin-bottom: 40px;">
            <button id="like-btn" style="background: white; border: 2px solid #121212; padding: 12px 25px; cursor: pointer; font-weight: 900; transition: 0.2s;">
                ❤ ЛАЙКНУТЬ <span id="like-count" style="margin-left: 10px; color: #BC8F8F;">0</span>
            </button>
        </div>
        
        <h3 style="text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">Обсуждение_</h3>
        
        <div id="comment-form" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 40px;">
            <textarea id="comm-text" placeholder="Оставьте ваше мнение..." style="width: 100%; height: 100px; padding: 15px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit; resize: none;"></textarea>
            <button onclick="sendCommentToDB('${pageID}')" style="align-self: flex-start; padding: 12px 30px; background: #121212; color: white; border: none; font-weight: 700; cursor: pointer; text-transform: uppercase; font-size: 12px;">Отправить</button>
        </div>

        <div id="comments-display" style="display: flex; flex-direction: column; gap: 20px;">
            <p style="opacity: 0.5;">Загрузка комментариев...</p>
        </div>
    </section>`;

    // Вставляем блок перед футером
    const footer = document.querySelector('footer');
    if (footer) {
        footer.insertAdjacentHTML('beforebegin', interactHTML);
    }

    // РАБОТА С ЛАЙКАМИ (Firestore)
    const likeDoc = db.collection("likes").doc(pageID);
    likeDoc.onSnapshot(doc => {
        if (doc.exists) document.getElementById('like-count').innerText = doc.data().count || 0;
    });

    document.getElementById('like-btn').onclick = () => {
        if (!auth.currentUser) return alert("Только для авторизованных пользователей!");
        likeDoc.set({ count: firebase.firestore.FieldValue.increment(1) }, { merge: true });
    };

    // РАБОТА С КОММЕНТАРИЯМИ (Firestore)
    db.collection("comments")
      .where("page", "==", pageID)
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
          const display = document.getElementById('comments-display');
          display.innerHTML = "";
          snapshot.forEach(doc => {
              const comm = doc.data();
              display.innerHTML += `
              <div style="padding: 20px; background: #f9f9f9; border-left: 3px solid #121212;">
                  <div style="font-weight: 800; font-size: 11px; text-transform: uppercase; color: #BC8F8F; margin-bottom: 5px;">${comm.userEmail}</div>
                  <div style="font-size: 15px; line-height: 1.5;">${comm.text}</div>
              </div>`;
          });
          if (snapshot.empty) display.innerHTML = "<p style='opacity: 0.5;'>Здесь пока пусто. Станьте первым!</p>";
      });
}

// ГЛОБАЛЬНАЯ ФУНКЦИЯ ОТПРАВКИ КОММЕНТА
window.sendCommentToDB = (id) => {
    const text = document.getElementById('comm-text').value;
    if (!auth.currentUser) return alert("Войдите в аккаунт, чтобы писать!");
    if (text.length < 2) return alert("Слишком короткое сообщение");

    db.collection("comments").add({
        page: id,
        userEmail: auth.currentUser.email,
        text: text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById('comm-text').value = "";
    });
};

// ЗАПУСК СИСТЕМЫ
document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    
    // Проверяем, что это страница статьи (не главная и не вход)
    const path = window.location.pathname;
    const isArticle = path.includes("training") || path.includes("magnesium") || path.includes("fiber");
    
    if (isArticle) {
        renderInteractions();
    }
});

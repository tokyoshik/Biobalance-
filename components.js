// 1. ПРОВЕРКА В КОНСОЛИ
console.log("HealthLogic: Запуск системы...");

// 2. ТВОЙ КОНФИГ (Проверь только ссылку databaseURL)
// Import the functions you need from the SDKs you need
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

// 3. ИНИЦИАЛИЗАЦИЯ (ИСПРАВЛЕНО!)
// Ошибка была здесь. В твоей версии нужно писать firebase.initializeApp
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 4. ФУНКЦИЯ ОТРИСОВКИ
function renderLikes() {
    var db = firebase.database();
    var pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    
    // Создаем кнопку
    var likeContainer = document.createElement('div');
    likeContainer.style.cssText = "padding: 50px 0; text-align: center; background: #fff; border-top: 2px solid #000; margin-top: 30px;";
    likeContainer.innerHTML = `
        <button id="main-like-btn" style="background: #000; color: #fff; border: none; padding: 15px 40px; font-weight: 900; cursor: pointer; font-size: 18px; text-transform: uppercase;">
            ❤ ЛАЙКНУТЬ: <span id="main-like-count">0</span>
        </button>
    `;

    // Вставляем в самый конец страницы
    document.body.appendChild(likeContainer);

    // Связь с базой
    var likeRef = db.ref('likes/' + pageID);
    
    likeRef.on('value', function(snapshot) {
        var count = snapshot.val() || 0;
        document.getElementById('main-like-count').innerText = count;
    });

    document.getElementById('main-like-btn').onclick = function() {
        likeRef.transaction(function(current) {
            return (current || 0) + 1;
        });
    };

    console.log("HealthLogic: Кнопка создана успешно!");
}

// Запуск после загрузки страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderLikes);
} else {
    renderLikes();
}

// 1. Проверка в консоли
console.log("HealthLogic: Файл загружен, начинаю запуск...");

// 2. ТВОЙ КОНФИГ (Вставь свои данные сюда)

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
// Ошибка была здесь. Мы добавляем firebase. перед initializeApp
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

// 4. ФУНКЦИЯ ОТРИСОВКИ
function renderApp() {
    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    
    // Создаем блок кнопки
    const likeBox = document.createElement('div');
    likeBox.style.cssText = "padding: 60px 0; text-align: center; background: #fff; border-top: 2px solid #000; margin-top: 50px;";
    likeBox.innerHTML = `
        <button id="like-button" style="background: #000; color: #fff; border: none; padding: 20px 40px; font-weight: 900; cursor: pointer; font-size: 20px; text-transform: uppercase;">
            ❤ ЛАЙКНУТЬ: <span id="like-count">0</span>
        </button>
    `;

    // Вставляем в самый конец страницы (перед </body>)
    document.body.appendChild(likeBox);

    // Работа с базой
    const likeRef = db.ref('likes/' + pageID);
    
    likeRef.on('value', (snap) => {
        const count = snap.val() || 0;
        document.getElementById('like-count').innerText = count;
    });

    document.getElementById('like-button').onclick = function() {
        likeRef.transaction(c => (c || 0) + 1);
    };

    console.log("HealthLogic: Кнопка создана!");
}

// Запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp);
} else {
    renderApp();
}

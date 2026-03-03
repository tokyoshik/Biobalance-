// Используем анонимную функцию, чтобы не засорять глобальную видимость
(function() {
    window.addEventListener('load', function() {
        // 1. ПРОВЕРКА: Загружен ли Firebase вообще?
        if (typeof firebase === 'undefined') {
            console.error("HealthLogic: Ошибка! Firebase SDK не найден. Проверьте подключение скриптов в HTML.");
            return;
        }

        // 2. КОНФИГУРАЦИЯ (Замени заглушки на свои данные!)
       var firebaseConfig = {
  apiKey: "AIzaSyBgjwzfctB0Z9Lyak4WXTo_wxb2vS5L-rs",
  authDomain: "healthlogic-fe5bd.firebaseapp.com",
  projectId: "healthlogic-fe5bd",
  storageBucket: "healthlogic-fe5bd.firebasestorage.app",
  messagingSenderId: "177114233773",
  appId: "1:177114233773:web:0e341fb52efcf7dc2cff24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

        // 3. ИНИЦИАЛИЗАЦИЯ
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        var db = firebase.database();

        // 4. ОПРЕДЕЛЕНИЕ СТРАНИЦЫ
        var path = window.location.pathname;
        var pageID = path.split("/").pop().replace(".html", "") || "index";
        
        // 5. СОЗДАНИЕ ИНТЕРФЕЙСА (UI)
        var likeSection = document.createElement('div');
        likeSection.id = "firebase-like-section";
        likeSection.style.cssText = "padding: 40px 0; text-align: center; background: #f9f9f9; border-top: 1px solid #ddd; margin-top: 50px; font-family: sans-serif;";
        
        likeSection.innerHTML = `
            <button id="main-like-btn" style="background: #e63946; color: #fff; border: none; padding: 12px 30px; font-weight: bold; cursor: pointer; font-size: 16px; border-radius: 5px; transition: transform 0.2s;">
                ❤ ЛАЙКОВ: <span id="main-like-count">...</span>
            </button>
        `;

        // Вставляем перед подвалом или просто в конец body
        document.body.appendChild(likeSection);

        // 6. РАБОТА С ДАННЫМИ
        var likeRef = db.ref('likes/' + pageID);
        
        // Обновление счетчика в реальном времени
        likeRef.on('value', function(snapshot) {
            var count = snapshot.val() || 0;
            var countDisplay = document.getElementById('main-like-count');
            if (countDisplay) countDisplay.innerText = count;
        });

        // Обработка клика
        var btn = document.getElementById('main-like-btn');
        btn.onclick = function() {
            // Анимация нажатия
            btn.style.transform = "scale(0.95)";
            setTimeout(() => { btn.style.transform = "scale(1)"; }, 100);

            likeRef.transaction(function(current) {
                return (current || 0) + 1;
            });
        };

        console.log("HealthLogic: Система инициализирована для [" + pageID + "]");
    });
})();

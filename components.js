(function() {
    document.addEventListener("DOMContentLoaded", function() {
        
        // 1. НАСТРОЙКИ (Вставь свои из консоли Firebase!)
       
const firebaseConfig = {
  apiKey: "AIzaSyBgjwzfctB0Z9Lyak4WXTo_wxb2vS5L-rs",
  authDomain: "healthlogic-fe5bd.firebaseapp.com",
  databaseURL: "https://console.firebase.google.com/project/healthlogic-fe5bd/database/healthlogic-fe5bd-default-rtdb/data/~2F",
  projectId: "healthlogic-fe5bd",
  storageBucket: "healthlogic-fe5bd.firebasestorage.app",
  messagingSenderId: "177114233773",
  appId: "1:177114233773:web:0e341fb52efcf7dc2cff24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

        // 2. ПРОВЕРКА ЗАГРУЗКИ БИБЛИОТЕК
        if (typeof firebase === 'undefined' || typeof firebase.database === 'undefined') {
            console.error("❌ HealthLogic: Скрипты Firebase не загружены! Проверь порядок <script> в HTML.");
            return;
        }

        // 3. ИНИЦИАЛИЗАЦИЯ
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        var db = firebase.database();

        // 4. ГЕНЕРАЦИЯ ID СТРАНИЦЫ
        // Если зашли на "magnesium.html", ID будет "magnesium"
        var pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
        
        // Удаляем лишние точки из ID, если они есть (Firebase не любит точки в ключах)
        pageID = pageID.replace(/\./g, "_");

        // 5. СОЗДАНИЕ КНОПКИ
        var likeBtn = document.createElement('button');
        likeBtn.id = "dynamic-like-btn";
        likeBtn.innerHTML = `❤ ЛАЙКОВ: <span id="like-count">0</span>`;
        
        // Стиль кнопки (минимум CSS прямо в JS для надежности)
        likeBtn.style.cssText = "display: block; margin: 50px auto; padding: 15px 30px; background: #000; color: #fff; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 18px;";
        
        document.body.appendChild(likeBtn);

        // 6. ЛОГИКА БАЗЫ ДАННЫХ
        var counterRef = db.ref('likes/' + pageID);

        // Получаем текущее число лайков
        counterRef.on('value', function(snapshot) {
            var val = snapshot.val() || 0;
            document.getElementById('like-count').innerText = val;
        }, function(error) {
            console.error("❌ Ошибка чтения базы: ", error);
        });

        // Клик — увеличиваем счетчик
        likeBtn.onclick = function() {
            // Блокируем кнопку на полсекунды, чтобы не спамили
            likeBtn.disabled = true;
            
            counterRef.transaction(function(current) {
                return (current || 0) + 1;
            }).then(function() {
                likeBtn.disabled = false;
            }).catch(function(err) {
                console.error("❌ Ошибка записи: ", err);
                likeBtn.disabled = false;
            });
        };

        console.log("✅ HealthLogic успешно запущен для: " + pageID);
    });
})();

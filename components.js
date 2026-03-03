window.addEventListener('load', function() {

    const firebaseConfig = {
        apiKey: "AIzaSyBgjwzfctB0Z9Lyak4WXTo_wxb2vS5L-rs",
        authDomain: "healthlogic-fe5bd.firebaseapp.com",
        databaseURL: "https://healthlogic-fe5bd-default-rtdb.firebaseio.com",
        projectId: "healthlogic-fe5bd",
        storageBucket: "healthlogic-fe5bd.firebasestorage.app",
        messagingSenderId: "177114233773",
        appId: "1:177114233773:web:0e341fb52efcf7dc2cff24"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();
    const auth = firebase.auth(); // Подключаем сервис авторизации

    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    const storageKey = 'liked_' + pageID; // Ключ для проверки в браузере

    // Создаем кнопку
    const likeBtn = document.createElement('button');
    likeBtn.id = "l-btn";
    likeBtn.innerHTML = `❤ ЛАЙКОВ: <span id="l-count">0</span>`;
    likeBtn.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; z-index: 9999;
        background: #ff4757; color: white; border: none; padding: 15px 25px;
        border-radius: 50px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        font-weight: bold; transition: 0.3s;
    `;
    
    // Если пользователь уже лайкал эту страницу (проверяем память браузера)
    if (localStorage.getItem(storageKey)) {
        likeBtn.style.background = "#ccc"; // Серый цвет
        likeBtn.style.cursor = "default";
        likeBtn.disabled = true;
    }

    document.body.appendChild(likeBtn);

    const ref = db.ref('likes/' + pageID);
    ref.on('value', (s) => {
        document.getElementById('l-count').innerText = s.val() || 0;
    });

    // ЛОГИКА КЛИКА
    likeBtn.onclick = function() {
        const user = auth.currentUser;

        // 1. Проверка: вошел ли пользователь?
        if (!user) {
            alert("Пожалуйста, войдите в аккаунт, чтобы ставить лайки!");
            return;
        }

        // 2. Проверка: лайкал ли уже?
        if (localStorage.getItem(storageKey)) {
            return; 
        }

        // Если всё ок — записываем лайк
        ref.transaction(c => (c || 0) + 1);
        
        // Помечаем в браузере, что лайк поставлен
        localStorage.setItem(storageKey, 'true');
        
        // Выключаем кнопку
        likeBtn.style.background = "#ccc";
        likeBtn.disabled = true;
        alert("Спасибо за ваш голос!");
    };
});

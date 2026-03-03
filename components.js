// Ждем, пока браузер загрузит страницу
window.addEventListener('load', function() {

    // 1. ТВОЯ КОРОБКА С НАСТРОЙКАМИ (const)
    const firebaseConfig = {
        apiKey: "AIzaSyBgjwzfctB0Z9Lyak4WXTo_wxb2vS5L-rs", 
        authDomain: "healthlogic-fe5bd.firebaseapp.com",
        databaseURL: "https://healthlogic-fe5bd-default-rtdb.firebaseio.com", // ТВОЙ URL
        projectId: "healthlogic-fe5bd",
        storageBucket: "healthlogic-fe5bd.firebasestorage.app",
        messagingSenderId: "177114233773",
        appId: "1:177114233773:web:0e341fb52efcf7dc2cff24"
    };

    // 2. ПЕРЕДАЕМ ЭТУ КОРОБКУ В FIREBASE
    // Мы говорим: "Эй, Firebase, используй настройки из const firebaseConfig"
    const app = firebase.initializeApp(firebaseConfig);

    // 3. ПОДКЛЮЧАЕМ БАЗУ ДАННЫХ
    const db = firebase.database();

    // --- ДАЛЬШЕ ИДЕТ МАГИЯ ЛАЙКОВ ---
    
    // Определяем, на какой мы странице (magnesium, training и т.д.)
    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";

    // Создаем кнопку лайка
    const likeBox = document.createElement('div');
    likeBox.style.cssText = "text-align:center; margin: 30px; font-family: sans-serif;";
    likeBox.innerHTML = `<button id="l-btn" style="background:red; color:white; padding:10px 20px; border:none; cursor:pointer; border-radius:5px;">❤ ЛАЙКОВ: <span id="l-count">0</span></button>`;
    document.body.appendChild(likeBox);

    // Ссылка на конкретную страницу в базе
    const pageRef = db.ref('likes/' + pageID);

    // Слушаем базу: если кто-то лайкнул, цифра на экране изменится сама
    pageRef.on('value', (snap) => {
        document.getElementById('l-count').innerText = snap.val() || 0;
    });

    // Нажали на кнопку — прибавили +1 в базу
    document.getElementById('l-btn').onclick = function() {
        pageRef.transaction(current => (current || 0) + 1);
    };
});

// --- КОНФИГ (ВСТАВЬ СВОИ ДАННЫЕ ТУТ) ---

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
// --- ИНИЦИАЛИЗАЦИЯ ---
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const auth = firebase.auth();

// --- ФУНКЦИЯ ОТРИСОВКИ ---
function initApp() {
    // 1. Рисуем шапку (Header)
    const headerHTML = `
    <header style="padding: 20px 5%; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #121212; background: #F5F5DC; position: sticky; top: 0; z-index: 1000;">
        <a href="index.html" style="font-weight: 900; font-size: 22px; text-decoration: none; color: #121212;">HEALTHLOGIC.</a>
        <nav style="display: flex; gap: 20px;">
            <a href="index.html#about-target" style="text-decoration: none; color: #121212; font-weight: 700; font-size: 11px; text-transform: uppercase;">О нас</a>
            <a href="calc.html" style="text-decoration: none; color: #121212; font-weight: 700; font-size: 11px; text-transform: uppercase;">Калькулятор</a>
            <a href="auth.html" id="nav-auth-btn" style="text-decoration: none; color: white; background: #121212; padding: 8px 16px; font-size: 11px;">Вход</a>
        </nav>
    </header>`;
    
    // Вставляем шапку в самое начало body
    if (!document.querySelector('header')) {
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    // 2. Рисуем лайки и комменты (только на страницах статей)
    const isArticle = window.location.pathname.includes("training") || 
                     window.location.pathname.includes("magnesium") || 
                     window.location.pathname.includes("fiber");

    if (isArticle) {
        const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
        const interactionHTML = `
        <section id="firebase-section" style="padding: 60px 10%; background: #fff; border-top: 2px solid #121212;">
            <div style="margin-bottom: 30px;">
                <button id="like-btn" style="background: #fff; border: 2px solid #121212; padding: 12px 25px; cursor: pointer; font-weight: 900; font-family: sans-serif;">
                    ❤ ЛАЙК <span id="like-count">0</span>
                </button>
            </div>
            <div id="comment-section">
                <h3 style="text-transform: uppercase; font-weight: 900;">Обсуждение_</h3>
                <textarea id="comm-text" style="width:100%; height:80px; margin: 15px 0; padding:10px; border:2px solid #121212;" placeholder="Напишите что-нибудь..."></textarea>
                <button onclick="handleComment('${pageID}')" style="padding:10px 25px; background:#121212; color:#fff; border:none; cursor:pointer; font-weight:700;">ОТПРАВИТЬ</button>
                <div id="comm-list" style="margin-top:30px;"></div>
            </div>
        </section>`;

        const footer = document.querySelector('footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', interactionHTML);
        } else {
            document.body.insertAdjacentHTML('beforeend', interactionHTML);
        }

        // --- ЛОГИКА ЛАЙКОВ ---
        const likeRef = db.ref('likes/' + pageID);
        likeRef.on('value', (snap) => {
            const count = snap.val() || 0;
            const span = document.getElementById('like-count');
            if (span) span.innerText = count;
        });

        document.getElementById('like-btn').onclick = () => {
            likeRef.transaction(current => (current || 0) + 1);
        };

        // --- ЛОГИКА КОММЕНТОВ ---
        const commRef = db.ref('comments/' + pageID);
        commRef.on('value', (snap) => {
            const list = document.getElementById('comm-list');
            if (!list) return;
            list.innerHTML = "";
            snap.forEach(child => {
                const val = child.val();
                list.innerHTML += `<div style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <small style="font-weight:700;">${val.user}</small>
                    <p style="margin:5px 0;">${val.text}</p>
                </div>`;
            });
        });
    }
}

// Глобальная функция для отправки комментов
window.handleComment = (id) => {
    const text = document.getElementById('comm-text').value;
    if (!text) return;
    const user = auth.currentUser ? auth.currentUser.email : "Аноним";
    db.ref('comments/' + id).push({
        user: user,
        text: text,
        timestamp: Date.now()
    });
    document.getElementById('comm-text').value = "";
};

// Запуск
document.addEventListener("DOMContentLoaded", initApp);

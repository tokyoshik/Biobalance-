/**
 * HEALTHLOGIC - Core Components System
 * Включает: Toast, Auth, Admin Check, Anti-Cheat Likes, Dynamic Articles
 */

// 1. ГЛОБАЛЬНЫЕ СТИЛИ (TOAST, ADMIN, LIKES)
const coreStyles = document.createElement('style');
coreStyles.innerHTML = `
    .toast-container {
        position: fixed; bottom: -100px; left: 50%; transform: translateX(-50%);
        background: #fff; border: 4px solid #000; box-shadow: 10px 10px 0px #000;
        padding: 20px 30px; display: flex; align-items: center; gap: 20px; z-index: 10000;
        transition: bottom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); min-width: 300px;
    }
    .toast-container.show { bottom: 30px; }
    .toast-text { font-weight: 900; text-transform: uppercase; font-size: 13px; color: #000; line-height: 1.2; }
    .toast-close { cursor: pointer; font-weight: 900; background: #000; color: #fff; border: none; padding: 5px 12px; transition: 0.2s; }
    .toast-close:hover { background: #DED7B1; color: #000; }
    
    .like-btn.active { background: #DED7B1 !important; transform: translate(-2px, -2px); box-shadow: 4px 4px 0px #000; }
    .admin-badge { color: #FF0000 !important; font-weight: 900; border: 2px solid #FF0000 !important; padding: 4px 8px; font-size: 11px; margin-right: 10px; text-decoration: none; }
    
    .article-card { background:#fff; border:4px solid #000; box-shadow:10px 10px 0px #000; padding:20px; transition: 0.3s; display: flex; flex-direction: column; }
    .article-card:hover { transform: translate(-3px, -3px); box-shadow: 13px 13px 0px #000; }
`;
document.head.appendChild(coreStyles);

// 2. СИСТЕМА УВЕДОМЛЕНИЙ (TOAST)
function showToast(message) {
    const oldToast = document.querySelector('.toast-container');
    if (oldToast) oldToast.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-container';
    toast.innerHTML = `<span class="toast-text">${message}</span><button class="toast-close" onclick="this.parentElement.classList.remove('show')">✕</button>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => { if(toast) { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); } }, 5000);
}

// 3. ОСНОВНАЯ ЛОГИКА
document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.database();

    // --- ШАПКА ---
    const header = document.getElementById('main-header');
    if (header) {
        header.innerHTML = `
            <nav style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 4px solid #000; background: #fff;">
                <a href="index.html" style="font-size: 20px; font-weight: 900; text-decoration: none; color: #000; text-transform: uppercase; letter-spacing: -1px;">HealthLogic.</a>
                <div id="auth-status" style="display: flex; align-items: center;"></div>
            </nav>
        `;
    }

    // --- СЛЕЖЕНИЕ ЗА АВТОРИЗАЦИЕЙ ---
    auth.onAuthStateChanged(user => {
        const authStatus = document.getElementById('auth-status');
        if (!authStatus) return;

        if (user) {
            db.ref('users/' + user.uid + '/role').once('value').then(snap => {
                const isAdmin = snap.val() === 'admin';
                authStatus.innerHTML = `
                    ${isAdmin ? '<a href="admin.html" class="admin-badge">ADMIN</a>' : ''}
                    <a href="profile.html" style="font-weight: 800; margin-right: 15px; text-decoration: none; color: #000; border-bottom: 2px solid #000; font-size: 13px;">ПРОФИЛЬ</a>
                    <button onclick="firebase.auth().signOut().then(()=>location.reload())" style="background:#000; color:#fff; border:none; padding:6px 12px; font-weight:900; cursor:pointer; font-size: 11px;">ВЫХОД</button>
                `;
            });
        } else {
            authStatus.innerHTML = `<a href="auth.html" style="text-decoration:none; font-weight:900; color:#000; border:2px solid #000; padding:6px 12px; font-size: 12px;">ВХОД</a>`;
        }
        
        // После проверки юзера подгружаем статьи
        loadArticles(db, auth);
    });
});

// 4. ПОДГРУЗКА СТАТЕЙ
function loadArticles(db, auth) {
    const container = document.getElementById('articles-container');
    if (!container) return;

    db.ref('articles').on('value', snap => {
        const data = snap.val();
        if (!data) {
            container.innerHTML = '<div class="article-card" style="grid-column: 1/-1; text-align:center;">Статей пока нет. Напишите первую в админке!</div>';
            return;
        }

        container.innerHTML = '';
        const articles = Object.entries(data).reverse();

        articles.forEach(([id, post]) => {
            const date = new Date(post.date).toLocaleDateString('ru-RU');
            const card = document.createElement('article');
            card.className = 'article-card';
            card.innerHTML = `
                <img src="${post.image}" style="width:100%; height:200px; object-fit:cover; border:2px solid #000; margin-bottom:15px;">
                <h2 style="font-weight:900; text-transform:uppercase; font-size:18px; margin-bottom:10px;">${post.title}</h2>
                <p style="font-size:14px; line-height:1.4; margin-bottom:20px; flex-grow:1;">${post.text.substring(0, 120)}...</p>
                <div style="display:flex; justify-content:space-between; align-items:center; padding-top:15px; border-top:2px solid #eee;">
                    <span style="font-size:10px; font-weight:900; opacity:0.4;">${date}</span>
                    <button class="like-btn" data-id="${id}" style="background:#fff; border:2px solid #000; padding:8px 12px; font-weight:900; cursor:pointer; display:flex; gap:8px; align-items:center; font-size:12px;">
                        ❤ <span class="like-count">0</span>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

        // Инициализируем лайки для новых карточек
        initLikes(db, auth);
    });
}

// 5. ЛОГИКА ЛАЙКОВ (ANTI-CHEAT)
function initLikes(db, auth) {
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(btn => {
        const articleId = btn.getAttribute('data-id');
        const countSpan = btn.querySelector('.like-count');
        const likesRef = db.ref('likes/' + articleId);

        // Слушаем кол-во лайков
        likesRef.on('value', snap => {
            const data = snap.val() || {};
            countSpan.innerText = Object.
        

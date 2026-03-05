// 1. ЕДИНЫЙ КОНФИГ (Только здесь!)
const firebaseConfig = {
    apiKey: "AIzaSyBgjwzfctB0Z9Lyak4WXTo_wxb2vS5L-rs",
    authDomain: "healthlogic-fe5bd.firebaseapp.com",
    databaseURL: "https://healthlogic-fe5bd-default-rtdb.firebaseio.com",
    projectId: "healthlogic-fe5bd",
    storageBucket: "healthlogic-fe5bd.firebasestorage.app",
    messagingSenderId: "177114233773",
    appId: "1:177114233773:web:0e341fb52efcf7dc2cff24"
};

// 2. ИНИЦИАЛИЗАЦИЯ
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const auth = firebase.auth();

// 3. УНИВЕРСАЛЬНАЯ ПАНЕЛЬ ПОЛЬЗОВАТЕЛЯ (Вход/Выход/Ник)
async function initUserPanel() {
    const nav = document.getElementById('user-panel');
    if (!nav) return;

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // Получаем данные профиля из базы
            const snap = await db.ref(`users/${user.uid}`).once('value');
            const userData = snap.val() || {};
            const isAdmin = userData.role === 'admin';
            
            nav.innerHTML = `
                <div style="display:flex; gap:15px; align-items:center;">
                    <span style="font-weight:900; text-transform:uppercase; background:#ffcc00; padding:2px 5px;">
                        ${userData.username || 'Атлет'}
                    </span>
                    ${isAdmin ? '<a href="admin.html" style="color:red; font-weight:900; text-decoration:none; border:2px solid red; padding:2px 5px;">ADMIN</a>' : ''}
                    <button onclick="auth.signOut().then(()=>location.reload())" 
                            style="background:none; border:2px solid #000; cursor:pointer; font-weight:900; text-transform:uppercase; padding:5px 10px;">
                        Выход
                    </button>
                </div>
            `;
        } else {
            nav.innerHTML = `
                <a href="auth.html" style="font-weight:900; text-decoration:none; color:#000; border:4px solid #000; padding:10px 20px; text-transform:uppercase; background:#fff; box-shadow: 5px 5px 0px #000;">
                    Войти
                </a>
            `;
        }
    });
}

// 4. СЧЕТЧИК ПРОСМОТРОВ (Backend-логика)
function trackView(articleId) {
    if (!articleId) return;
    const viewRef = db.ref(`articles/${articleId}/views`);
    viewRef.transaction(current => (current || 0) + 1);
}

// Запускаем панель сразу при загрузке любой страницы
document.addEventListener('DOMContentLoaded', initUserPanel);

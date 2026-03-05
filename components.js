// 1. ИМПОРТ СОВРЕМЕННЫХ МОДУЛЕЙ
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase, ref, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 2. ТВОЙ ЕДИНЫЙ КОНФИГ (сохранен полностью)
const firebaseConfig = {
    apiKey: "AIzaSyBgjwzfctB0Z9Lyak4WXTo_wxb2vS5L-rs",
    authDomain: "healthlogic-fe5bd.firebaseapp.com",
    databaseURL: "https://healthlogic-fe5bd-default-rtdb.firebaseio.com",
    projectId: "healthlogic-fe5bd",
    storageBucket: "healthlogic-fe5bd.firebasestorage.app",
    messagingSenderId: "177114233773",
    appId: "1:177114233773:web:0e341fb52efcf7dc2cff24"
};

// 3. ИНИЦИАЛИЗАЦИЯ
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Для статей (Firestore)
export const rtdb = getDatabase(app); // Для счетчиков (Realtime DB)

// 4. ФУНКЦИЯ УВЕДОМЛЕНИЯ (сохранена логика и стиль)
export function showNotify(text) {
    let toast = document.getElementById('hl-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'hl-toast';
        Object.assign(toast.style, {
            position: 'fixed', bottom: '-150px', left: '50%', transform: 'translateX(-50%)',
            background: '#ffcc00', border: '4px solid #000', padding: '20px 30px',
            fontWeight: '900', textTransform: 'uppercase', boxShadow: '8px 8px 0px #000',
            zIndex: '10000', transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            minWidth: '320px', gap: '20px'
        });
        document.body.appendChild(toast);
    }
    toast.innerHTML = `
        <span style="font-size: 14px; line-height: 1.2;">${text}</span>
        <div onclick="this.parentElement.style.bottom = '-150px'" style="cursor:pointer; font-size:24px; font-weight:900; line-height:1;">×</div>
    `;
    setTimeout(() => { toast.style.bottom = '30px'; }, 100);
    setTimeout(() => { if(toast) toast.style.bottom = '-150px'; }, 3500);
}

// 5. ВЫХОД ИЗ СИСТЕМЫ
export const logoutUser = () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((err) => showNotify("Ошибка выхода"));
};

// 6. СЧЕТЧИК ПРОСМОТРОВ (адаптирован под v10)
export function trackView(articleId) {
    if (!articleId) return;
    const viewRef = ref(rtdb, `articles/${articleId}/views`);
    runTransaction(viewRef, (current) => {
        return (current || 0) + 1;
    });
}

// 7. ИНИЦИАЛИЗАЦИЯ ПАНЕЛИ (для старых страниц, если нужно)
export function initUserPanel() {
    const nav = document.getElementById('user-panel');
    if (!nav) return;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            nav.innerHTML = `
                <div style="display:flex; gap:15px; align-items:center;">
                    <span style="font-weight:900; text-transform:uppercase; background:#ffcc00; padding:2px 5px; border: 2px solid #000;">
                        ${user.email.split('@')[0]}
                    </span>
                    <button id="btn-logout-comp" style="background:none; border:2px solid #000; cursor:pointer; font-weight:900; text-transform:uppercase; padding:5px 10px;">
                        Выход
                    </button>
                </div>`;
            document.getElementById('btn-logout-comp').onclick = logoutUser;
        } else {
            nav.innerHTML = `<a href="login.html" style="font-weight:900; text-decoration:none; color:#000; border:4px solid #000; padding:10px 20px; text-transform:uppercase; background:#fff; box-shadow: 5px 5px 0px #000;">Войти</a>`;
        }
    });
}

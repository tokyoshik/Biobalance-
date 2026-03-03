// С - Твой конфиг (ВСТАВЬ СВОИ ДАННЫЕ ВНУТРИ {})

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
// В

// Инициализация
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

function renderHeader() {
    const headerHTML = `
    <header style="padding: 20px 5%; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #121212; background: #F5F5DC; position: sticky; top: 0; z-index: 1000; font-family: 'Inter', sans-serif;">
        <a href="index.html" style="font-weight: 900; font-size: 22px; text-decoration: none; color: #121212; letter-spacing: -1px;">HEALTHLOGIC.</a>
        <nav style="display: flex; gap: 20px; align-items: center;">
            <a href="index.html#about-target" style="text-decoration: none; color: #121212; font-weight: 700; font-size: 11px; text-transform: uppercase;">О нас</a>
            <a href="calc.html" style="text-decoration: none; color: #121212; font-weight: 700; font-size: 11px; text-transform: uppercase;">Калькулятор</a>
            <a href="auth.html" id="nav-auth-btn" style="text-decoration: none; color: white; font-weight: 700; font-size: 11px; text-transform: uppercase; background: #121212; padding: 8px 16px; border-radius: 2px;">Вход</a>
        </nav>
    </header>`;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    auth.onAuthStateChanged(user => {
        const btn = document.getElementById('nav-auth-btn');
        if(user && btn) btn.innerText = 'ПРОФИЛЬ';
    });
}

function renderInteractions() {
    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    const containerHTML = `
    <section style="padding: 60px 10%; background: #fff; border-top: 2px solid #121212; font-family: 'Inter', sans-serif;">
        <button id="like-btn" style="background: #fff; border: 2px solid #121212; padding: 10px 20px; cursor: pointer; font-weight: 900; margin-bottom: 20px;">
            ❤ ЛАЙК <span id="like-count">0</span>
        </button>
        <h3>Обсуждение_</h3>
        <textarea id="comm-text" style="width:100%; height:80px; margin: 15px 0; padding:10px; border:1px solid #121212;" placeholder="Ваше мнение..."></textarea>
        <button onclick="sendComm('${pageID}')" style="padding:10px 20px; background:#121212; color:#fff; border:none; cursor:pointer; font-weight:700;">ОТПРАВИТЬ</button>
        <div id="comm-list" style="margin-top:30px;"></div>
    </section>`;

    const footer = document.querySelector('footer');
    if(footer) footer.insertAdjacentHTML('beforebegin', containerHTML);

    // Подгрузка лайков
    db.collection("likes").doc(pageID).onSnapshot(doc => {
        if(doc.exists) document.getElementById('like-count').innerText = doc.data().count || 0;
    });

    document.getElementById('like-btn').onclick = () => {
        if(!auth.currentUser) return alert("Войдите!");
        db.collection("likes").doc(pageID).set({ count: firebase.firestore.FieldValue.increment(1) }, { merge: true });
    };

    // Подгрузка комментов
    db.collection("comments").where("page", "==", pageID).orderBy("time", "desc").onSnapshot(snap => {
        const list = document.getElementById('comm-list');
        list.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data();
            list.innerHTML += `<div style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <b style="font-size:12px;">${d.user}</b><p>${d.text}</p>
            </div>`;
        });
    });
}

window.sendComm = (id) => {
    const t = document.getElementById('comm-text').value;
    if(!auth.currentUser) return alert("Войдите!");
    if(!t) return;
    db.collection("comments").add({ page: id, user: auth.currentUser.email, text: t, time: firebase.firestore.FieldValue.serverTimestamp() });
    document.getElementById('comm-text').value = "";
};

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    if(window.location.pathname.includes("training") || window.location.pathname.includes("magnesium") || window.location.pathname.includes("fiber")) {
        renderInteractions();
    }
});

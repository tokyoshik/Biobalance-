// Инициализация базы (проверь, чтобы конфиг совпадал с твоим)
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

// Функция загрузки статей на главную
function loadArticles() {
    const container = document.getElementById('articles-container');
    if (!container) return;

    db.ref('articles').on('value', snap => {
        container.innerHTML = '';
        const data = snap.val();
        
        if (data) {
            Object.entries(data).reverse().forEach(([id, post]) => {
                const card = document.createElement('article');
                card.className = 'article-card';
                card.style.border = '4px solid #000';
                card.style.padding = '20px';
                card.style.background = '#fff';
                card.style.marginBottom = '20px';
                card.style.cursor = 'pointer';

                // Переход в статью при клике на всю карточку
                card.onclick = () => { window.location.href = `article.html?id=${id}`; };

                // Ищем первый попавшийся текст в блоках для описания
                let previewText = "Нажмите, чтобы прочитать полностью...";
                if (post.blocks && Array.isArray(post.blocks)) {
                    const firstText = post.blocks.find(b => b.type === 'text' && b.content);
                    if (firstText) {
                        previewText = firstText.content.substring(0, 120) + "...";
                    }
                }

                card.innerHTML = `
                    <div style="overflow:hidden; border-bottom:4px solid #000; margin:-20px -20px 20px -20px;">
                        <img src="${post.image || 'https://via.placeholder.com/600x300'}" 
                             style="width:100%; height:250px; object-fit:cover; display:block;">
                    </div>
                    <h2 style="font-weight:900; text-transform:uppercase; font-size:24px; margin-bottom:10px; line-height:1;">
                        ${post.title}
                    </h2>
                    <p style="font-size:16px; color:#333; margin-bottom:15px; font-weight:500;">
                        ${previewText}
                    </p>
                    <span style="font-weight:900; text-transform:uppercase; border-bottom:3px solid #000;">
                        Читать →
                    </span>
                `;
                container.appendChild(card);
            });
        } else {
            container.innerHTML = '<p style="font-weight:900; text-transform:uppercase;">Статей пока нет. Создай первую в админке!</p>';
        }
    });
}

// Вызываем загрузку при старте
document.addEventListener('DOMContentLoaded', loadArticles);

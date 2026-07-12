// ============================================================
// CONFIGURAÇÃO DOS COMENTÁRIOS DO BLOG (Google Realtime Database)
//
// Enquanto FIREBASE_CONFIG estiver como null, os artigos mostram
// o convite para comentar pelo WhatsApp.
//
// Para ativar, siga o passo a passo do GUIA-DO-BLOG.md e cole
// aqui a configuração do seu projeto. Exemplo:
//
// window.FIREBASE_CONFIG = {
//   apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXX",
//   authDomain: "blog-andre-4b335.firebaseapp.com",
//   projectId: "blog-andre-4b335",
//   databaseURL: "https://blog-andre-4b335-default-rtdb.firebaseio.com"
// };
// ============================================================
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAo2V6qT5ZhNAjaaIxLvee7aWfwcdw7XoY",
  authDomain: "blog-andre-4b335.firebaseapp.com",
  projectId: "blog-andre-4b335",
  databaseURL: "https://blog-andre-4b335-default-rtdb.firebaseio.com"
};

// Não altere daqui para baixo -----------------------------------
(function () {
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function fallback(area) {
    area.innerHTML =
      '<div class="cm-off">' +
      "<b>O que você pensa sobre isso?</b>" +
      "<p>O espaço de comentários está sendo preparado. Enquanto isso, me diga o que achou pelo WhatsApp. Eu leio e respondo todas as mensagens.</p>" +
      '<a href="https://wa.me/5516991392337?text=Ol%C3%A1%21%20Li%20um%20artigo%20do%20seu%20blog%20e%20quero%20comentar." class="cm-btn">Comentar pelo WhatsApp →</a>' +
      "</div>";
  }

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  function injectCss() {
    var css =
      ".cmx{display:flex;flex-direction:column;gap:18px}" +
      ".cmx-form{background:#fff;border:1px solid rgba(10,22,40,0.12);border-radius:16px;padding:22px 24px}" +
      ".cmx-hint{color:#5E6977;font-size:0.9rem;margin:0 0 12px}" +
      ".cmx-btn{background:#C9A24E;color:#1D1503;font-weight:600;font-size:0.88rem;padding:11px 22px;border-radius:999px;border:0;cursor:pointer;font-family:inherit}" +
      ".cmx-btn:hover{filter:brightness(1.05)}" +
      ".cmx-btn:disabled{opacity:0.6;cursor:wait}" +
      ".cmx-user{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:0.85rem;color:#182435;margin-bottom:10px}" +
      ".cmx-link{background:none;border:0;color:#A9822E;font-weight:600;cursor:pointer;font-size:0.8rem;font-family:inherit;text-decoration:underline}" +
      ".cmx-ta{width:100%;min-height:96px;border:1px solid rgba(10,22,40,0.18);border-radius:12px;padding:12px 14px;font-family:inherit;font-size:0.95rem;resize:vertical;margin-bottom:12px;background:#F5F1E8;color:#182435}" +
      ".cmx-ta:focus{outline:2px solid #C9A24E}" +
      ".cmx-list{display:flex;flex-direction:column;gap:12px}" +
      ".cmx-item{background:#fff;border:1px solid rgba(10,22,40,0.1);border-radius:14px;padding:16px 20px}" +
      ".cmx-item-head{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:6px}" +
      ".cmx-item-head b{color:#0A1628;font-size:0.92rem}" +
      ".cmx-item-head span{color:#94A3B3;font-size:0.76rem}" +
      ".cmx-item p{margin:0;color:#2A3646;font-size:0.93rem;white-space:pre-wrap}";
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
  }

  function boot(area) {
    var cfg = window.FIREBASE_CONFIG;
    if (!cfg.databaseURL && cfg.projectId) {
      cfg.databaseURL = "https://" + cfg.projectId + "-default-rtdb.firebaseio.com";
    }
    firebase.initializeApp(cfg);
    var db = firebase.database();
    var auth = firebase.auth();
    var slug =
      (location.pathname.split("/").pop() || "inicio").replace(/\.html$/, "") ||
      "inicio";
    slug = slug.replace(/[.#$\[\]]/g, "-");

    injectCss();
    area.innerHTML = "";
    var box = el("div", "cmx");
    var form = el("div", "cmx-form");
    var list = el("div", "cmx-list");
    box.appendChild(form);
    box.appendChild(list);
    area.appendChild(box);

    function refPagina() {
      return db.ref("blog-comentarios/" + slug);
    }

    function renderForm(user) {
      form.innerHTML = "";
      if (!user) {
        form.appendChild(
          el("p", "cmx-hint", "Para comentar, entre com a sua conta Google. Leva cinco segundos e evita spam.")
        );
        var b = el("button", "cmx-btn", "Entrar com Google");
        b.onclick = function () {
          auth
            .signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .catch(function (e) {
              alert("Não foi possível entrar agora. " + (e && e.message ? e.message : ""));
            });
        };
        form.appendChild(b);
      } else {
        var head = el("div", "cmx-user");
        head.appendChild(el("span", null, "Comentando como " + (user.displayName || "você")));
        var out = el("button", "cmx-link", "sair");
        out.onclick = function () { auth.signOut(); };
        head.appendChild(out);

        var ta = document.createElement("textarea");
        ta.className = "cmx-ta";
        ta.maxLength = 2000;
        ta.placeholder = "Escreva seu comentário...";

        var send = el("button", "cmx-btn", "Publicar comentário");
        var msg = el("p", "cmx-hint", "");
        msg.style.margin = "10px 0 0";

        send.onclick = function () {
          var t = ta.value.trim();
          if (!t) { ta.focus(); return; }
          send.disabled = true;
          send.textContent = "Publicando...";
          refPagina()
            .push({
              nome: user.displayName || "Leitor",
              uid: user.uid,
              texto: t,
              criadoEm: firebase.database.ServerValue.TIMESTAMP
            })
            .then(function () {
              ta.value = "";
              send.disabled = false;
              send.textContent = "Publicar comentário";
              msg.textContent = "";
              carregar();
            })
            .catch(function (e) {
              send.disabled = false;
              send.textContent = "Publicar comentário";
              msg.textContent = "Não foi possível publicar agora. " + (e && e.message ? e.message : "");
            });
        };

        form.appendChild(head);
        form.appendChild(ta);
        form.appendChild(send);
        form.appendChild(msg);
      }
    }

    function carregar() {
      refPagina()
        .orderByChild("criadoEm")
        .limitToLast(100)
        .once("value")
        .then(function (snap) {
          list.innerHTML = "";
          var itens = [];
          snap.forEach(function (child) { itens.push(child.val()); });
          if (!itens.length) {
            list.appendChild(el("p", "cmx-hint", "Seja a primeira pessoa a comentar."));
            return;
          }
          itens.reverse();
          itens.forEach(function (d) {
            var item = el("div", "cmx-item");
            var head = el("div", "cmx-item-head");
            head.appendChild(el("b", null, d.nome || "Leitor"));
            var when = d.criadoEm
              ? new Date(d.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
              : "";
            head.appendChild(el("span", null, when));
            item.appendChild(head);
            item.appendChild(el("p", null, d.texto || ""));
            list.appendChild(item);
          });
        })
        .catch(function () {
          list.innerHTML = "";
          list.appendChild(el("p", "cmx-hint", "Não foi possível carregar os comentários agora. Tente de novo em instantes."));
        });
    }

    auth.onAuthStateChanged(renderForm);
    carregar();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var area = document.getElementById("comentarios");
    if (!area) return;
    if (!window.FIREBASE_CONFIG) { fallback(area); return; }
    var base = "https://www.gstatic.com/firebasejs/10.14.1/";
    loadScript(base + "firebase-app-compat.js")
      .then(function () { return loadScript(base + "firebase-auth-compat.js"); })
      .then(function () { return loadScript(base + "firebase-database-compat.js"); })
      .then(function () { boot(area); })
      .catch(function () { fallback(area); });
  });
})();

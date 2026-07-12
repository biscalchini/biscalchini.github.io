// ============================================================
// CONFIGURAÇÃO DO BLOG
// Para ativar os comentários em TODOS os artigos de uma vez:
// 1. Crie uma conta gratuita em https://disqus.com
// 2. Escolha "I want to install Disqus on my site"
// 3. Dê um nome ao site (ex.: blog-andre-biscalchini) e anote o
//    "shortname" que o Disqus gerar
// 4. Escreva o shortname entre as aspas abaixo e suba este
//    arquivo de novo no GitHub
// ============================================================
window.BLOG_DISQUS_SHORTNAME = "";

// Não altere daqui para baixo -----------------------------------
document.addEventListener("DOMContentLoaded", function () {
  var area = document.getElementById("comentarios");
  if (!area) return;
  if (window.BLOG_DISQUS_SHORTNAME) {
    var thread = document.createElement("div");
    thread.id = "disqus_thread";
    area.appendChild(thread);
    var s = document.createElement("script");
    s.src = "https://" + window.BLOG_DISQUS_SHORTNAME + ".disqus.com/embed.js";
    s.setAttribute("data-timestamp", +new Date());
    document.body.appendChild(s);
  } else {
    area.innerHTML =
      '<div class="cm-off">' +
      '<b>O que você pensa sobre isso?</b>' +
      '<p>O espaço de comentários está sendo preparado. Enquanto isso, me diga o que achou pelo WhatsApp. Eu leio e respondo todas as mensagens.</p>' +
      '<a href="https://wa.me/5516991392337?text=Ol%C3%A1%21%20Li%20um%20artigo%20do%20seu%20blog%20e%20quero%20comentar." class="cm-btn">Comentar pelo WhatsApp →</a>' +
      "</div>";
  }
});

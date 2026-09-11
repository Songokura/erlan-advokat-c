/* ═══════════════════════════════════════════════════════════════════
   РАЗДЕЛ «СТАТЬИ» - источник данных Google-таблица
   Работает на трёх страницах, режим берётся из body[data-page]:
     index   - три последние карточки в секции #stati на главной
     list    - stati.html, весь список
     article - statya.html?id=<адрес>, одна статья
   Данные тянутся из таблицы через gviz (тот же приём, что и с прайсом
   на другом проекте): таблице достаточно доступа «по ссылке - читатель».
   Библиотек нет. Текст из таблицы экранируется целиком, в разметку
   превращается только наш мини-синтаксис (## - > **).
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ───────── источник ───────── */
  var SHEET = '1vge-THOUQHmAH-iiY8A0I_CMMVY6qpjqQm4lfEu4y44';   // «Адвокат Ерлан - статьи на сайт»
  var GID = '0';
  var URL_TQ = 'https://docs.google.com/spreadsheets/d/' + SHEET + '/gviz/tq?tqx=out:json&gid=' + GID + '&headers=1';
  /* кэша нет намеренно: клиент правит таблицу и сразу обновляет страницу,
     любой кэш выглядит как «да/нет ни на что не влияет» */

  var doc = document, root = doc.documentElement;
  var page = doc.body.getAttribute('data-page') || 'index';
  var WA = '77015350302';

  /* ───────── словарь интерфейса раздела ─────────
     Главная переводится своим script.js; здесь только строки, которых там нет,
     плюс шапка и подвал для stati.html / statya.html. */
  var I18N = {
    ru: {
      'st.nav': 'Статьи',
      'st.kicker': 'Статьи',
      'st.h1': 'Разбор ситуаций, с которыми приходят',
      'st.lead': 'Пишу о том, что спрашивают на первой встрече: какие документы решают дело, в какие сроки нужно успеть, что делать в первый час.',
      'st.h2': 'Что почитать до звонка',
      'st.home.lead': 'Короткие разборы: какие документы решают дело и что делать в первые часы.',
      'st.all': 'Все статьи',
      'st.read': 'Читать',
      'st.back': 'Все статьи',
      'st.other': 'Другие статьи',
      'st.empty': 'Статьи скоро появятся.',
      'st.notfound': 'Такой статьи нет. Возможно, её адрес изменился.',
      'st.cta.h': 'Ваш случай сложнее, чем в статье?',
      'st.cta.l': 'Опишите ситуацию - скажу, есть ли у дела перспектива и что нужно сделать в первую очередь.',
      'st.title': 'Статьи адвоката Ерлана Айтжанова, Астана',
      'st.desc': 'Разбор ситуаций от адвоката: взыскание долгов, споры об имуществе, уголовные дела в бизнесе. Что делать и какие документы собрать.',
      'st.doc': 'Прочитать статью',
      'brand.sub': 'адвокат, практика с 2001 года',
      'nav.dela': 'Ваш случай', 'nav.ugol': 'Уголовные дела', 'nav.opyt': 'Мои дела',
      'nav.poryadok': 'Как идёт дело', 'nav.raschet': 'Кто платит', 'nav.faq': 'Вопросы', 'nav.zayavka': 'Заявка',
      'btn.wa': 'Написать в WhatsApp', 'btn.call': 'Позвонить',
      'foot.l1': 'Адвокат Ерлан Айтжанов · Астана · практика с 2001 года',
      'foot.l2': 'Суммы и исходы - из судебных актов. Данные участников дел не раскрываются.'
    },
    kk: {
      'st.nav': 'Мақалалар',
      'st.kicker': 'Мақалалар',
      'st.h1': 'Маған келетін жағдайлардың талдауы',
      'st.lead': 'Алғашқы кездесуде сұралатын нәрсе туралы жазамын: қандай құжаттар істі шешеді, қандай мерзімде үлгеру керек, алғашқы сағатта не істеу керек.',
      'st.h2': 'Қоңырау шалғанға дейін не оқуға болады',
      'st.home.lead': 'Қысқа талдаулар: қандай құжаттар істі шешеді және алғашқы сағаттарда не істеу керек.',
      'st.all': 'Барлық мақала',
      'st.read': 'Оқу',
      'st.back': 'Барлық мақала',
      'st.other': 'Басқа мақалалар',
      'st.empty': 'Мақалалар жақында шығады.',
      'st.notfound': 'Мұндай мақала жоқ. Оның мекенжайы өзгерген болуы мүмкін.',
      'st.cta.h': 'Сіздің жағдайыңыз мақаладағыдан күрделі ме?',
      'st.cta.l': 'Жағдайды жазыңыз - істің болашағы бар-жоғын және алдымен не істеу керегін айтамын.',
      'st.title': 'Адвокат Ерлан Айтжановтың мақалалары, Астана',
      'st.desc': 'Адвокаттың талдауы: қарызды өндіру, мүлік дауы, бизнестегі қылмыстық істер. Не істеу керек және қандай құжаттар жинау керек.',
      'st.doc': 'Мақаланы оқу',
      'brand.sub': 'адвокат, тәжірибе 2001 жылдан',
      'nav.dela': 'Сіздің жағдайыңыз', 'nav.ugol': 'Қылмыстық істер', 'nav.opyt': 'Менің істерім',
      'nav.poryadok': 'Іс қалай жүреді', 'nav.raschet': 'Кім төлейді', 'nav.faq': 'Сұрақтар', 'nav.zayavka': 'Өтінім',
      'btn.wa': 'WhatsApp-қа жазу', 'btn.call': 'Қоңырау шалу',
      'foot.l1': 'Адвокат Ерлан Айтжанов · Астана · тәжірибе 2001 жылдан',
      'foot.l2': 'Сомалар мен нәтижелер - сот актілерінен. Іске қатысушылардың деректері ашылмайды.'
    }
  };

  var lang = 'ru';
  function t(k) { return (I18N[lang] && I18N[lang][k]) || I18N.ru[k] || ''; }

  /* ───────── утилиты ───────── */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function el(tag, cls, html) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  /* ссылка внутри сайта тащит за собой текущий язык:
     иначе с казахской страницы человек уходит на русскую */
  function href(base) {
    var h = base.indexOf('#'), hash = h < 0 ? '' : base.slice(h);
    var path = h < 0 ? base : base.slice(0, h);
    return path + (path.indexOf('?') < 0 ? '?' : '&') + 'lang=' + lang + hash;
  }

  /* адрес страницы из заголовка, если колонка «Адрес страницы» пустая */
  var TR = {
    а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',
    р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'c',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
    ә:'a',ғ:'g',қ:'q',ң:'n',ө:'o',ұ:'u',ү:'u',һ:'h',і:'i'
  };
  function slugify(s) {
    var out = '';
    String(s || '').toLowerCase().split('').forEach(function (ch) {
      if (TR[ch] !== undefined) out += TR[ch];
      else if (/[a-z0-9]/.test(ch)) out += ch;
      else out += '-';
    });
    return out.replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
  }

  /* картинка: ссылку на файл Google Drive превращаем в прямую,
     иначе у клиента «вставил ссылку - ничего не видно» */
  function imgUrl(u) {
    u = String(u || '').trim();
    if (!u) return '';
    /* ссылка на файл Google Диска в любом её виде - и просто вставленный id файла */
    var m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?[^]*?id=|thumbnail\?[^]*?id=)([\w-]{20,})/)
         || (/^[\w-]{25,}$/.test(u) ? [null, u] : null);
    if (m) return 'https://drive.google.com/thumbnail?id=' + m[1] + '&sz=w1600';
    if (/^https?:\/\//i.test(u)) return u;
    return '';
  }

  function fmtDate(d) {
    if (!d) return '';
    var mn = lang === 'kk'
      ? ['қаңтар','ақпан','наурыз','сәуір','мамыр','маусым','шілде','тамыз','қыркүйек','қазан','қараша','желтоқсан']
      : ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    return d.getDate() + ' ' + mn[d.getMonth()] + ' ' + d.getFullYear();
  }

  /* ───────── мини-разметка текста статьи ─────────
     пустая строка - абзац, «## » - подзаголовок, «- » - список,
     «> » - врезка, **жирный**, [текст](ссылка) и голые ссылки. */
  function inline(s) {
    s = esc(s);
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, function (_, txt, url) {
      return '<a href="' + esc(url) + '" target="_blank" rel="noopener nofollow">' + txt + '</a>';
    });
    s = s.replace(/(^|[\s(])(https?:\/\/[^\s<]+)/g, function (_, pre, url) {
      return pre + '<a href="' + esc(url) + '" target="_blank" rel="noopener nofollow">' + esc(url.replace(/^https?:\/\//, '')) + '</a>';
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return s;
  }
  function mdLite(text) {
    var lines = String(text || '').replace(/\r/g, '').split('\n');
    var html = '', para = [], list = [], quote = [];
    function flushPara() { if (para.length) { html += '<p>' + inline(para.join(' ')) + '</p>'; para = []; } }
    function flushList() {
      if (list.length) {
        html += '<ul>' + list.map(function (s) { return '<li>' + inline(s) + '</li>'; }).join('') + '</ul>';
        list = [];
      }
    }
    function flushQuote() { if (quote.length) { html += '<blockquote>' + inline(quote.join(' ')) + '</blockquote>'; quote = []; } }
    function flushAll() { flushPara(); flushList(); flushQuote(); }

    lines.forEach(function (raw) {
      var s = raw.trim();
      if (!s) { flushAll(); return; }
      if (/^#{2,3}\s+/.test(s)) { flushAll(); html += '<h2>' + inline(s.replace(/^#{2,3}\s+/, '')) + '</h2>'; return; }
      if (/^[-•*]\s+/.test(s)) { flushPara(); flushQuote(); list.push(s.replace(/^[-•*]\s+/, '')); return; }
      if (/^>\s?/.test(s)) { flushPara(); flushList(); quote.push(s.replace(/^>\s?/, '')); return; }
      flushList(); flushQuote(); para.push(s);
    });
    flushAll();
    return html;
  }

  /* ───────── чтение таблицы ───────── */
  function cellText(c) {
    if (!c) return '';
    if (c.f != null && typeof c.v !== 'string') return String(c.f).trim();
    return String(c.v == null ? '' : c.v).trim();
  }
  function cellDate(c) {
    if (!c || c.v == null) return null;
    var m = String(c.v).match(/^Date\((\d+),(\d+),(\d+)/);
    if (m) return new Date(+m[1], +m[2], +m[3]);
    var s = String(c.f || c.v).trim();
    var d = s.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/);
    if (d) return new Date(+d[3], +d[2] - 1, +d[1]);
    var i = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (i) return new Date(+i[1], +i[2] - 1, +i[3]);
    return null;
  }
  /* галочка, «да», «+», TRUE - показываем; «нет», «черновик», пусто - нет */
  function yes(s) { return /^(да|иа|иә|ия|yes|y|true|1|\+|v|х|x|✓|✔|показывать|вкл|on)$/i.test(String(s || '').trim()); }

  function parse(json) {
    var rows = (json.table && json.table.rows) || [];
    var out = [];
    rows.forEach(function (r) {
      var c = r.c || [];
      var pub = cellText(c[0]);
      var title = cellText(c[2]);
      if (!title) return;
      if (pub && !yes(pub)) return;            // пусто в колонке «Публиковать» = не публикуем
      if (!pub) return;
      var d = cellDate(c[1]);
      var kzT = cellText(c[5]), kzD = cellText(c[6]), kzX = cellText(c[7]);
      out.push({
        date: d,
        ru: { title: title, desc: cellText(c[3]), text: cellText(c[4]) },
        kk: { title: kzT || title, desc: kzD || cellText(c[3]), text: kzX || cellText(c[4]) },
        img: imgUrl(cellText(c[8])),
        id: slugify(cellText(c[9]) || title)
      });
    });
    /* свежие сверху; строки без даты уходят вниз */
    out.sort(function (a, b) { return (b.date ? b.date.getTime() : 0) - (a.date ? a.date.getTime() : 0); });
    /* два одинаковых адреса ломают ссылку - разводим суффиксом */
    var seen = {};
    out.forEach(function (a) {
      if (seen[a.id]) a.id = a.id + '-' + (++seen[a.id]);
      else seen[a.id] = 1;
    });
    return out;
  }

  function load() {
    /* «&_=» глушит кэш браузера и CDN: без него правка в таблице догоняет сайт минутами */
    return fetch(URL_TQ + (URL_TQ.indexOf('?') < 0 ? '?' : '&') + '_=' + Date.now(), { credentials: 'omit', cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (txt) {
        var i = txt.indexOf('{'), j = txt.lastIndexOf('}');
        if (i < 0 || j < 0) throw new Error('bad payload');
        return parse(JSON.parse(txt.slice(i, j + 1)));
      });
  }

  /* ───────── карточка списка ───────── */
  function card(a) {
    var v = a[lang] || a.ru;
    var cover = a.img
      ? '<span class="art-cover"><img src="' + esc(a.img) + '" alt="" loading="lazy" decoding="async"></span>'
      : '<span class="art-cover art-cover-blank" aria-hidden="true"></span>';
    return '<a class="art-card" href="' + esc(href('statya.html?id=' + encodeURIComponent(a.id))) + '">' +
      cover +
      '<span class="art-card-in">' +
        (a.date ? '<span class="art-date">' + esc(fmtDate(a.date)) + '</span>' : '') +
        '<span class="art-card-t">' + esc(v.title) + '</span>' +
        (v.desc ? '<span class="art-card-d">' + esc(v.desc) + '</span>' : '') +
        '<span class="art-more">' + esc(t('st.read')) + '</span>' +
      '</span>' +
    '</a>';
  }

  /* ───────── страницы ───────── */
  var data = null;

  function renderIndex() {
    var sec = doc.getElementById('stati'); if (!sec) return;
    var grid = sec.querySelector('.art-grid');
    if (!data || !data.length) { sec.hidden = true; return; }
    sec.hidden = false;
    grid.innerHTML = data.slice(0, 3).map(card).join('');
  }

  function renderList() {
    var grid = doc.getElementById('artGrid'), note = doc.getElementById('artNote');
    if (!grid || data === null) return;                 // ещё грузится - место не мигает
    if (!data.length) {
      grid.innerHTML = '';
      note.hidden = false;
      note.textContent = t('st.empty');
      return;
    }
    note.hidden = true;
    grid.innerHTML = data.map(card).join('');
  }

  function meta(name, val, prop) {
    var sel = prop ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
    var m = doc.querySelector(sel);
    if (!m) { m = doc.createElement('meta'); m.setAttribute(prop ? 'property' : 'name', name); doc.head.appendChild(m); }
    m.setAttribute('content', val);
  }

  function renderArticle() {
    var wrapEl = doc.getElementById('artBody'); if (!wrapEl || data === null) return;
    var id = new URLSearchParams(location.search).get('id') || '';
    var a = null;
    (data || []).forEach(function (x) { if (x.id === id) a = x; });

    if (!a) {
      wrapEl.innerHTML = '<p class="art-note">' + esc(t(data.length ? 'st.notfound' : 'st.empty')) + '</p>' +
        '<p class="btns"><a class="btn btn-ghost" href="' + esc(href('stati.html')) + '">' + esc(t('st.back')) + '</a></p>';
      doc.title = t('st.title');
      return;
    }

    var v = a[lang] || a.ru;
    doc.title = v.title + ' - ' + (lang === 'kk' ? 'адвокат Ерлан Айтжанов' : 'адвокат Ерлан Айтжанов');
    meta('description', (v.desc || v.text).slice(0, 300));
    meta('og:title', v.title, true);
    meta('og:description', (v.desc || v.text).slice(0, 300), true);
    if (a.img) meta('og:image', a.img, true);

    var link = doc.querySelector('link[rel="canonical"]');
    if (link) link.setAttribute('href', location.origin + location.pathname + '?id=' + encodeURIComponent(a.id));

    wrapEl.innerHTML =
      '<nav class="art-crumbs"><a href="' + esc(href('index.html')) + '">' + (lang === 'kk' ? 'Басты бет' : 'Главная') + '</a>' +
      '<span>·</span><a href="' + esc(href('stati.html')) + '">' + esc(t('st.nav')) + '</a></nav>' +
      (a.date ? '<p class="art-date">' + esc(fmtDate(a.date)) + '</p>' : '') +
      '<h1 class="art-h1">' + esc(v.title) + '</h1>' +
      (v.desc ? '<p class="art-lead">' + esc(v.desc) + '</p>' : '') +
      (a.img ? '<figure class="art-hero"><img src="' + esc(a.img) + '" alt="" loading="eager" decoding="async"></figure>' : '') +
      '<div class="art-text">' + mdLite(v.text) + '</div>';

    /* разметка для поиска: статья со своим заголовком и датой */
    var ld = doc.getElementById('artLd');
    if (!ld) { ld = doc.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'artLd'; doc.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Article',
      headline: v.title, description: v.desc || '',
      datePublished: a.date ? a.date.toISOString().slice(0, 10) : undefined,
      author: { '@type': 'Person', name: 'Ерлан Айтжанов' },
      publisher: { '@type': 'Organization', name: 'Адвокат Ерлан Айтжанов' },
      inLanguage: lang === 'kk' ? 'kk' : 'ru'
    });

    /* другие статьи внизу */
    var other = doc.getElementById('artOther');
    var rest = (data || []).filter(function (x) { return x.id !== a.id; }).slice(0, 3);
    if (other) {
      if (!rest.length) other.hidden = true;
      else {
        other.hidden = false;
        other.querySelector('.art-grid').innerHTML = rest.map(card).join('');
      }
    }
  }

  function render() {
    if (page === 'list') renderList();
    else if (page === 'article') renderArticle();
    else renderIndex();
  }

  /* ───────── язык ─────────
     На главной язык ведёт script.js, отсюда только перерисовка карточек.
     На страницах раздела язык целиком на этом файле. */
  function applyLang(l, persist) {
    lang = I18N[l] ? l : 'ru';
    root.setAttribute('lang', lang);
    doc.querySelectorAll('[data-i18n-art]').forEach(function (n) {
      var k = n.getAttribute('data-i18n-art');
      if (I18N[lang][k] !== undefined) n.textContent = t(k);
    });
    doc.querySelectorAll('.lang button').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    doc.querySelectorAll('a[data-keep-lang]').forEach(function (a) {
      a.setAttribute('href', href(a.getAttribute('data-keep-lang')));
    });
    if (page === 'list') {
      doc.title = t('st.title');
      var md = doc.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', t('st.desc'));
    }
    if (persist) { try { localStorage.setItem('lang', lang); } catch (e) {} }
    render();
  }

  /* шапка, меню и липкая панель нужны только на страницах раздела:
     на главной этим занимается script.js */
  function initChrome() {
    var hdr = doc.getElementById('hdr');
    if (hdr) hdr.classList.add('solid');

    var burger = doc.getElementById('burger'), menu = doc.getElementById('menu');
    if (burger && menu) {
      var open = function (on) {
        if (on) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add('show'); }); }
        else { menu.classList.remove('show'); setTimeout(function () { menu.hidden = true; }, 300); }
        doc.body.classList.toggle('menu-open', on);
        burger.setAttribute('aria-expanded', on ? 'true' : 'false');
        doc.body.style.overflow = on ? 'hidden' : '';
      };
      burger.addEventListener('click', function () { open(!doc.body.classList.contains('menu-open')); });
      doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && doc.body.classList.contains('menu-open')) open(false); });
      menu.addEventListener('click', function (e) { if (e.target.closest('a')) open(false); });
    }

    var bar = doc.getElementById('bar');
    if (bar) {
      var upd = function () {
        var show = window.scrollY > 500;
        bar.classList.toggle('show', show);
        bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      };
      window.addEventListener('scroll', upd, { passive: true });
      upd();
    }

    doc.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-track]'); if (!a) return;
      doc.dispatchEvent(new CustomEvent('lead', { detail: { type: a.getAttribute('data-track'), href: a.href } }));
    });

    doc.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang'), true); });
    });
  }

  /* ───────── старт ───────── */
  if (page === 'index') {
    /* язык уже выставил script.js; ловим его переключение */
    doc.addEventListener('langchange', function (e) { lang = (e.detail && e.detail.lang) || 'ru'; render(); });
    lang = root.getAttribute('lang') === 'kk' ? 'kk' : 'ru';
  } else {
    initChrome();
    var q = new URLSearchParams(location.search).get('lang'), saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) {}
    applyLang(q || saved || 'ru', !!q);
  }

  load().then(function (list) {
    data = list;
    render();
  }).catch(function (err) {
    data = [];
    if (window.console) console.warn('[статьи] таблица недоступна:', err && err.message);
    render();
  });
})();

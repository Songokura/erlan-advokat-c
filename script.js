/* ═══════════════════════════════════════════════════════════════════
   ВАРИАНТ C - «Кабинет. Ночь. Лампа.»
   1) плиты: scroll -> --enter/--stay/--exit на .pw, остальное делает CSS
   2) интро героя (конус лампы включается)
   3) счётчики сумм и «зажигание» карточек и дел
   4) i18n RU/KK (?lang= главнее localStorage)
   5) меню, якоря, липкая панель, форма -> WhatsApp
   Библиотек нет.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var WA = '77000000000';                 // номер WhatsApp - заглушка
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };

  /* ───────── словари ───────── */
  var I18N = {
    ru: {
      'title': 'Адвокат Ерлан Т., Астана: крупные споры от 10 млн ₸, взыскано свыше 4,6 млрд ₸',
      'desc': 'Адвокат по крупным спорам о деньгах и имуществе в Астане. Практика с 2001 года, по делам доверителей взыскано свыше 4,6 млрд тенге. Долги, застройщики, раздел имущества, налоговые доначисления, уголовные дела по бизнесу. Веду дело до исполнения решения.',
      'brand.sub': 'адвокат, практика с 2001 года',
      'nav.dela': 'Ваш случай', 'nav.opyt': 'Мои дела', 'nav.poryadok': 'Как идёт дело', 'nav.raschet': 'Кто платит', 'nav.faq': 'Вопросы', 'nav.zayavka': 'Заявка',
      'hero.kicker': 'Астана · адвокат · практика с 2001 года',
      'hero.h1a': 'Адвокат', 'hero.h1b': 'по крупным спорам',
      'hero.lead': 'Взыскано свыше 4,6 млрд ₸ по делам доверителей. Беру споры от 10 млн ₸ и веду их до исполнения решения: моя работа взыскивается с проигравшей стороны.',
      'btn.wa': 'Написать в WhatsApp', 'btn.cases': 'Мои дела', 'btn.call': 'Позвонить',
      'mq': ['Долги по договорам', 'Споры с партнёрами', 'Споры с банками', 'Недоплата по ДТП', 'Раздел имущества', 'Застройщик не отдаёт помещение', 'Земельные споры', 'Налоговые доначисления', 'Уголовные дела по бизнесу'],
      'itogi.kicker': 'Итог по решениям судов',
      'itogi.cap': 'взыскано по делам доверителей и подтверждено судебными актами',
      'itogi.s1': 'лет практики', 'itogi.s2': 'крупнейшее дело', 'itogi.s3': 'дел с исходом в пользу доверителя', 'u.bln': 'млрд',
      'dela.kicker': 'Ваш случай', 'dela.h2': 'С чем приходят ко мне',
      'dela.lead': 'Три группы споров. Порог - 10 млн ₸: дела меньше не беру, чтобы каждое вести лично и до конца.',
      'g.money': 'Вам должны деньги', 'g.property': 'Спор об имуществе', 'g.state': 'Против вас государство',
      'd.dolg.t': 'Долг по договору или поставке', 'd.dolg.l': 'Работу сдали, товар отгрузили - денег нет.', 'd.dolg.p': '5 250 000 ₸ по расписке, взыскано полностью, 2018',
      'd.partner.t': 'Спор с партнёром по бизнесу', 'd.partner.l': 'Доли, сделки, помещения, которые не отдают.', 'd.partner.p': 'Помещение истребовано из чужого владения, 2018',
      'd.bank.t': 'Спор с банком или нацкомпанией', 'd.bank.l': 'Залоги, аресты, требования крупной стороны.', 'd.bank.p': 'Иск о недействительности залога отклонён, устоял в апелляции, 2019',
      'd.dtp.t': 'Недоплата по ДТП', 'd.dtp.l': 'Страховой выплаты не хватило, виновник не платит.', 'd.dtp.p': 'Виновник осуждён, потерпевшей присуждено 700 000 ₸, 2018',
      'd.razvod.t': 'Раздел имущества при разводе', 'd.razvod.l': 'Квартиры, дома, доли в бизнесе.', 'd.razvod.p': 'Беру споры от 10 млн ₸',
      'd.zastr.t': 'Застройщик не отдаёт помещение', 'd.zastr.l': 'Долгострой, паевые взносы, предварительные договоры.', 'd.zastr.p': '2 980 969 609 ₸ взыскано с двух застройщиков, 2020',
      'd.zemlya.t': 'Земельный спор', 'd.zemlya.l': 'Участок отбирают, арестовывают, не дают оформить.', 'd.zemlya.p': 'Участок и недвижимость освобождены от арестов, 2017',
      'd.nalog.t': 'Налоговые и таможенные доначисления', 'd.nalog.l': 'Уведомление требует доплатить - оспариваю.', 'd.nalog.p': '4 711 610 ₸ доначислений признаны незаконными полностью, 2025',
      'd.ugol.t': 'Уголовное дело по бизнесу', 'd.ugol.l': 'Защита предпринимателя и возмещение ущерба потерпевшему.', 'd.ugol.p': '70 070 000 ₸ ущерба от преступления взысканы деньгами, 2024',
      'opyt.kicker': 'Мои дела', 'opyt.h2': 'Взыскано и возвращено доверителям',
      'opyt.lead': 'Суммы - из решений судов. Без имён, названий компаний и номеров дел.',
      'c.a1': 'Долгострой: договоры с двумя застройщиками расторгнуты, деньги дольщиков взысканы солидарно, комплекс с проектной документацией передан кооперативу',
      'c.a2': 'Тот же комплекс, вторая группа домов: предварительные договоры купли-продажи расторгнуты, оплаченное взыскано',
      'c.a3': 'Ещё один замороженный жилой комплекс: договоры расторгнуты, суммы взысканы и переданы в кооператив как паевые взносы',
      'c.a4': 'Ущерб от преступления в долевом строительстве: апелляция изменила решение, взыскано деньгами, а не помещениями',
      'c.a5': 'Два дольщика: первая инстанция отказала, апелляция отменила решение и удовлетворила иск полностью',
      'c.a6': 'Деньги на хранении по расписке не вернули: взысканы полностью, с пошлиной и расходами на представителя',
      'c.a7': 'Десять клиентов турфирмы: договоры поручения расторгнуты, оплата возвращена каждому',
      'r.coop': 'представлял кооператив дольщиков', 'r.coop2': 'представлял кооператив', 'r.plaintiff': 'представлял истца', 'r.plaintiffs': 'представлял истцов', 'r.def': 'представлял ответчика',
      'opyt.def': 'Отбились: иск к доверителю отклонён',
      't.cancel': 'списано', 't.none': 'не взыскано',
      'c.b1': 'Таможня доначислила пошлины и налоги: апелляция признала уведомление незаконным полностью',
      'c.b2': 'Бывший водитель требовал зарплату с предпринимателя без трудового договора: в иске отказано',
      'c.b3s': 'Права сохранены', 'c.b3': 'ДТП с грузовиком: производство по административному делу прекращено за отсутствием состава',
      'c.b8': 'Иск о компенсации морального вреда отклонён',
      'opyt.note': 'В реестре 27 дел с 2009 по 2026 год. Решения показываю на встрече.',
      'dd.kicker': 'До исполнения', 'dd.h2': 'Веду дело до денег, а не до решения',
      'dd.lead': 'Решение суда - бумага. Исполнительный лист и деньги на счёте - результат.',
      'p.kicker': 'Как идёт дело', 'p.h2': 'Четыре шага от звонка до денег',
      'p.s1t': 'Звонок', 'p.s1': 'Коротко: что случилось и какая сумма.',
      'p.s2t': 'Полчаса с документами', 'p.s2': 'Прямой ответ, есть ли у дела перспектива.',
      'p.s3t': 'Цена и план', 'p.s3': 'Стоимость работы фиксируется и входит в иск.',
      'p.s4t': 'Решение и исполнение', 'p.s4': 'Суд, апелляция, исполнительный лист, деньги.',
      'rs.kicker': 'Кто платит', 'rs.h2': 'Мою работу оплачивает проигравшая сторона',
      'rs.debt': 'Долг', 'rs.fee': 'Моя работа', 'rs.total': 'В иске',
      'rs.cap': 'Пример: 7 % от суммы долга. Беру только дела, в которых вижу победу.',
      'k.kicker': 'Что принести', 'k.h2': 'Полчаса с документами - и прямой ответ',
      'k.lead': 'Договор, акты, платёжки, переписка. По ДТП - протокол, постановление, полис.',
      'f.kicker': 'Вопросы', 'f.h2': 'Что спрашивают до звонка',
      'f.q1': 'Есть ли у моего дела шанс?', 'f.a1': 'Скажу после получаса с документами. Если победы не вижу - за дело не берусь.',
      'f.q2': 'Сколько стоит ваша работа?', 'f.a2': 'Фиксированная сумма, около 7 % от цены иска. Она входит в иск и взыскивается с проигравшей стороны.',
      'f.q3': 'Когда я получу деньги?', 'f.a3': 'После решения идёт исполнение: исполнительный лист и взыскание. Веду дело до этого этапа включительно.',
      'f.q4': 'Берёте дела меньше 10 млн ₸?', 'f.a4': 'Нет. Порог нужен, чтобы каждое дело вести лично и до конца.',
      'z.kicker': 'Заявка', 'z.h2': 'Опишите, что случилось',
      'z.lead': 'Отвечу лично. Полчаса с документами - и вы знаете, есть ли у дела перспектива.',
      'z.name': 'Имя', 'z.name.ph': 'Как к вам обращаться', 'z.phone': 'Телефон',
      'z.msg': 'Что случилось и какая сумма', 'z.msg.ph': 'Например: заказчик не платит по договору, 24 млн ₸',
      'z.send': 'Отправить в WhatsApp', 'z.err': 'Заполните имя и телефон.',
      'z.ok': 'Спасибо. Открылся WhatsApp с вашим сообщением - отправьте его.',
      'z.addr': 'Астана · приём по договорённости',
      'foot.l1': 'Адвокат Ерлан Т. · Астана · практика с 2001 года',
      'foot.l2': 'Суммы и исходы - из судебных актов. Данные участников дел не раскрываются.',
      'wa.hello': 'Здравствуйте, Ерлан. Меня зовут {name}, телефон {phone}.', 'wa.msg': 'Что случилось: {msg}'
    },
    kk: {
      'title': 'Адвокат Ерлан Т., Астана: 10 млн теңгеден жоғары ірі даулар, 4,6 млрд теңгеден астам өндірілді',
      'desc': 'Астанадағы ақша мен мүлік туралы ірі даулар бойынша адвокат. 2001 жылдан бері практика, сенім білдірушілердің істері бойынша 4,6 млрд теңгеден астам өндірілді. Қарыздар, құрылыс салушылар, мүлікті бөлу, салықтық қосымша есептеулер, бизнес бойынша қылмыстық істер. Істі шешім орындалғанға дейін жүргіземін.',
      'brand.sub': 'адвокат, 2001 жылдан бері',
      'nav.dela': 'Сіздің жағдайыңыз', 'nav.opyt': 'Менің істерім', 'nav.poryadok': 'Іс қалай жүреді', 'nav.raschet': 'Кім төлейді', 'nav.faq': 'Сұрақтар', 'nav.zayavka': 'Өтінім',
      'hero.kicker': 'Астана · адвокат · 2001 жылдан бері',
      'hero.h1a': 'Адвокат', 'hero.h1b': 'ірі даулар бойынша',
      'hero.lead': 'Сенім білдірушілердің істері бойынша 4,6 млрд теңгеден астам өндірілді. 10 млн теңгеден жоғары дауларды аламын және шешім орындалғанға дейін жүргіземін: жұмысымның құнын ұтылған тарап төлейді.',
      'btn.wa': 'WhatsApp арқылы жазу', 'btn.cases': 'Менің істерім', 'btn.call': 'Қоңырау шалу',
      'mq': ['Шарт бойынша қарыздар', 'Серіктестермен даулар', 'Банктермен даулар', 'ЖКО бойынша төлемнің жетіспеуі', 'Мүлікті бөлу', 'Құрылыс салушы үй-жайды бермейді', 'Жер даулары', 'Салықтық қосымша есептеулер', 'Бизнес бойынша қылмыстық істер'],
      'itogi.kicker': 'Сот шешімдері бойынша қорытынды',
      'itogi.cap': 'сенім білдірушілердің істері бойынша өндірілді және сот актілерімен расталды',
      'itogi.s1': 'жыл практика', 'itogi.s2': 'ең ірі іс', 'itogi.s3': 'іс сенім білдірушінің пайдасына шешілді', 'u.bln': 'млрд',
      'dela.kicker': 'Сіздің жағдайыңыз', 'dela.h2': 'Маған немен келеді',
      'dela.lead': 'Даулардың үш тобы. Шегі - 10 млн теңге: одан төмен істерді алмаймын, әр істі жеке және соңына дейін жүргізу үшін.',
      'g.money': 'Сізге ақша қарыз', 'g.property': 'Мүлік туралы дау', 'g.state': 'Сізге қарсы мемлекет',
      'd.dolg.t': 'Шарт немесе жеткізілім бойынша қарыз', 'd.dolg.l': 'Жұмыс тапсырылды, тауар жөнелтілді - ақша жоқ.', 'd.dolg.p': 'Қолхат бойынша 5 250 000 ₸, толық өндірілді, 2018',
      'd.partner.t': 'Бизнес-серіктеспен дау', 'd.partner.l': 'Үлестер, мәмілелер, қайтарылмайтын үй-жайлар.', 'd.partner.p': 'Үй-жай бөтен заңсыз иеліктен қайтарылды, 2018',
      'd.bank.t': 'Банкпен немесе ұлттық компаниямен дау', 'd.bank.l': 'Кепілдер, тыйым салулар, ірі тараптың талаптары.', 'd.bank.p': 'Кепілді жарамсыз деп тану туралы талап қабылданбады, апелляцияда сақталды, 2019',
      'd.dtp.t': 'ЖКО бойынша төлемнің жетіспеуі', 'd.dtp.l': 'Сақтандыру төлемі жетпеді, кінәлі төлемейді.', 'd.dtp.p': 'Кінәлі сотталды, жәбірленушіге 700 000 ₸ тағайындалды, 2018',
      'd.razvod.t': 'Ажырасу кезінде мүлікті бөлу', 'd.razvod.l': 'Пәтерлер, үйлер, бизнестегі үлестер.', 'd.razvod.p': '10 млн теңгеден жоғары дауларды аламын',
      'd.zastr.t': 'Құрылыс салушы үй-жайды бермейді', 'd.zastr.l': 'Ұзаққа созылған құрылыс, пай жарналары, алдын ала шарттар.', 'd.zastr.p': 'Екі құрылыс салушыдан 2 980 969 609 ₸ өндірілді, 2020',
      'd.zemlya.t': 'Жер дауы', 'd.zemlya.l': 'Учаскені тартып алады, тыйым салады, рәсімдеуге бермейді.', 'd.zemlya.p': 'Учаске мен жылжымайтын мүлік тыйымнан босатылды, 2017',
      'd.nalog.t': 'Салық және кеден бойынша қосымша есептеулер', 'd.nalog.l': 'Хабарлама қосымша төлеуді талап етеді - дауласамын.', 'd.nalog.p': '4 711 610 ₸ қосымша есептеу толық заңсыз деп танылды, 2025',
      'd.ugol.t': 'Бизнес бойынша қылмыстық іс', 'd.ugol.l': 'Кәсіпкерді қорғау және жәбірленушіге залалды өтеу.', 'd.ugol.p': 'Қылмыстан келген 70 070 000 ₸ залал ақшалай өндірілді, 2024',
      'opyt.kicker': 'Менің істерім', 'opyt.h2': 'Өндіріліп, сенім білдірушілерге қайтарылды',
      'opyt.lead': 'Сомалар - сот шешімдерінен. Аты-жөнсіз, компания атауларынсыз, іс нөмірлерінсіз.',
      'c.a1': 'Ұзаққа созылған құрылыс: екі құрылыс салушымен шарттар бұзылды, үлескерлердің ақшасы ортақ түрде өндірілді, кешен жобалық құжаттамасымен кооперативке берілді',
      'c.a2': 'Сол кешен, үйлердің екінші тобы: алдын ала сатып алу-сату шарттары бұзылды, төленген сома өндірілді',
      'c.a3': 'Тағы бір тоқтап қалған тұрғын үй кешені: шарттар бұзылды, сомалар өндіріліп, кооперативке пай жарнасы ретінде берілді',
      'c.a4': 'Үлестік құрылыстағы қылмыстан келген залал: апелляция шешімді өзгертіп, үй-жаймен емес, ақшалай өндірді',
      'c.a5': 'Екі үлескер: бірінші сатыдағы сот бас тартты, апелляция шешімнің күшін жойып, талапты толық қанағаттандырды',
      'c.a6': 'Қолхат бойынша сақтауға берілген ақша қайтарылмады: мемлекеттік бажбен және өкіл шығындарымен бірге толық өндірілді',
      'c.a7': 'Турфирманың он клиенті: тапсырма шарттары бұзылды, төлем әрқайсысына қайтарылды',
      'r.coop': 'үлескерлер кооперативінің атынан', 'r.coop2': 'кооперативтің атынан', 'r.plaintiff': 'талапкердің атынан', 'r.plaintiffs': 'талапкерлердің атынан', 'r.def': 'жауапкердің атынан',
      'opyt.def': 'Қорғадық: сенім білдірушіге қойылған талап қабылданбады',
      't.cancel': 'есептен шығарылды', 't.none': 'өндірілмеді',
      'c.b1': 'Кеден баждар мен салықтарды қосымша есептеді: апелляция хабарламаны толық заңсыз деп таныды',
      'c.b2': 'Бұрынғы жүргізуші еңбек шартынсыз кәсіпкерден жалақы талап етті: талап қабылданбады',
      'c.b3s': 'Куәлік сақталды', 'c.b3': 'Жүк көлігімен ЖКО: әкімшілік іс бойынша іс жүргізу құрам болмағандықтан тоқтатылды',
      'c.b8': 'Моральдық зиянды өтеу туралы талап қабылданбады',
      'opyt.note': 'Тізілімде 2009-2026 жылдардағы 27 іс бар. Шешімдерді кездесуде көрсетемін.',
      'dd.kicker': 'Орындалғанға дейін', 'dd.h2': 'Істі шешімге дейін емес, ақшаға дейін жүргіземін',
      'dd.lead': 'Сот шешімі - қағаз. Атқару парағы мен шоттағы ақша - нәтиже.',
      'p.kicker': 'Іс қалай жүреді', 'p.h2': 'Қоңыраудан ақшаға дейін төрт қадам',
      'p.s1t': 'Қоңырау', 'p.s1': 'Қысқаша: не болды және сома қандай.',
      'p.s2t': 'Құжаттармен жарты сағат', 'p.s2': 'Істің перспективасы бар ма - тікелей жауап.',
      'p.s3t': 'Баға мен жоспар', 'p.s3': 'Жұмыс құны бекітіліп, талап арызға енгізіледі.',
      'p.s4t': 'Шешім және орындау', 'p.s4': 'Сот, апелляция, атқару парағы, ақша.',
      'rs.kicker': 'Кім төлейді', 'rs.h2': 'Менің жұмысымды ұтылған тарап төлейді',
      'rs.debt': 'Қарыз', 'rs.fee': 'Менің жұмысым', 'rs.total': 'Талап арызда',
      'rs.cap': 'Мысал: қарыз сомасының 7 пайызы. Тек жеңісін көріп тұрған істерді ғана аламын.',
      'k.kicker': 'Не әкелу керек', 'k.h2': 'Құжаттармен жарты сағат - және тікелей жауап',
      'k.lead': 'Шарт, актілер, төлем құжаттары, хат алмасу. ЖКО бойынша - хаттама, қаулы, полис.',
      'f.kicker': 'Сұрақтар', 'f.h2': 'Қоңырауға дейін не сұрайды',
      'f.q1': 'Менің ісімнің мүмкіндігі бар ма?', 'f.a1': 'Құжаттармен жарты сағаттан кейін айтамын. Жеңісін көрмесем - іске кіріспеймін.',
      'f.q2': 'Жұмысыңыз қанша тұрады?', 'f.a2': 'Бекітілген сома, талап бағасының шамамен 7 пайызы. Ол талап арызға енгізіліп, ұтылған тараптан өндіріледі.',
      'f.q3': 'Ақшаны қашан аламын?', 'f.a3': 'Шешімнен кейін орындау жүреді: атқару парағы және өндіріп алу. Істі осы кезеңді қоса жүргіземін.',
      'f.q4': '10 млн теңгеден төмен істерді аласыз ба?', 'f.a4': 'Жоқ. Шек әр істі жеке және соңына дейін жүргізу үшін қажет.',
      'z.kicker': 'Өтінім', 'z.h2': 'Не болғанын жазыңыз',
      'z.lead': 'Жеке жауап беремін. Құжаттармен жарты сағат - және істің перспективасы бар-жоғын білесіз.',
      'z.name': 'Аты', 'z.name.ph': 'Сізге қалай жүгінуге болады', 'z.phone': 'Телефон',
      'z.msg': 'Не болды және сома қандай', 'z.msg.ph': 'Мысалы: тапсырыс беруші шарт бойынша төлемейді, 24 млн ₸',
      'z.send': 'WhatsApp арқылы жіберу', 'z.err': 'Атыңыз бен телефоныңызды толтырыңыз.',
      'z.ok': 'Рақмет. Хабарламаңыз бар WhatsApp ашылды - оны жіберіңіз.',
      'z.addr': 'Астана · қабылдау келісім бойынша',
      'foot.l1': 'Адвокат Ерлан Т. · Астана · 2001 жылдан бері практика',
      'foot.l2': 'Сомалар мен нәтижелер - сот актілерінен. Іске қатысушылардың деректері ашылмайды.',
      'wa.hello': 'Сәлеметсіз бе, Ерлан. Менің атым {name}, телефон {phone}.', 'wa.msg': 'Не болды: {msg}'
    }
  };

  var lang = 'ru';
  var t = function (k) { return (I18N[lang] && I18N[lang][k]) || I18N.ru[k] || ''; };

  function applyLang(l, persist) {
    lang = I18N[l] ? l : 'ru';
    root.setAttribute('lang', lang === 'kk' ? 'kk' : 'ru');
    doc.title = t('title');
    var md = doc.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', t('desc'));
    doc.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n'); if (I18N[lang][k] !== undefined) el.textContent = t(k);
    });
    doc.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    doc.querySelectorAll('[data-mq]').forEach(function (ul) {
      ul.innerHTML = t('mq').map(function (s) { return '<li>' + s + '</li>'; }).join('');
    });
    doc.querySelectorAll('.lang button').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (persist) { try { localStorage.setItem('lang', lang); } catch (e) {} }
    fitAll();
  }

  /* язык: ?lang= в адресе главнее сохранённого выбора */
  (function initLang() {
    var q = new URLSearchParams(location.search).get('lang'), saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) {}
    applyLang(q || saved || 'ru', !!q);
  })();
  doc.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang'), true); });
  });

  /* ───────── fitText: заголовок в одну строку ───────── */
  function fit(el) {
    el.style.fontSize = '';
    var base = parseFloat(getComputedStyle(el).fontSize), size = base, guard = 0;
    while (el.scrollWidth > el.clientWidth + 1 && guard++ < 24) { size *= .95; el.style.fontSize = size + 'px'; }
  }
  function fitAll() { doc.querySelectorAll('.fit,.case-sum').forEach(fit); }

  /* ───────── плиты ───────── */
  var pws = Array.prototype.slice.call(doc.querySelectorAll('.pw'));
  var hero = doc.getElementById('hero');
  var ticking = false;

  function update() {
    ticking = false;
    var H = window.innerHeight;
    var enters = pws.map(function (pw, i) {
      var r = pw.getBoundingClientRect();
      var enter = i === 0 ? 1 : clamp(1 - r.top / H);
      var stay = r.height > H + 1 ? clamp(-r.top / (r.height - H)) : 0;
      pw.style.setProperty('--enter', enter.toFixed(4));
      pw.style.setProperty('--stay', stay.toFixed(4));
      var txt = pw.querySelector('.txt');
      if (txt && enter > .72 && !txt.classList.contains('on')) txt.classList.add('on');
      return enter;
    });
    pws.forEach(function (pw, i) {
      var next = pw.nextElementSibling, exit = 0;
      if (next && next.classList.contains('pw')) exit = enters[i + 1];
      pw.style.setProperty('--exit', exit.toFixed(4));
      pw.classList.toggle('gone', exit >= 1);
    });
    hdr.classList.toggle('solid', window.scrollY > 40);
    barUpdate();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { fitAll(); update(); });

  /* интро героя: лампа включается */
  function runIntro() {
    var skip = reduce || location.hash || window.scrollY > 80;
    if (skip) { hero.style.setProperty('--intro', '1'); hero.querySelector('.txt').classList.add('on'); update(); return; }
    var t0 = performance.now(), D = 1250;
    hero.querySelector('.txt').classList.add('on');
    (function frame(now) {
      var p = clamp((now - t0) / D), e = 1 - Math.pow(1 - p, 3);
      hero.style.setProperty('--intro', e.toFixed(4));
      if (p < 1) requestAnimationFrame(frame);
    })(t0);
    update();
  }

  /* ───────── счётчики и зажигание ───────── */
  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function countUp(el) {
    var target = +el.getAttribute('data-n'), D = 1700 + Math.min(900, target / 4e6), t0 = performance.now();
    if (reduce) { el.textContent = fmt(target); return; }
    (function frame(now) {
      var p = clamp((now - t0) / D), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(frame); else el.textContent = fmt(target);
    })(t0);
  }
  var seen = new WeakSet();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      if (el.classList.contains('num')) { if (!seen.has(el)) { seen.add(el); countUp(el); } io.unobserve(el); }
      else { el.classList.add('lit'); io.unobserve(el); }
    });
  }, { threshold: .35 });
  doc.querySelectorAll('.num').forEach(function (el) { el.textContent = fmt(+el.getAttribute('data-n')); io.observe(el); });
  doc.querySelectorAll('.case,.card').forEach(function (el) { io.observe(el); });

  /* ───────── шапка, меню, панель ───────── */
  var hdr = doc.getElementById('hdr'), burger = doc.getElementById('burger'), menu = doc.getElementById('menu');
  var bar = doc.getElementById('bar'), contact = doc.getElementById('zayavka');
  function openMenu(on) {
    if (on) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add('show'); }); }
    else { menu.classList.remove('show'); setTimeout(function () { menu.hidden = true; }, 300); }
    doc.body.classList.toggle('menu-open', on);
    burger.setAttribute('aria-expanded', on ? 'true' : 'false');
    doc.body.style.overflow = on ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { openMenu(!doc.body.classList.contains('menu-open')); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && doc.body.classList.contains('menu-open')) openMenu(false); });

  function barUpdate() {
    if (!bar) return;
    var r = contact.getBoundingClientRect();
    var show = window.scrollY > window.innerHeight * .55 && r.top > window.innerHeight * .6;
    bar.classList.toggle('show', show);
    bar.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  /* ───────── якоря ───────── */
  function goTo(id, push) {
    var el = doc.getElementById(id); if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - (el.classList.contains('pw') ? 0 : 68);
    window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    if (push) history.pushState(null, '', '#' + id);
    if (el.classList.contains('card')) { el.classList.add('flash'); setTimeout(function () { el.classList.remove('flash'); }, 2600); }
  }
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-nav]'); if (!a) return;
    var id = a.getAttribute('href').slice(1);
    e.preventDefault();
    if (doc.body.classList.contains('menu-open')) openMenu(false);
    goTo(id, true);
  });
  window.addEventListener('hashchange', function () { if (location.hash) goTo(location.hash.slice(1), false); });
  /* делегированные клики по tel / WhatsApp - сюда Opus повесит конверсии gtag */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-track]'); if (!a) return;
    doc.dispatchEvent(new CustomEvent('lead', { detail: { type: a.getAttribute('data-track'), href: a.href } }));
  });

  /* ───────── форма -> WhatsApp ───────── */
  var form = doc.getElementById('form'), ferr = doc.getElementById('ferr'), fok = doc.getElementById('fok');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.company.value) return;
    var name = form.name.value.trim(), phone = form.phone.value.trim(), msg = form.msg.value.trim();
    if (!name || phone.replace(/\D/g, '').length < 10) { ferr.hidden = false; fok.hidden = true; return; }
    ferr.hidden = true;
    var text = t('wa.hello').replace('{name}', name).replace('{phone}', phone) + (msg ? '\n' + t('wa.msg').replace('{msg}', msg) : '');
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    fok.hidden = false;
    doc.dispatchEvent(new CustomEvent('lead', { detail: { type: 'form' } }));
  });

  /* ───────── старт ───────── */
  fitAll();
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fitAll);
  runIntro();
  if (location.hash) {
    var id = location.hash.slice(1);
    setTimeout(function () { goTo(id, false); update(); }, 60);
  }
})();

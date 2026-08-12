"use client";

import { useEffect, useMemo, useState } from "react";

type Tab = "home" | "learn" | "rating" | "profile";
type QuizState = "idle" | "question" | "result";

type Question = { question: string; eyebrow: string; options: string[]; answer: number; fact: string };
type Topic = { id: string; title: string; description: string; icon: string; tone: string; lessons: number; progress: number; xp: number; locked?: boolean };

const topics: Topic[] = [
  { id: "market", title: "Рынок недвижимости", description: "Спрос, предложение и ключевые показатели", icon: "⌁", tone: "lime", lessons: 5, progress: 40, xp: 120 },
  { id: "projects", title: "Жилые комплексы", description: "Классы жилья, локации и преимущества", icon: "▥", tone: "blue", lessons: 6, progress: 17, xp: 150 },
  { id: "sales", title: "Технологии продаж", description: "Диалог с клиентом и работа с возражениями", icon: "◎", tone: "orange", lessons: 4, progress: 0, xp: 110 },
  { id: "mortgage", title: "Ипотека", description: "Программы, ставки и расчёты", icon: "%", tone: "violet", lessons: 4, progress: 0, xp: 100 },
  { id: "legal", title: "Юридические вопросы", description: "Договоры, регистрация и безопасность сделки", icon: "§", tone: "pink", lessons: 5, progress: 0, xp: 140, locked: true },
];

const questions: Question[] = [
  { eyebrow: "Основы рынка", question: "Какой показатель лучше всего отражает скорость продажи квартир в жилом комплексе?", options: ["Средняя площадь квартиры", "Темп продаж", "Количество этажей", "Высота потолков"], answer: 1, fact: "Темп продаж показывает, сколько лотов реализуется за выбранный период — обычно за месяц." },
  { eyebrow: "Классы жилья", question: "Что чаще всего отличает бизнес-класс от комфорт-класса?", options: ["Только цена", "Цвет фасада", "Локация и уровень сервиса", "Число комнат"], answer: 2, fact: "Класс проекта определяется совокупностью параметров: локацией, архитектурой, инженерией, благоустройством и сервисом." },
  { eyebrow: "Работа с клиентом", question: "С чего лучше начать презентацию жилого комплекса?", options: ["С полного списка характеристик", "С потребности клиента", "С планировок", "С ипотечного расчёта"], answer: 1, fact: "Сначала свяжите преимущества проекта с задачей клиента — так презентация будет персональной и убедительной." },
  { eyebrow: "Ипотека", question: "Что означает первоначальный взнос по ипотеке?", options: ["Ежемесячный платёж", "Комиссия банка", "Часть стоимости из собственных средств", "Страховой платёж"], answer: 2, fact: "Первоначальный взнос — часть стоимости недвижимости, которую покупатель оплачивает собственными средствами." },
  { eyebrow: "Сделка", question: "Какой документ подтверждает зарегистрированное право собственности?", options: ["Буклет проекта", "Выписка из ЕГРН", "Акт осмотра", "Ипотечный расчёт"], answer: 1, fact: "Выписка из ЕГРН содержит актуальные сведения об объекте, правообладателе и зарегистрированных обременениях." },
];

const leaders = [
  { name: "Мария К.", xp: 3240, avatar: "МК", color: "#efe6ff" },
  { name: "Александр В.", xp: 2980, avatar: "АВ", color: "#dff4ff" },
  { name: "Елена С.", xp: 2760, avatar: "ЕС", color: "#ffe8da" },
  { name: "Вы", xp: 1840, avatar: "ВЫ", color: "#e7f36a", me: true },
  { name: "Игорь Н.", xp: 1720, avatar: "ИН", color: "#ffebf3" },
];

function Chevron() { return <span className="chevron">›</span> }

function ProgressRing({ value }: { value: number }) {
  return <div className="progress-ring" style={{ "--progress": `${value * 3.6}deg` } as React.CSSProperties}><div><strong>{value}%</strong><span>пройдено</span></div></div>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(1840);
  const [streak] = useState(7);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const telegram = (window as typeof window & { Telegram?: { WebApp?: { ready: () => void; expand: () => void; initDataUnsafe?: { user?: { first_name?: string } } } } }).Telegram?.WebApp;
    telegram?.ready();
    telegram?.expand();
    setFirstName(telegram?.initDataUnsafe?.user?.first_name ?? "");
    const savedXp = Number(localStorage.getItem("realty-academy-xp"));
    if (savedXp) setXp(savedXp);
  }, []);

  const level = Math.floor(xp / 500) + 1;
  const levelProgress = ((xp % 500) / 500) * 100;
  const currentQuestion = questions[questionIndex];
  const answered = selected !== null;
  const isCorrect = selected === currentQuestion?.answer;
  const greeting = useMemo(() => { const hour = new Date().getHours(); return hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер" }, []);

  function startQuiz() { setQuestionIndex(0); setSelected(null); setCorrect(0); setQuizState("question") }
  function selectAnswer(index: number) { if (answered) return; setSelected(index); if (index === currentQuestion.answer) setCorrect((value) => value + 1) }
  function nextQuestion() {
    if (questionIndex < questions.length - 1) { setQuestionIndex((value) => value + 1); setSelected(null); return }
    const earned = correct * 20 + (isCorrect ? 20 : 0);
    const nextXp = xp + earned;
    setXp(nextXp); localStorage.setItem("realty-academy-xp", String(nextXp)); setQuizState("result");
  }
  function closeQuiz() { setQuizState("idle"); setTab("home") }

  if (quizState === "question") {
    return <main className="app-shell quiz-shell"><section className="quiz-screen">
      <header className="quiz-header"><button className="icon-button" onClick={closeQuiz} aria-label="Закрыть квиз">×</button><div className="quiz-progress"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div><span className="quiz-counter">{questionIndex + 1}/{questions.length}</span></header>
      <div className="quiz-content">
        <div className="lesson-badge"><span>⌁</span>{currentQuestion.eyebrow}</div><p className="quiz-kicker">Выберите один вариант</p><h1>{currentQuestion.question}</h1>
        <div className="answer-list">{currentQuestion.options.map((option, index) => {
          const status = answered ? index === currentQuestion.answer ? "correct" : index === selected ? "wrong" : "muted" : "";
          return <button className={`answer ${status}`} key={option} onClick={() => selectAnswer(index)}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{status === "correct" && <span className="answer-mark">✓</span>}{status === "wrong" && <span className="answer-mark">×</span>}</button>;
        })}</div>
      </div>
      <div className={`feedback-panel ${answered ? (isCorrect ? "success" : "error") : ""}`}>
        {answered && <div className="feedback-copy"><span className="feedback-icon">{isCorrect ? "✓" : "!"}</span><div><strong>{isCorrect ? "Верно! +20 XP" : "Почти получилось"}</strong><p>{currentQuestion.fact}</p></div></div>}
        <button className="primary-button" disabled={!answered} onClick={nextQuestion}>{questionIndex === questions.length - 1 ? "Завершить" : "Продолжить"}</button>
      </div>
    </section></main>;
  }

  if (quizState === "result") {
    const earnedXp = correct * 20;
    return <main className="app-shell result-shell"><section className="result-screen"><div className="result-rays" /><div className="trophy">★</div><p className="result-kicker">Урок завершён</p><h1>Отличная работа!</h1><p className="result-subtitle">Вы укрепили знания о рынке недвижимости и стали ближе к новому уровню.</p>
      <div className="result-stats"><div><span>⚡</span><strong>+{earnedXp}</strong><small>XP заработано</small></div><div><span>◎</span><strong>{correct}/{questions.length}</strong><small>Верных ответов</small></div><div><span>🔥</span><strong>{streak}</strong><small>Дней подряд</small></div></div>
      <div className="level-card"><div><span>Уровень {level}</span><strong>{xp % 500} / 500 XP</strong></div><div className="level-track"><span style={{ width: `${levelProgress}%` }} /></div></div><button className="primary-button" onClick={closeQuiz}>На главную</button><button className="text-button" onClick={startQuiz}>Пройти ещё раз</button>
    </section></main>;
  }

  return <main className="app-shell"><div className="desktop-backdrop" aria-hidden="true"><span>REALTY</span><span>ACADEMY</span></div><section className="phone-frame"><div className="page-scroll">
    {tab === "home" && <div className="page home-page"><header className="topbar"><div className="brand-mark">R</div><div className="top-stats"><div className="stat-pill"><span>🔥</span><strong>{streak}</strong></div><div className="stat-pill"><span>⚡</span><strong>{xp}</strong></div><button className="avatar" onClick={() => setTab("profile")} aria-label="Открыть профиль">Н</button></div></header>
      <section className="welcome"><p>{greeting}{firstName ? `, ${firstName}` : ""}</p><h1>Готовы узнать<br />что-то новое?</h1></section>
      <button className="continue-card" onClick={startQuiz}><div className="continue-top"><span className="continue-label">Продолжить обучение</span><span className="xp-chip">+100 XP</span></div><div className="continue-body"><div><span className="module-number">Модуль 1 · Урок 3</span><h2>Как устроен рынок<br />недвижимости</h2><span className="start-link">Продолжить <Chevron /></span></div><ProgressRing value={40} /></div></button>
      <section className="daily-card"><div className="daily-icon">⚡</div><div className="daily-copy"><div><strong>Дневная цель</strong><span>30 из 50 XP</span></div><div className="daily-track"><span /></div></div><span className="daily-percent">60%</span></section>
      <div className="section-heading"><div><span>Каталог знаний</span><h2>Выберите тему</h2></div><button onClick={() => setTab("learn")}>Все темы</button></div><div className="topic-stack">{topics.slice(0, 3).map((topic) => <TopicCard key={topic.id} topic={topic} onClick={topic.locked ? undefined : startQuiz} />)}</div>
      <section className="streak-card"><div className="streak-heading"><div><span className="fire-orb">🔥</span><div><strong>Серия: {streak} дней</strong><p>Не останавливайтесь!</p></div></div><span>Лучшее: 12</span></div><div className="week-row">{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, index) => <div key={day}><span>{index < 6 ? "✓" : "•"}</span><small>{day}</small></div>)}</div></section>
    </div>}
    {tab === "learn" && <div className="page catalog-page"><div className="inner-header"><div><span>База знаний</span><h1>Обучение</h1></div><div className="level-badge">Ур. {level}</div></div><p className="page-intro">Проходите короткие уроки, закрепляйте знания и открывайте новые темы.</p><div className="catalog-progress"><div><span>Общий прогресс</span><strong>8 из 24 уроков</strong></div><div className="level-track"><span style={{ width: "33%" }} /></div></div><div className="filter-row"><button className="active">Все</button><button>В процессе</button><button>Новые</button></div><div className="topic-stack full">{topics.map((topic) => <TopicCard key={topic.id} topic={topic} onClick={topic.locked ? undefined : startQuiz} />)}</div></div>}
    {tab === "rating" && <div className="page rating-page"><div className="inner-header"><div><span>Эта неделя</span><h1>Рейтинг</h1></div><div className="league-icon">♛</div></div><p className="page-intro">Зарабатывайте XP и поднимайтесь выше среди коллег.</p><section className="podium"><div className="podium-person second"><div className="podium-avatar">АВ</div><strong>Александр</strong><span>2 980 XP</span><div>2</div></div><div className="podium-person first"><span className="crown">♛</span><div className="podium-avatar">МК</div><strong>Мария</strong><span>3 240 XP</span><div>1</div></div><div className="podium-person third"><div className="podium-avatar">ЕС</div><strong>Елена</strong><span>2 760 XP</span><div>3</div></div></section><div className="league-note"><span>↑</span><div><strong>До топ-3 — 920 XP</strong><p>Ещё немного — и вы в тройке лидеров</p></div></div><div className="leader-list">{leaders.map((person, index) => <div className={`leader-row ${person.me ? "me" : ""}`} key={person.name}><span className="rank">{index + 1}</span><span className="leader-avatar" style={{ background: person.color }}>{person.avatar}</span><strong>{person.name}{person.me && <small>Это вы</small>}</strong><span>{person.xp.toLocaleString("ru-RU")} XP</span></div>)}</div></div>}
    {tab === "profile" && <div className="page profile-page"><div className="profile-head"><div className="profile-avatar">Н</div><h1>{firstName || "Наталья"}</h1><p>Специалист по недвижимости</p><span>Уровень {level}</span></div><div className="profile-stats"><div><strong>{xp}</strong><span>Всего XP</span></div><div><strong>{streak}</strong><span>Дней подряд</span></div><div><strong>8</strong><span>Уроков</span></div></div><div className="level-card profile-level"><div><span>До уровня {level + 1}</span><strong>{500 - (xp % 500)} XP</strong></div><div className="level-track"><span style={{ width: `${levelProgress}%` }} /></div></div><div className="section-heading"><div><span>Коллекция</span><h2>Достижения</h2></div><button>3 из 8</button></div><div className="achievement-grid"><div className="achievement"><span>⚡</span><strong>Быстрый старт</strong><small>Первый урок</small></div><div className="achievement"><span>🔥</span><strong>В ударе</strong><small>7 дней подряд</small></div><div className="achievement"><span>◎</span><strong>Без ошибок</strong><small>Идеальный квиз</small></div><div className="achievement locked"><span>♛</span><strong>Эксперт</strong><small>Достигните 10 ур.</small></div></div><div className="settings-list"><button><span>◉</span><strong>Мой прогресс</strong><Chevron /></button><button><span>♧</span><strong>Уведомления</strong><Chevron /></button><button><span>?</span><strong>Помощь</strong><Chevron /></button></div></div>}
  </div><nav className="bottom-nav" aria-label="Основная навигация"><NavButton active={tab === "home"} icon="⌂" label="Главная" onClick={() => setTab("home")} /><NavButton active={tab === "learn"} icon="▤" label="Обучение" onClick={() => setTab("learn")} /><NavButton active={tab === "rating"} icon="♛" label="Рейтинг" onClick={() => setTab("rating")} /><NavButton active={tab === "profile"} icon="◉" label="Профиль" onClick={() => setTab("profile")} /></nav></section></main>;
}

function TopicCard({ topic, onClick }: { topic: Topic; onClick?: () => void }) {
  return <button className={`topic-card ${topic.locked ? "locked" : ""}`} onClick={onClick} disabled={topic.locked}><span className={`topic-icon ${topic.tone}`}>{topic.locked ? "⌑" : topic.icon}</span><div className="topic-copy"><h3>{topic.title}</h3><p>{topic.description}</p><div><span>{topic.lessons} уроков</span><i>•</i><strong>до {topic.xp} XP</strong></div></div>{topic.locked ? <span className="lock">Откроется<br />на 6 уровне</span> : <div className="topic-progress"><span>{topic.progress}%</span><Chevron /></div>}</button>;
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: string; label: string; onClick: () => void }) {
  return <button className={active ? "active" : ""} onClick={onClick}><span>{icon}</span><small>{label}</small></button>;
}

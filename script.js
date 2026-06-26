script.js:
// ============ STATE ============
const state = {
  currentPage: 'home',
  chatStep: 0,
  chatAnswers: [],
  milestones: [true, false, false, false, false, false],
  theme: 'dark',
  resultData: null
};

// ============ DATA ============
const chatScript = [
  { from: 'ai', text: "Hey! I'm Alex, your entrepreneurial readiness coach. I'm going to ask you some questions to help identify what's holding you back — not to judge you, but to understand you. There are no wrong answers. Ready?", options: ["Let's go!", "I'm nervous but ready", "Yes, let's do this"] },
  { from: 'ai', text: "Great! First — what's the business idea you've been sitting on? It can be rough or vague. What's the thing you keep coming back to?", type: 'free' },
  { from: 'ai', text: "Interesting. What's the main thing stopping you from starting right now? Be honest — even if it sounds simple.", options: ["I'm afraid it won't work", "I don't feel ready yet", "I don't know where to begin", "I'm afraid of what people will think"] },
  { from: 'ai', text: "Have you tried taking any steps toward this idea before? Even small ones?", options: ["Yes, but I stopped", "I've thought about it a lot but done nothing", "No, not really", "I've tried multiple times"] },
  { from: 'ai', text: "What concerns you most when you imagine actually starting?", options: ["Failing publicly", "People judging or laughing", "Wasting time and money", "Not being good enough"] },
  { from: 'ai', text: "What's the worst outcome you can imagine if this business fails?", type: 'free' },
  { from: 'ai', text: "If someone rejected your idea right now — like a friend said 'that won't work' — how would that land for you?", options: ["It would devastate me", "I'd question everything", "I'd be upset but continue", "I'd take it as data and keep going"] },
  { from: 'ai', text: "What's the one step you've been postponing most? The step that keeps appearing on your mental to-do list?", type: 'free' },
  { from: 'ai', text: "Last question: On a scale of 1-10, how confident are you right now that you can actually build this business?", options: ["1-3 (Very low)", "4-5 (Low)", "6-7 (Medium)", "8-10 (High)"] },
  { from: 'ai', text: "Thank you for being so open. I have everything I need to analyze your profile. Give me a moment while I build your personalized report...", type: 'analyze' }
];

const barrierData = {
  failure: {
    name: 'Fear of Failure',
    confidence: 38,
    secondary: 'Decision Paralysis',
    explanation: 'You have a strong tendency to avoid starting because the potential downside feels more real and immediate than the potential upside. This is the #1 barrier among aspiring entrepreneurs and is entirely workable.',
    risk: '⚠️ Risk Level: Medium-High',
    riskClass: 'risk-high',
    actions: {
      today: { title: 'Write a one-sentence value proposition', desc: 'Complete this sentence: "I help [who] do [what] so they can [outcome]." Don\'t edit it. Just write it in a notes app and send it to one trusted person.' },
      threeDay: { title: 'Share your idea with three specific people', desc: 'Tell three people you know about your idea. You\'re not asking for feedback — you\'re creating external accountability. Say: "I\'m working on something and wanted you to know."' },
      sevenDay: { title: 'Have one real customer conversation', desc: 'Find one person who would be your ideal customer. Ask them 3 questions about the problem your business solves. You\'re not selling — you\'re learning.' }
    },
    entrepreneurs: ['Jack Ma','Sara Blakely','Steve Jobs','James Dyson','Arianna Huffington'],
    category: 'failure',
    toolkit: ['Cognitive Reframing','Worst-Case Analysis','Exposure Ladder']
  },
  perfectionism: {
    name: 'Perfectionism',
    confidence: 45,
    secondary: 'Fear of Judgment',
    explanation: 'You delay action because your internal standard is impossible to meet at the start. You keep improving, refining, and planning — and the idea never ships. The good news: perfectionism is channeled intelligence.',
    risk: '⚡ Risk Level: Medium',
    riskClass: 'risk-medium',
    actions: {
      today: { title: 'Set a 2-hour "done is better than perfect" timer', desc: 'Pick one concrete deliverable — a one-page summary, a landing page mockup, a pricing table — and commit to shipping it in 2 hours. No editing after the timer.' },
      threeDay: { title: 'Share something unfinished on purpose', desc: 'Post or send something about your idea before you feel it\'s ready. Practice tolerating the discomfort of imperfection being visible to others.' },
      sevenDay: { title: 'Launch a waitlist or interest page', desc: 'Create the most basic version of a landing page and share the link. Collect 5 email addresses. This is your MVP shipped into the world.' }
    },
    entrepreneurs: ['Reid Hoffman','Jeff Bezos','Mark Zuckerberg','Sheryl Sandberg','Kevin Systrom'],
    category: 'perfectionism',
    toolkit: ['MVP Mindset','80/20 Rule','Ship Before Ready']
  },
  imposter: {
    name: 'Imposter Syndrome',
    confidence: 42,
    secondary: 'Fear of Judgment',
    explanation: 'You believe you\'re not qualified, experienced, or skilled enough to be taken seriously as an entrepreneur. Yet the evidence says otherwise — and so does the track record of almost every successful founder.',
    risk: '🔵 Risk Level: Medium',
    riskClass: 'risk-medium',
    actions: {
      today: { title: 'Build your Evidence Log', desc: 'Write 10 things you\'ve done that required courage, skill, or resourcefulness. Not just business things — anything. This is the foundation for rewriting your self-story.' },
      threeDay: { title: 'Interview one person you consider more successful', desc: 'Ask them how they got started. Listen for all the uncertainty, doubt, and learning-as-you-go. Imposter syndrome assumes others had a secret you don\'t.' },
      sevenDay: { title: 'Do one thing publicly as a founder', desc: 'Post on LinkedIn, tweet, or join a community as "someone building [your idea]." Claim the identity before you feel you deserve it.' }
    },
    entrepreneurs: ['Oprah Winfrey','Howard Schultz','Richard Branson','Melanie Perkins','Whitney Wolfe Herd'],
    category: 'imposter',
    toolkit: ['Evidence Log','Competency Mapping','Success Reflection']
  }
};

const entrepreneurDB = {
  'Jack Ma': { emoji:'👨‍💼', company:'Alibaba', obstacle:'Rejected by Harvard 10 times, failed KFC hiring, first internet company failed', happened:'Built Alibaba from his apartment with $60,000', overcame:'Focused obsessively on the customer, not critics', lesson:'Rejection is redirection. Every "no" was data, not destiny.' },
  'Sara Blakely': { emoji:'👗', company:'Spanx', obstacle:'Door-to-door sales rejection daily for 7 years, no fashion industry experience', happened:'Built Spanx into a billion-dollar brand from $5,000 savings', overcame:'Her father celebrated failures at dinner — this rewired her fear response', lesson:'Failure is not the opposite of success. It is practice.' },
  'Steve Jobs': { emoji:'💻', company:'Apple', obstacle:'Fired from his own company at 32', happened:'Founded Pixar, NeXT, then returned to save Apple', overcame:'Realized the firing was the best thing — freed him to create without constraint', lesson:'Getting fired can be the start of your best chapter.' },
  'James Dyson': { emoji:'🌀', company:'Dyson', obstacle:'5,126 failed prototypes over 15 years before success', happened:'Created a vacuum cleaner that became a $14B company', overcame:'Reframed each failure as eliminating what doesn\'t work', lesson:'Failure is just data. Success is running out of ways to fail.' },
  'Arianna Huffington': { emoji:'📰', company:'HuffPost', obstacle:'Second book rejected by 36 publishers', happened:'Co-founded The Huffington Post, sold for $315M', overcame:'Learned to separate her self-worth from others\' validation', lesson:'The number 36 means nothing except persistence.' },
  'Brian Chesky': { emoji:'🏠', company:'Airbnb', obstacle:'Investors repeatedly said "nobody will rent their home to strangers"', happened:'Airbnb became a $75B company transforming travel', overcame:'Listened to users instead of investors, kept iterating', lesson:'The people saying it won\'t work aren\'t your customer.' },
  'Walt Disney': { emoji:'🏰', company:'Disney', obstacle:'Fired from newspaper for "lacking imagination," first company went bankrupt', happened:'Built the most recognized entertainment company in history', overcame:'Each failure taught him what not to do — he kept the lessons, dropped the fear', lesson:'You can design, create, and build the most wonderful place on earth — if you start.' },
  'Colonel Sanders': { emoji:'🍗', company:'KFC', obstacle:'KFC recipe rejected 1,009 times before first yes at age 62', happened:'Built KFC into a global franchise', overcame:'Never interpreted rejection as evidence the idea was wrong', lesson:'1,009 people were wrong. One person was right. That\'s all you need.' },
  'Reed Hastings': { emoji:'📺', company:'Netflix', obstacle:'$40 late fee on Apollo 13, idea dismissed as impossible by Blockbuster', happened:'Netflix disrupted entire entertainment industry', overcame:'Turned frustration into a problem worth solving', lesson:'Your most annoying experience is often your best business idea.' },
  'Henry Ford': { emoji:'🚗', company:'Ford Motors', obstacle:'Two failed auto companies before Ford, told people didn\'t want cars', happened:'Revolutionized transportation and manufacturing', overcame:'Convinced himself that if he built it well enough, demand would follow', lesson:'Whether you think you can or think you can\'t — you\'re right.' },
  'Reid Hoffman': { emoji:'💼', company:'LinkedIn', obstacle:'Launched LinkedIn when "nobody would put their resume online"', happened:'LinkedIn reached 900M+ members, sold to Microsoft for $26B', overcame:'Shipped knowing it was imperfect and fixed in public', lesson:'"If you\'re not embarrassed by the first version of your product, you\'ve launched too late."' },
  'Jeff Bezos': { emoji:'📦', company:'Amazon', obstacle:'Wall Street laughed at the idea of an online bookstore', happened:'Built Amazon into the world\'s largest company by market cap', overcame:'Focused on the 10-year vision, not the 10-month critics', lesson:'The people betting against you are living in the present. Build for the future.' },
  'Mark Zuckerberg': { emoji:'📘', company:'Meta', obstacle:'Built and launched Facebook before it was "ready" from a dorm room', happened:'Grew it to 3.3B monthly users', overcame:'Iterated in public, fixed publicly, never waited for permission to launch', lesson:'"Done is better than perfect." He printed this on Facebook office walls.' },
  'Sheryl Sandberg': { emoji:'🌟', company:'Meta/Lean In', obstacle:'Told she was "too ambitious" and would never survive corporate culture', happened:'Became COO of Facebook and global leadership icon', overcame:'Decided that being too ambitious is the only acceptable version of ambition', lesson:'Lean in. Not away.' },
  'Kevin Systrom': { emoji:'📸', company:'Instagram', obstacle:'First app (Burbn) failed completely, only one feature worked', happened:'Pivoted to just the photo feature — became Instagram, sold for $1B', overcame:'Shipped before it was complete and watched what users actually used', lesson:'Your MVP will tell you what your product actually is.' },
  'Oprah Winfrey': { emoji:'🎙️', company:'OWN Network', obstacle:'Fired from her first TV job, told she was "unfit for television"', happened:'Built the most successful daytime talk show in history', overcame:'Treated every setback as redirection toward her true calling', lesson:'If you\'re not doing what you love, you\'re wasting your time.' },
  'Howard Schultz': { emoji:'☕', company:'Starbucks', obstacle:'217 investors rejected his idea of bringing Italian coffee culture to America', happened:'Built Starbucks into 35,000+ locations globally', overcame:'Investor 218 said yes. He needed only one.', lesson:'It only takes one yes. But you have to keep asking.' },
  'Richard Branson': { emoji:'🎸', company:'Virgin Group', obstacle:'School teachers told him he\'d "never amount to anything"', happened:'Built 400+ companies across every industry', overcame:'Took dyslexia and rejection as evidence he needed to do things differently', lesson:'You don\'t learn to walk by following rules. You learn by doing and falling over.' },
  'Melanie Perkins': { emoji:'🎨', company:'Canva', obstacle:'Rejected by 100 investors, told the idea was "too ambitious"', happened:'Built Canva into a $26B design platform', overcame:'Found one investor who understood the vision; that was enough to start', lesson:'Investor 101 said yes. The first 100 "no"s were free research.' },
  'Whitney Wolfe Herd': { emoji:'💛', company:'Bumble', obstacle:'Left Tinder after harassment, told a woman couldn\'t run a dating app', happened:'Built Bumble into a $8B company, youngest female CEO to IPO', overcame:'Used the criticism as the product insight — women should message first', lesson:'The problem you face might be exactly the product the market needs.' }
};

const toolkitData = {
  'Cognitive Reframing': { icon:'🔄', desc:'Systematically replace fear-based thinking with evidence-based alternatives. Ask: "Is this thought a fact or an assumption?"', tag:'CBT-Based' },
  'Worst-Case Analysis': { icon:'📉', desc:'Write out the worst realistic outcome. Rate its probability. Realize: you can survive and recover from almost anything you fear.', tag:'Stoicism' },
  'Exposure Ladder': { icon:'🪜', desc:'Create a hierarchy of feared actions from easiest to hardest. Do the first one this week. Your brain updates its threat model with each successful step.', tag:'Behavioral' },
  'MVP Mindset': { icon:'🚀', desc:'Define the smallest possible version that delivers core value. Ship that. Everything else is a feature. Perfection is shipped, not polished.', tag:'Lean Startup' },
  '80/20 Rule': { icon:'📊', desc:'Identify the 20% of actions that create 80% of results. Focus only there. The remaining 80% is usually perfectionism masquerading as productivity.', tag:'Pareto' },
  'Ship Before Ready': { icon:'📦', desc:'Set a hard deadline. On that date, send/share/post what you have. Treat incompleteness as a feature: it invites collaboration and feedback.', tag:'Agile' },
  'Evidence Log': { icon:'📋', desc:'Write 10 things you\'ve done that required skill, courage, or resourcefulness — not just professional things. Read this when imposter syndrome hits.', tag:'ACT' },
  'Competency Mapping': { icon:'🗺️', desc:'List every relevant skill you have, every problem you\'ve solved, every learning curve you\'ve successfully climbed. Your competence is larger than your self-image.', tag:'Coaching' },
  'Success Reflection': { icon:'✨', desc:'Recall a time you doubted yourself but succeeded anyway. Feel it fully. Neurologically, this creates a reference point your brain can access when fear spikes.', tag:'NLP' }
};

// ============ NAVIGATION ============
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  state.currentPage = page;
  window.scrollTo(0, 0);
  if (page === 'chat' && state.chatStep === 0) initChat();
}

// ============ THEME ============
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  document.getElementById('theme-toggle').textContent = state.theme === 'dark' ? '🌙' : '☀️';
}

// ============ CHAT ============
function initChat() {
  state.chatStep = 0;
  state.chatAnswers = [];
  document.getElementById('chat-messages').innerHTML = '';
  setTimeout(() => addAIMessage(0), 400);
}

function addAIMessage(stepIndex) {
  const step = chatScript[stepIndex];
  if (!step) return;

  // Typing indicator
  const typingId = 'typing-' + Date.now();
  const typingDiv = document.createElement('div');
  typingDiv.className = 'msg fade-up'; typingDiv.id = typingId;
  typingDiv.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  document.getElementById('chat-messages').appendChild(typingDiv);
  scrollChat();

  setTimeout(() => {
    document.getElementById(typingId)?.remove();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg fade-up';

    let optionsHTML = '';
    if (step.options) {
      optionsHTML = `<div class="chat-options">${step.options.map(o => `<button class="chat-option" onclick="selectOption('${o.replace(/'/g,"\\'")}',this)">${o}</button>`).join('')}</div>`;
    }
    if (step.type === 'analyze') {
      optionsHTML = `<div style="margin-top:12px"><button class="btn-primary" onclick="runAnalysis()">🔍 Analyze My Profile</button></div>`;
    }

    msgDiv.innerHTML = `<div class="msg-avatar">🤖</div><div><div class="msg-bubble">${step.text}</div>${optionsHTML}<div class="msg-time">Alex · Just now</div></div>`;
    document.getElementById('chat-messages').appendChild(msgDiv);
    scrollChat();

    if (step.type === 'free') {
      document.getElementById('chat-input').focus();
    }
  }, 1200);
}

function scrollChat() {
  const msgs = document.getElementById('chat-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function selectOption(text, btn) {
  // Disable all options in this group
  btn.closest('.chat-options')?.querySelectorAll('.chat-option').forEach(b => b.disabled = true);
  addUserMessage(text);
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  input.style.height = 'auto';
  addUserMessage(text);
}

function addUserMessage(text) {
  state.chatAnswers.push(text);
  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg user fade-up';
  msgDiv.innerHTML = `<div class="msg-avatar">👤</div><div><div class="msg-bubble">${text}</div><div class="msg-time">You · Just now</div></div>`;
  document.getElementById('chat-messages').appendChild(msgDiv);
  scrollChat();

  state.chatStep++;
  updateChatProgress();

  if (state.chatStep < chatScript.length) {
    setTimeout(() => addAIMessage(state.chatStep), 600);
  }
}

function updateChatProgress() {
  const pct = Math.round((state.chatStep / (chatScript.length - 1)) * 100);
  document.getElementById('chat-progress-fill').style.width = Math.min(pct, 100) + '%';
  document.getElementById('chat-progress-label').textContent = `Question ${Math.min(state.chatStep + 1, 9)} of 9`;
}

function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
}
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

function runAnalysis() {
  // Classify based on answers
  const answers = state.chatAnswers.join(' ').toLowerCase();
  let type = 'failure';
  if (answers.includes('perfect') || answers.includes('ready') || answers.includes('good enough')) type = 'perfectionism';
  else if (answers.includes('qualified') || answers.includes('experience') || answers.includes('who am i')) type = 'imposter';

  loadResults(type);
}

// ============ RESULTS ============
function loadResults(type) {
  const data = barrierData[type];
  state.resultData = data;

  document.getElementById('r-primary-barrier').textContent = data.name;
  document.getElementById('r-explanation').textContent = data.explanation;
  document.getElementById('r-risk').textContent = data.risk;
  document.getElementById('r-risk').className = 'risk-badge ' + data.riskClass;
  document.getElementById('conf-num').textContent = data.confidence;
  document.getElementById('r-secondary').textContent = data.secondary;

  // Animate confidence ring
  const circumference = 326.7;
  const offset = circumference - (data.confidence / 100) * circumference;
  document.getElementById('conf-circle').style.strokeDashoffset = offset;

  // Actions
  document.getElementById('action-today-title').textContent = data.actions.today.title;
  document.getElementById('action-today-desc').textContent = data.actions.today.desc;
  document.getElementById('action-3d-title').textContent = data.actions.threeDay.title;
  document.getElementById('action-3d-desc').textContent = data.actions.threeDay.desc;
  document.getElementById('action-7d-title').textContent = data.actions.sevenDay.title;
  document.getElementById('action-7d-desc').textContent = data.actions.sevenDay.desc;

  // Entrepreneurs
  const egrid = document.getElementById('entrepreneur-grid');
  egrid.innerHTML = '';
  data.entrepreneurs.slice(0, 6).forEach(name => {
    const e = entrepreneurDB[name];
    if (!e) return;
    const card = document.createElement('div');
    card.className = 'entre-card';
    card.innerHTML = `<div class="entre-emoji">${e.emoji}</div><div class="entre-name">${name}</div><div class="entre-company">${e.company}</div><div class="entre-stat">"${e.lesson}"</div>`;
    card.onclick = () => showEntreModal(name);
    egrid.appendChild(card);
  });

  // Toolkit
  const tgrid = document.getElementById('toolkit-grid');
  tgrid.innerHTML = '';
  data.toolkit.forEach(name => {
    const t = toolkitData[name];
    if (!t) return;
    const card = document.createElement('div');
    card.className = 'toolkit-card';
    card.innerHTML = `<div class="toolkit-icon">${t.icon}</div><div class="toolkit-name">${name}</div><div class="toolkit-desc">${t.desc}</div><span class="toolkit-tag">${t.tag}</span>`;
    tgrid.appendChild(card);
  });

  // Mark first milestone done
  state.milestones[0] = true;
  saveToStorage();

  showPage('results');
}

// ============ DEMO ============
function loadDemo(type) {
  // Pre-fill chat with demo conversation
  const demos = {
    failure: [
      'Ready!',
      'I want to start an online coaching business helping people with productivity.',
      "I'm afraid it won't work",
      "I've thought about it a lot but done nothing",
      'Failing publicly',
      'I would lose money, time, and people would see me as a failure.',
      'It would devastate me',
      'I keep postponing reaching out to my first potential client.',
      '4-5 (Low)'
    ],
    perfectionism: [
      "Let's go!",
      'A SaaS tool for freelancers to manage invoices and taxes in one place.',
      "I don't feel ready yet",
      "Yes, but I stopped",
      'Wasting time and money',
      'I would have built something not good enough and wasted months of work.',
      "I'd question everything",
      "Building the perfect MVP before showing anyone.",
      '6-7 (Medium)'
    ],
    imposter: [
      "Yes, let's do this",
      'An education platform for learning Arabic through storytelling.',
      "I'm afraid of what people will think",
      "I've tried multiple times",
      'Not being good enough',
      'People would discover I\'m not really an expert and I\'d be embarrassed.',
      "I'd be upset but continue",
      "Putting my face and name publicly as the founder.",
      '4-5 (Low)'
    ]
  };

  state.chatAnswers = demos[type];
  loadResults(type);
}

// ============ ENTREPRENEUR MODAL ============
function showEntreModal(name) {
  const e = entrepreneurDB[name];
  if (!e) return;
  document.getElementById('modal-body').innerHTML = `
    <div class="modal-emoji">${e.emoji}</div>
    <h2>${name}</h2>
    <div class="modal-company">${e.company}</div>
    <div class="modal-section"><h4>Initial Obstacle</h4><p>${e.obstacle}</p></div>
    <div class="modal-section"><h4>What Happened</h4><p>${e.happened}</p></div>
    <div class="modal-section"><h4>How They Overcame It</h4><p>${e.overcame}</p></div>
    <div class="modal-lesson">💡 Key Lesson: "${e.lesson}"</div>
  `;
  document.getElementById('modal-overlay').classList.add('show');
}
function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').classList.remove('show');
  }
}

// ============ PROGRESS ============
function toggleMilestone(index) {
  state.milestones[index] = !state.milestones[index];
  const item = document.getElementById('ms-' + index);
  const check = item.querySelector('.milestone-check');
  if (state.milestones[index]) {
    item.classList.add('done');
    check.textContent = '✓';
  } else {
    item.classList.remove('done');
    check.textContent = '○';
  }
  updateProgressPct();
  saveToStorage();
}

function updateProgressPct() {
  const done = state.milestones.filter(Boolean).length;
  const pct = Math.round((done / state.milestones.length) * 100);
  document.getElementById('progress-pct').textContent = pct + '%';
  document.getElementById('progress-bar-fill').style.width = pct + '%';
}

function saveProgress() {
  saveToStorage();
  showToast('💾 Progress saved!');
}

// ============ EXPORT/SHARE ============
function exportPDF() {
  showToast('📄 Action plan export started — check your downloads.');
  // Real implementation would use jsPDF
}

function shareResults() {
  if (navigator.share) {
    navigator.share({ title: 'My Fear2FirstStep Results', text: 'I just discovered my #1 entrepreneurial barrier. Check out Fear2FirstStep!', url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Link copied to clipboard!');
  }
}

function retakeAssessment() {
  state.chatStep = 0;
  state.chatAnswers = [];
  showPage('chat');
  initChat();
}

// ============ STORAGE ============
function saveToStorage() {
  localStorage.setItem('f2fs_milestones', JSON.stringify(state.milestones));
  if (state.resultData) localStorage.setItem('f2fs_result', JSON.stringify(state.resultData));
}

function loadFromStorage() {
  const m = localStorage.getItem('f2fs_milestones');
  if (m) {
    state.milestones = JSON.parse(m);
    state.milestones.forEach((done, i) => {
      if (done) {
        const item = document.getElementById('ms-' + i);
        if (item) { item.classList.add('done'); item.querySelector('.milestone-check').textContent = '✓'; }
      }
    });
    updateProgressPct();
  }
}

// ============ TOAST ============
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============ INIT ============
window.addEventListener('DOMContentLoaded', () => {
  // Default dark mode
  document.documentElement.setAttribute('data-theme', 'dark');
  loadFromStorage();
});

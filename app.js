// ======================================================

// JARVIS — ZUVLI COMMAND

// Private Project Command Center

// ======================================================

const $ = (id) => document.getElementById(id);

const get = (key, fallback) => {

  try {

    return JSON.parse(localStorage.getItem(key)) ?? fallback;

  } catch {

    return fallback;

  }

};

const set = (key, value) => {

  localStorage.setItem(key, JSON.stringify(value));

};

// ======================================================

// DATABASE

// ======================================================

let db = get("zuvli_jarvis", {

  tasks: [

    { t: "Test Zuvli on iPad", done: false },

    { t: "Prepare school launch demo", done: false }

  ],

  bugs: [],

  ideas: [

    "Chapter-based learning",

    "Website approval requests"

  ],

  diary: [],

  features: {

    "Home": "Live",

    "Learn": "Building",

    "Zuvi": "Building",

    "Explore": "Testing",

    "Create": "Building",

    "Play": "Live",

    "Parent Center": "Testing",

    "PWA / App": "Planned",

    "Marketing": "Building"

  },

  links: {

    zuvli: "https://zuvli.in",

    github: "",

    coolify: ""

  }

});

// ======================================================

// SIDEBAR

// ======================================================

const menu = [

  ["command", "◉ Command"],

  ["tasks", "✓ Tasks"],

  ["features", "◈ Features"],

  ["roadmap", "⌁ Roadmap"],

  ["bugs", "⚠ Bugs"],

  ["ideas", "✦ Ideas"],

  ["diary", "▤ Dev Diary"],

  ["marketing", "⌁ Marketing"],

  ["settings", "⚙ Settings"]

];

if ($("nav")) {

  $("nav").innerHTML = menu.map((item, index) => `

    <button

      class="${index === 0 ? "on" : ""}"

      onclick="go('${item[0]}')">

      ${item[1]}

    </button>

  `).join("");

}

// ======================================================

// NAVIGATION

// ======================================================

function go(id) {

  document.querySelectorAll(".page").forEach(page => {

    page.classList.remove("on");

  });

  const page = $(id);

  if (page) {

    page.classList.add("on");

  }

  if ($("nav")) {

    [...$("nav").children].forEach((button, index) => {

      button.classList.toggle(

        "on",

        menu[index][0] === id

      );

    });

  }

  render();

}

// ======================================================

// JARVIS CHAT

// ======================================================

function say(message, user = false) {

  if (!$("chat")) return;

  const bubble = document.createElement("p");

  bubble.className = user ? "me" : "jarvis";

  bubble.textContent = message;

  $("chat").appendChild(bubble);

  $("chat").scrollTop = $("chat").scrollHeight;

}

// ======================================================

// JARVIS VOICE

// ======================================================

function speak(message) {

  if (!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const voice = new SpeechSynthesisUtterance(message);

  voice.rate = 1;

  voice.pitch = 0.9;

  voice.volume = 1;

  speechSynthesis.speak(voice);

}

// ======================================================

// JARVIS RESPONSE

// ======================================================

function jarvis(message, useVoice = true) {

  say(message);

  if (useVoice) {

    speak(message);

  }

}

// ======================================================

// TOAST

// ======================================================

function toast(message) {

  if (!$("toast")) return;

  $("toast").textContent = message;

  $("toast").classList.add("show");

  setTimeout(() => {

    $("toast").classList.remove("show");

  }, 1800);

}

// ======================================================

// SAVE DATABASE

// ======================================================

function save() {

  set("zuvli_jarvis", db);

  render();

}

// ======================================================

// OPEN WEBSITE

// ======================================================

function openWebsite(url, name) {

  if (!url) {

    jarvis(

      `${name} URL is not configured. Add it in Settings.`

    );

    return;

  }

  try {

    const safeURL = new URL(url);

    if (

      safeURL.protocol !== "https:" &&

      safeURL.protocol !== "http:"

    ) {

      throw new Error();

    }

    jarvis(`Opening ${name}.`);

    window.open(

      safeURL.href,

      "_blank",

      "noopener,noreferrer"

    );

  } catch {

    jarvis(

      `${name} URL is invalid. Check Settings.`

    );

  }

}

// ======================================================

// TASKS

// ======================================================

function addTask(value) {

  const input = $("taskInput");

  const text =

    value ||

    (input ? input.value.trim() : "");

  if (!text) return;

  db.tasks.unshift({

    t: text,

    done: false

  });

  if (input) input.value = "";

  save();

  toast("Task added");

}

function toggle(type, index) {

  if (type === "task") {

    db.tasks[index].done =

      !db.tasks[index].done;

  }

  if (type === "bug") {

    db.bugs[index].done =

      !db.bugs[index].done;

  }

  save();

}

function removeItem(type, index) {

  if (type === "task") {

    db.tasks.splice(index, 1);

  }

  if (type === "bug") {

    db.bugs.splice(index, 1);

  }

  if (type === "idea") {

    db.ideas.splice(index, 1);

  }

  save();

}

// ======================================================

// BUGS

// ======================================================

function addBug(value) {

  const input = $("bugInput");

  const text =

    value ||

    (input ? input.value.trim() : "");

  if (!text) return;

  db.bugs.unshift({

    t: text,

    done: false

  });

  if (input) input.value = "";

  save();

  toast("Bug logged");

}

// ======================================================

// IDEAS

// ======================================================

function addIdea(value) {

  const input = $("ideaInput");

  const text =

    value ||

    (input ? input.value.trim() : "");

  if (!text) return;

  db.ideas.unshift(text);

  if (input) input.value = "";

  save();

  toast("Idea saved");

}

// ======================================================

// DEV DIARY

// ======================================================

function saveDiary() {

  if (!$("diaryText")) return;

  const text =

    $("diaryText").value.trim();

  if (!text) return;

  db.diary.unshift({

    date: new Date().toLocaleString(),

    t: text

  });

  $("diaryText").value = "";

  save();

  toast("Diary entry saved");

}

// ======================================================

// SETTINGS

// ======================================================

function saveSettings() {

  db.links = {

    zuvli:

      $("zuvliUrl")?.value.trim() || "",

    github:

      $("githubUrl")?.value.trim() || "",

    coolify:

      $("coolifyUrl")?.value.trim() || ""

  };

  save();

  toast("Settings saved");

}

// ======================================================

// ESCAPE HTML

// ======================================================

function escapeHTML(text) {

  return String(text).replace(

    /[&<>"']/g,

    character => ({

      "&": "&amp;",

      "<": "&lt;",

      ">": "&gt;",

      '"': "&quot;",

      "'": "&#39;"

    }[character])

  );

}

// ======================================================

// RENDER TASKS

// ======================================================

function renderTasks() {

  if (!$("taskList")) return;

  if (!db.tasks.length) {

    $("taskList").innerHTML =

      "<p>No tasks. You're clear.</p>";

    return;

  }

  $("taskList").innerHTML =

    db.tasks.map((task, index) => `

      <div class="item ${task.done ? "done" : ""}">

        <div class="grow">

          <b>${escapeHTML(task.t)}</b>

        </div>

        <button onclick="toggle('task', ${index})">

          ${task.done ? "Undo" : "Done"}

        </button>

        <button onclick="removeItem('task', ${index})">

          ×

        </button>

      </div>

    `).join("");

}

// ======================================================

// RENDER BUGS

// ======================================================

function renderBugs() {

  if (!$("bugList")) return;

  if (!db.bugs.length) {

    $("bugList").innerHTML =

      "<p>No bugs logged 🎉</p>";

    return;

  }

  $("bugList").innerHTML =

    db.bugs.map((bug, index) => `

      <div class="item ${bug.done ? "done" : ""}">

        <div class="grow">

          <b>${escapeHTML(bug.t)}</b>

        </div>

        <button onclick="toggle('bug', ${index})">

          ${bug.done ? "Undo" : "Fixed"}

        </button>

        <button onclick="removeItem('bug', ${index})">

          ×

        </button>

      </div>

    `).join("");

}

// ======================================================

// RENDER IDEAS

// ======================================================

function renderIdeas() {

  if (!$("ideaList")) return;

  if (!db.ideas.length) {

    $("ideaList").innerHTML =

      "<p>No ideas saved yet.</p>";

    return;

  }

  $("ideaList").innerHTML =

    db.ideas.map((idea, index) => `

      <div class="item">

        <div class="grow">

          <b>${escapeHTML(idea)}</b>

        </div>

        <button onclick="removeItem('idea', ${index})">

          ×

        </button>

      </div>

    `).join("");

}

// ======================================================

// FEATURES + ROADMAP

// ======================================================

function renderFeatures() {

  if ($("featureList")) {

    $("featureList").innerHTML =

      Object.entries(db.features)

        .map(([name, status]) => `

        <div class="item feature">

          <b>${escapeHTML(name)}</b>

          <select

            onchange="changeFeature('${name}', this.value)">

            ${[

              "Idea",

              "Planned",

              "Building",

              "Testing",

              "Live"

            ].map(option => `

              <option

                ${option === status ? "selected" : ""}>

                ${option}

              </option>

            `).join("")}

          </select>

        </div>

      `).join("");

  }

  const groups = {

    now: [],

    next: [],

    later: []

  };

  Object.entries(db.features)

    .forEach(([name, status]) => {

      if (

        status === "Building" ||

        status === "Testing"

      ) {

        groups.now.push(name);

      } else if (status === "Planned") {

        groups.next.push(name);

      } else if (status === "Idea") {

        groups.later.push(name);

      }

    });

  Object.keys(groups).forEach(group => {

    if (!$(group)) return;

    $("" + group).innerHTML =

      groups[group].length

        ? groups[group]

            .map(name =>

              `<div class="tag">${escapeHTML(name)}</div>`

            )

            .join("")

        : "<small>Nothing here.</small>";

  });

}

function changeFeature(name, status) {

  db.features[name] = status;

  save();

  toast(`${name}: ${status}`);

}

// ======================================================

// DEV DIARY RENDER

// ======================================================

function renderDiary() {

  if (!$("diaryList")) return;

  $("diaryList").innerHTML =

    db.diary.map(entry => `

      <div class="item">

        <div>

          <small>

            ${escapeHTML(entry.date)}

          </small>

          <p>

            ${escapeHTML(entry.t)}

          </p>

        </div>

      </div>

    `).join("");

}

// ======================================================

// MAIN DASHBOARD

// ======================================================

function render() {

  renderTasks();

  renderBugs();

  renderIdeas();

  renderFeatures();

  renderDiary();

  const openTasks =

    db.tasks.filter(task => !task.done).length;

  const openBugs =

    db.bugs.filter(bug => !bug.done).length;

  if ($("taskCount")) {

    $("taskCount").textContent = openTasks;

  }

  if ($("bugCount")) {

    $("bugCount").textContent = openBugs;

  }

  if ($("ideaCount")) {

    $("ideaCount").textContent =

      db.ideas.length;

  }

  // Project progress

  const progressPoints = {

    "Idea": 5,

    "Planned": 20,

    "Building": 50,

    "Testing": 75,

    "Live": 100

  };

  const statuses =

    Object.values(db.features);

  const progress =

    Math.round(

      statuses.reduce(

        (total, status) =>

          total + (progressPoints[status] || 0),

        0

      ) / statuses.length

    );

  if ($("progress")) {

    $("progress").textContent =

      progress + "%";

  }

  // Settings

  if ($("zuvliUrl")) {

    $("zuvliUrl").value =

      db.links.zuvli || "";

  }

  if ($("githubUrl")) {

    $("githubUrl").value =

      db.links.github || "";

  }

  if ($("coolifyUrl")) {

    $("coolifyUrl").value =

      db.links.coolify || "";

  }

}

// ======================================================

// JARVIS COMMAND ENGINE

// ======================================================

function runCommand(voiceCommand) {

  const input = $("cmd");

  const original =

    (

      voiceCommand ||

      (input ? input.value : "")

    ).trim();

  if (!original) return;

  if (!voiceCommand && input) {

    input.value = "";

  }

  say(original, true);

  let command =

    original

      .toLowerCase()

      .replace(/^hey jarvis[,\s]*/i, "")

      .replace(/^jarvis[,\s]*/i, "")

      .trim();

  // --------------------------------

  // OPEN ZUVLI

  // --------------------------------

  if (

    command.includes("open zuvli") ||

    command.includes("launch zuvli") ||

    command.includes("start zuvli")

  ) {

    openWebsite(

      db.links.zuvli,

      "Zuvli"

    );

    return;

  }

  // --------------------------------

  // OPEN GITHUB

  // --------------------------------

  if (

    command.includes("open github")

  ) {

    openWebsite(

      db.links.github,

      "GitHub"

    );

    return;

  }

  // --------------------------------

  // OPEN COOLIFY

  // --------------------------------

  if (

    command.includes("open coolify")

  ) {

    openWebsite(

      db.links.coolify,

      "Coolify"

    );

    return;

  }

  // --------------------------------

  // ADD TASK

  // --------------------------------

  let match =

    original.match(

      /(?:hey\s+)?jarvis[,\s]*(?:please\s+)?add task[:\s]+(.+)/i

    ) ||

    original.match(

      /add task[:\s]+(.+)/i

    );

  if (match) {

    const task = match[1].trim();

    addTask(task);

    jarvis(

      `Task added. ${task}`

    );

    return;

  }

  // --------------------------------

  // ADD BUG

  // --------------------------------

  match =

    original.match(

      /(?:add|log) bug[:\s]+(.+)/i

    );

  if (match) {

    const bug = match[1].trim();

    addBug(bug);

    jarvis(

      `Bug logged. ${bug}`

    );

    return;

  }

  // --------------------------------

  // ADD IDEA

  // --------------------------------

  match =

    original.match(

      /add idea[:\s]+(.+)/i

    );

  if (match) {

    const idea = match[1].trim();

    addIdea(idea);

    jarvis(

      `Idea saved. ${idea}`

    );

    return;

  }

  // --------------------------------

  // SHOW TASKS

  // --------------------------------

  if (

    command.includes("show tasks") ||

    command.includes("open tasks") ||

    command.includes("what should i do today")

  ) {

    go("tasks");

    const number =

      db.tasks.filter(task => !task.done).length;

    jarvis(

      `You have ${number} open tasks.`

    );

    return;

  }

  // --------------------------------

  // SHOW BUGS

  // --------------------------------

  if (

    command.includes("show bugs") ||

    command.includes("open bugs")

  ) {

    go("bugs");

    const number =

      db.bugs.filter(bug => !bug.done).length;

    jarvis(

      `Opening the bug tracker. You have ${number} open bugs.`

    );

    return;

  }

  // --------------------------------

  // ROADMAP

  // --------------------------------

  if (

    command.includes("show roadmap") ||

    command.includes("open roadmap")

  ) {

    go("roadmap");

    jarvis(

      "Opening the Zuvli roadmap."

    );

    return;

  }

  // --------------------------------

  // IDEAS

  // --------------------------------

  if (

    command.includes("show ideas") ||

    command.includes("open ideas")

  ) {

    go("ideas");

    jarvis(

      `Opening your idea bank. You have ${db.ideas.length} ideas saved.`

    );

    return;

  }

  // --------------------------------

  // FEATURES

  // --------------------------------

  if (

    command.includes("show features") ||

    command.includes("project status") ||

    command.includes("how is zuvli going")

  ) {

    go("features");

    jarvis(

      "Opening the Zuvli feature master."

    );

    return;

  }

  // --------------------------------

  // MARKETING

  // --------------------------------

  if (

    command.includes("open marketing") ||

    command.includes("school launch")

  ) {

    go("marketing");

    jarvis(

      "Opening Zuvli marketing."

    );

    return;

  }

  // --------------------------------

  // DEV DIARY

  // --------------------------------

  if (

    command.includes("open diary") ||

    command.includes("show diary")

  ) {

    go("diary");

    jarvis(

      "Opening your development diary."

    );

    return;

  }

  // --------------------------------

  // SETTINGS

  // --------------------------------

  if (

    command.includes("open settings")

  ) {

    go("settings");

    jarvis(

      "Opening Command settings."

    );

    return;

  }

  // --------------------------------

  // TIME

  // --------------------------------

  if (

    command.includes("what time") ||

    command === "time"

  ) {

    const time =

      new Date().toLocaleTimeString(

        [],

        {

          hour: "2-digit",

          minute: "2-digit"

        }

      );

    jarvis(

      `It is ${time}.`

    );

    return;

  }

  // --------------------------------

  // DATE

  // --------------------------------

  if (

    command.includes("what date") ||

    command.includes("today's date") ||

    command.includes("what day")

  ) {

    const date =

      new Date().toLocaleDateString(

        [],

        {

          weekday: "long",

          day: "numeric",

          month: "long",

          year: "numeric"

        }

      );

    jarvis(

      `Today is ${date}.`

    );

    return;

  }

  // --------------------------------

  // HELLO

  // --------------------------------

  if (

    command === "hello" ||

    command === "hi" ||

    command === "hey"

  ) {

    jarvis(

      "Hello. JARVIS is online. What are we building today?"

    );

    return;

  }

  // --------------------------------

  // HELP

  // --------------------------------

  if (

    command.includes("what can you do") ||

    command === "help"

  ) {

    jarvis(

      "I can open Zuvli, GitHub and Coolify, manage tasks, bugs and ideas, show your roadmap, track features and help manage the Zuvli project."

    );

    return;

  }

  // --------------------------------

  // UNKNOWN

  // --------------------------------

  jarvis(

    "I don't know that command yet. Try open Zuvli, add task, add idea, log bug, show roadmap, show tasks or show bugs."

  );

}

// ======================================================

// VOICE RECOGNITION

// ======================================================

function listen() {

  const SpeechRecognition =

    window.SpeechRecognition ||

    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    jarvis(

      "Voice recognition is not available in this browser. You can still type commands."

    );

    return;

  }

  const recognition =

    new SpeechRecognition();

  recognition.lang = "en-IN";

  recognition.interimResults = false;

  recognition.continuous = false;

  if ($("orb")) {

    $("orb").style.transform =

      "scale(1.1)";

  }

  toast("JARVIS is listening…");

  recognition.start();

  recognition.onresult = function(event) {

    const command =

      event.results[0][0].transcript;

    if ($("cmd")) {

      $("cmd").value = command;

    }

    runCommand(command);

  };

  recognition.onerror = function() {

    jarvis(

      "I couldn't hear that clearly."

    );

  };

  recognition.onend = function() {

    if ($("orb")) {

      $("orb").style.transform = "";

    }

  };

}

// ======================================================

// GREETING

// ======================================================

function setGreeting() {

  if (!$("greet")) return;

  const hour =

    new Date().getHours();

  if (hour < 12) {

    $("greet").textContent =

      "Good morning.";

  } else if (hour < 18) {

    $("greet").textContent =

      "Good afternoon.";

  } else {

    $("greet").textContent =

      "Good evening.";

  }

}

// ======================================================

// START JARVIS

// ======================================================

document.addEventListener(

  "DOMContentLoaded",

  () => {

    setGreeting();

    render();

  }

);

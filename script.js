
const createNoteBtn = document.getElementById("createNoteBtn");
const noteDialog = document.getElementById("noteDialog");
const noteForm = document.getElementById("noteForm");
const cancelBtn = document.getElementById("cancelBtn");
const notesContainer = document.getElementById("notesContainer");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");

const noteTitle = document.getElementById("noteTitle");
const noteSubject = document.getElementById("noteSubject");
const noteContent = document.getElementById("noteContent");

const infoDialog = document.getElementById("infoDialog");
const infoTitle = document.getElementById("infoTitle");
const infoMessage = document.getElementById("infoMessage");

let notes = [];

try {
  notes = JSON.parse(localStorage.getItem("studyNotes")) || [];
  if (!Array.isArray(notes)) notes = [];
} catch {
  notes = [];
}

function saveNotes() {
  try {
    localStorage.setItem("studyNotes", JSON.stringify(notes));
  } catch {
    showInfo("Storage full", "Your browser could not save these notes. Try removing some notes.");
  }
}

function showInfo(title, message) {
  infoTitle.textContent = title;
  infoMessage.textContent = message;
  infoDialog.showModal();
}

function renderNotes(filter = "") {
  notesContainer.replaceChildren();

  const query = filter.trim().toLowerCase();

  const filteredNotes = notes.filter(note =>
    `${note.title} ${note.subject} ${note.content}`
      .toLowerCase()
      .includes(query)
  );

  emptyMessage.hidden = filteredNotes.length > 0;
  emptyMessage.textContent = query
    ? "No notes match your search."
    : "No notes yet. Create your first note to get started!";

  filteredNotes.forEach(note => {
    const card = document.createElement("article");
    card.className = "note-card";

    const subject = document.createElement("span");
    subject.className = "note-subject";
    subject.textContent = note.subject;

    const title = document.createElement("h3");
    title.textContent = note.title;

    const content = document.createElement("p");
    content.textContent = note.content.length > 150
      ? note.content.slice(0, 150) + "…"
      : note.content;

    const date = document.createElement("span");
    date.className = "note-date";
    date.textContent = note.date;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "🗑 Delete note";

    deleteButton.addEventListener("click", () => {
      notes = notes.filter(item => item.id !== note.id);
      saveNotes();
      renderNotes(searchInput.value);
      updateStats();
    });

    card.append(subject, title, content, date, deleteButton);
    notesContainer.appendChild(card);
  });

  updateStats();
}

function updateStats() {
  document.getElementById("noteCount").textContent = notes.length;

  const subjects = new Set(notes.map(note => note.subject));
  document.getElementById("subjectCount").textContent = subjects.size;
}

createNoteBtn.addEventListener("click", () => {
  noteForm.reset();
  noteDialog.showModal();
  noteTitle.focus();
});

cancelBtn.addEventListener("click", () => noteDialog.close());

noteDialog.addEventListener("click", event => {
  if (event.target === noteDialog) noteDialog.close();
});

noteForm.addEventListener("submit", event => {
  event.preventDefault();

  const title = noteTitle.value.trim();
  const subject = noteSubject.value;
  const content = noteContent.value.trim();

  if (!title || !subject || !content) {
    showInfo("Missing information", "Please fill in all note fields.");
    return;
  }

  const note = {
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
    title,
    subject,
    content,
    date: new Date().toLocaleDateString()
  };

  notes.unshift(note);
  saveNotes();
  noteDialog.close();
  searchInput.value = "";
  renderNotes();
});

searchInput.addEventListener("input", () => {
  renderNotes(searchInput.value);
});

document.querySelectorAll(".subject-card").forEach(button => {
  button.addEventListener("click", () => {
    searchInput.value = button.dataset.subject;
    renderNotes(searchInput.value);
    document.getElementById("notes").scrollIntoView({
      behavior: "smooth"
    });
  });
});

document.querySelectorAll(".tool-card").forEach(button => {
  button.addEventListener("click", () => {
    const tool = button.dataset.tool;

    showInfo(
      `${tool} ✨`,
      "This feature is part of our next development stage. We'll connect it to an AI service through the Express backend later."
    );
  });
});

document.getElementById("closeInfoBtn").addEventListener("click", () => {
  infoDialog.close();
});

renderNotes();

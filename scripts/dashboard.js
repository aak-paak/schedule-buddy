/*import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  setDoc,
  doc,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// HTML elements
const fileInput = document.getElementById("schedule-image");
const readBtn = document.getElementById("read-btn");
const resultText = document.getElementById("result-text");
const statusText = document.getElementById("status");
const matchesDiv = document.getElementById("matches");
const logoutBtn = document.getElementById("logout-btn");

let currentUser = null;

// 🔐 Auth check
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    window.location.href = "index.html";
  }
});

// 🚪 Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}

// 💡 String similarity helper
function similarity(a, b) {
  if (a === b) return 1;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;
  const sameChars = Array.from(shorter).filter(c => longer.includes(c)).length;
  return sameChars / longerLength;
}

// 📸 Handle Schedule Upload
readBtn.addEventListener("click", async () => {
  if (!fileInput.files[0]) {
    statusText.textContent = "Please select an image first.";
    return;
  }

  const file = fileInput.files[0];
  statusText.textContent = "📖 Reading schedule...";
  resultText.textContent = "";
  matchesDiv.innerHTML = "";

  // 🧠 Step 1: OCR with Tesseract
  const result = await Tesseract.recognize(file, "eng", {
    logger: m => console.log(m),
  });

  // Step 1: Extract all text
  const text = result.data.text;

  // Step 2: Clean & extract possible course codes
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  // Step 3: Filter using regex for valid course codes (looks for MATH 2063 or MECH 1072C)
  const courseRegex = /(MECH|MATH|PHYS|CHEM|BIOL|CS|ECE|ENGR)\s*\d{4,5}[A-Z]?\s*-\s*\d{3}/g;
  const extractedClasses = [];

  for (const line of lines) {
    const match = line.match(courseRegex);
    if (match) extractedClasses.push(...match.map(x => x.trim()));
  }

  // 🧹 Clean duplicates and normalize formats
    const normalized = extractedClasses.map(c =>
    c.toUpperCase().replace(/\s+/g, " ").replace(/\s*-\s/g, " - ").trim()
    );
    const uniqueClasses = [...new Set(normalized)].sort();

    // Show cleaned result
    resultText.textContent = uniqueClasses.join("\n");

  if (uniqueClasses.length > 0) {
    statusText.textContent = `✅ Found ${uniqueClasses.length} course(s)!`;
    statusText.style.color = "#10b981";
  } else {
    statusText.textContent = "⚠️ No valid courses found. Try a clearer screenshot.";
    statusText.style.color = "#facc15";
  }

  // Save to Firestore
  await setDoc(doc(db, "schedules", currentUser.uid), {
    email: currentUser.email,
    classes: uniqueClasses,
  });

  // Find classmates
  findMatches(uniqueClasses);
});

// 🤝 Find matches with other users
async function findMatches(myClasses) {
  matchesDiv.innerHTML = "🔍 Searching for classmates...";
  const snapshot = await getDocs(collection(db, "schedules"));
  let results = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.email !== currentUser.email) {
      const common = data.classes.filter((cls) =>
        myClasses.some((myCls) => myCls === cls)
      );
      if (common.length > 0) {
        results.push({ email: data.email, overlap: common.length, common });
      }
    }
  });

  results.sort((a, b) => b.overlap - a.overlap);

  matchesDiv.innerHTML = "";
  if (results.length === 0) {
    matchesDiv.innerHTML = "😔 No matches yet — try again later!";
    return;
  }

  results.forEach((r) => {
    const card = document.createElement("div");
    card.className = "match-card";
    card.innerHTML = `
      <strong>${r.email}</strong><br>
      ${r.overlap} matching class${r.overlap > 1 ? "es" : ""}<br>
      <small>${r.common.join(", ")}</small><br>
      <button class="fav-btn">⭐ Favorite</button>
    `;
    matchesDiv.appendChild(card);
  });
}import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  setDoc,
  doc,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// HTML elements
const fileInput = document.getElementById("schedule-image");
const readBtn = document.getElementById("read-btn");
const resultText = document.getElementById("result-text");
const statusText = document.getElementById("status");
const matchesDiv = document.getElementById("matches");
const logoutBtn = document.getElementById("logout-btn");

let currentUser = null;

// 🔐 Auth check
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    window.location.href = "index.html";
  }
});

// 🚪 Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}

// 📸 Handle Schedule Upload
readBtn.addEventListener("click", async () => {
  if (!fileInput.files[0]) {
    statusText.textContent = "Please select an image first.";
    return;
  }

  const file = fileInput.files[0];
  statusText.textContent = "📖 Reading schedule...";
  resultText.textContent = "";
  matchesDiv.innerHTML = "";

  try {
    // 🧠 Step 1: OCR with Tesseract
    const result = await Tesseract.recognize(file, "eng", {
      logger: m => console.log(m)
    });
    const text = result.data.text;
    console.log("🧾 Raw OCR text:\n", text);

    // Step 2: Split text into lines
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

    // Step 3: Regex to detect more course patterns
    const courseRegex = /\b([A-Z]{3,6})\s*([0-9]{3,4}[A-Z]?)\s*-\s*([0-9]{3})\b/g;

    const extractedClasses = [];

    for (const line of lines) {
      const matches = line.matchAll(courseRegex);
      for (const match of matches) {
        extractedClasses.push(`${match[1]} ${match[2]} - ${match[3]}`);
      }
    }

    // 🧹 Step 4: Clean & remove duplicates
    const normalized = extractedClasses.map(c =>
      c.toUpperCase().replace(/\s+/g, " ").replace(/\s*-\s/g, " - ").trim()
    );
    const uniqueClasses = [...new Set(normalized)].sort();

    if (uniqueClasses.length > 0) {
      resultText.textContent = uniqueClasses.join("\n");
      statusText.textContent = `✅ Found ${uniqueClasses.length} course(s)!`;
      statusText.style.color = "#10b981";
    } else {
      resultText.textContent = "";
      statusText.textContent = "⚠️ No valid courses found. Try a clearer screenshot.";
      statusText.style.color = "#facc15";
    }

    // 💾 Save to Firestore
    await setDoc(doc(db, "schedules", currentUser.uid), {
      email: currentUser.email,
      classes: uniqueClasses,
    });

    // 🤝 Find classmates
    findMatches(uniqueClasses);

  } catch (err) {
    console.error("Error processing schedule:", err);
    statusText.textContent = "❌ Error reading image. Try again.";
  }
});

// 🤝 Find matches with other users
async function findMatches(myClasses) {
  matchesDiv.innerHTML = "🔍 Searching for classmates...";
  const snapshot = await getDocs(collection(db, "schedules"));
  let results = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.email !== currentUser.email) {
      const common = data.classes.filter((cls) =>
        myClasses.some((myCls) => myCls === cls)
      );
      if (common.length > 0) {
        results.push({ email: data.email, overlap: common.length, common });
      }
    }
  });

  results.sort((a, b) => b.overlap - a.overlap);

  matchesDiv.innerHTML = "";
  if (results.length === 0) {
    matchesDiv.innerHTML = "😔 No matches yet — try again later!";
    return;
  }

  results.forEach((r) => {
    const card = document.createElement("div");
    card.className = "match-card";
    card.innerHTML = `
      <strong>${r.email}</strong><br>
      ${r.overlap} matching class${r.overlap > 1 ? "es" : ""}<br>
      <small>${r.common.join(", ")}</small><br>
      <button class="fav-btn">⭐ Favorite</button>
    `;
    matchesDiv.appendChild(card);
  });
}
*/

import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  setDoc,
  doc,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const fileInput = document.getElementById("schedule-image");
const readBtn = document.getElementById("read-btn");
const resultText = document.getElementById("result-text");
const statusText = document.getElementById("status");
const matchesDiv = document.getElementById("matches");
const logoutBtn = document.getElementById("logout-btn");

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) currentUser = user;
  else window.location.href = "index.html";
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}

// 🧠 Preprocess image (grayscale + contrast boost)
async function preprocessImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const url = URL.createObjectURL(file);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert to grayscale and boost contrast
      for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        avg = avg > 128 ? 255 : 0; // threshold
        data[i] = data[i + 1] = data[i + 2] = avg;
      }
      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => resolve(blob), "image/png");
    };
    img.src = url;
  });
}

readBtn.addEventListener("click", async () => {
  if (!fileInput.files[0]) {
    statusText.textContent = "Please select an image first.";
    return;
  }

  const file = fileInput.files[0];
  statusText.textContent = "🧠 Preprocessing image...";
  resultText.textContent = "";
  matchesDiv.innerHTML = "";

  const processed = await preprocessImage(file);

  try {
    statusText.textContent = "📖 Reading schedule...";
    const result = await Tesseract.recognize(processed, "eng", {
      logger: (m) => console.log(m),
    });

    const text = result.data.text;
    console.log("🧾 RAW OCR TEXT:\n", text);

    // Debug view for OCR text
    let debugBox = document.getElementById("debug-box");
    if (!debugBox) {
      debugBox = document.createElement("pre");
      debugBox.id = "debug-box";
      debugBox.style = "max-height:200px; overflow:auto; font-size:12px; background:#111; color:#0f0; padding:8px; border-radius:8px;";
      document.body.appendChild(debugBox);
    }
    debugBox.textContent = text;

    const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    const courseRegex = /\b([A-Z]{3,6})\s*([0-9]{3,4}[A-Z]?)\s*-\s*([0-9]{3})\b/g;
    const extracted = [];

    for (const line of lines) {
      const matches = line.matchAll(courseRegex);
      for (const m of matches) extracted.push(`${m[1]} ${m[2]} - ${m[3]}`);
    }

    const cleaned = extracted.map((c) =>
      c.toUpperCase().replace(/\s+/g, " ").replace(/\s*-\s*/g, " - ").trim()
    );
    const unique = [...new Set(cleaned)].sort();

    if (unique.length > 0) {
      resultText.textContent = unique.join("\n");
      statusText.textContent = `✅ Found ${unique.length} course(s)!`;
      statusText.style.color = "#10b981";
    } else {
      resultText.textContent = "";
      statusText.textContent = "⚠️ No valid courses found. Try a clearer screenshot.";
      statusText.style.color = "#facc15";
    }

    await setDoc(doc(db, "schedules", currentUser.uid), {
      email: currentUser.email,
      classes: unique,
    });

    findMatches(unique);

  } catch (err) {
    console.error(err);
    statusText.textContent = "❌ Error reading image.";
  }
});

async function findMatches(myClasses) {
  matchesDiv.innerHTML = "🔍 Searching for classmates...";
  const snapshot = await getDocs(collection(db, "schedules"));
  let results = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.email !== currentUser.email) {
      const common = data.classes.filter((cls) =>
        myClasses.some((myCls) => myCls === cls)
      );
      if (common.length > 0) results.push({ email: data.email, common });
    }
  });

  matchesDiv.innerHTML =
    results.length === 0
      ? "😔 No matches yet — try again later!"
      : results
          .map(
            (r) =>
              `<div class="match-card"><strong>${r.email}</strong><br><small>${r.common.join(
                ", "
              )}</small></div>`
          )
          .join("");
}

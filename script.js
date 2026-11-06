/* Trails & Tarmac — site data and behaviour
   TO ADD A NEW TRIP: add one block to TRIPS below, then copy logs/example-trip.html
   to logs/<your-slug>.html. TO ADD PHOTOS: paste the Cloudinary public ID into PHOTOS.
   The "Cost" field is intentionally left out of every log. */

const CLOUD = "bfeulup0";                // your Cloudinary cloud name
const ROOT = document.body.dataset.root || "";  // "" on the homepage, "../" inside /logs

// Optional: public ID of a hero photo, e.g. "sandakphu/ridge-sunrise". Leave "" for the drawn skyline.
const HERO_PHOTO = "v1785387364/20251001_061647.jpg_lxqshy.jpg";

// Every Cloudinary link uses the same optimisation pattern: q_auto,f_auto,w_<size>
const img = (id, w = 800) => `https://res.cloudinary.com/${CLOUD}/image/upload/q_auto,f_auto,w_${w}/${id}`;

const TRIPS = [
  {
    slug: "sandakphu",
    place: "Sandakphu–Phalut",
    region: "Darjeeling hills, West Bengal",
    tag: "Trek",
    when: "October 2026",
    type: "Road trip and trek",
    height: "3,636 m at Sandakphu",
    blurb: "Four of us, one ridge line, and Everest, Kanchenjunga, Lhotse and Makalu lined up on the horizon.",
    cover: ""            // e.g. "sandakphu/cover"
  },
  {
    slug: "spiti-valley",
    place: "Spiti Valley",
    region: "Himachal Pradesh",
    tag: "Road Trip",
    when: "October 2026",
    type: "12-day circuit",
    height: "Highest pass: Kunzum La, 4,590 m",
    blurb: "Enter at Shimla, exit at Manali, and cross the cold desert in between.",
    cover: ""            // e.g. "spiti/cover"
  }
];

// Gallery: add one line per photo. Example:
//   { id: "sandakphu/sunrise-01", caption: "First light on Kanchenjunga", trip: "Sandakphu" },
const PHOTOS = [
  // Your two existing photos. Add a caption and trip name between the quotes when you like.
  { id: "v1785387364/20251001_061647.jpg_lxqshy.jpg", caption: "", trip: "" },
  { id: "v1785240157/WhatsApp_Image_2026-07-23_at_4.45.34_PM_kuq9pu.jpg", caption: "", trip: "" },
];

/* ---------- Theme ---------- */
(function theme() {
  let saved = null;
  try { saved = localStorage.getItem("tt-theme"); } catch (e) {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const set = (t) => {
    document.documentElement.dataset.theme = t;
    const b = document.getElementById("theme-btn");
    if (b) b.textContent = t === "dark" ? "Light mode" : "Dark mode";
  };
  set(saved || (prefersDark ? "dark" : "light"));
  document.addEventListener("click", (e) => {
    if (e.target.id !== "theme-btn") return;
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    set(next);
    try { localStorage.setItem("tt-theme", next); } catch (err) {}
  });
})();

/* ---------- Helpers ---------- */
const ridgeSvg = '<svg viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 80 L0 55 L60 30 L110 48 L170 12 L230 44 L290 22 L350 46 L400 30 L400 80Z" fill="#fff"/></svg>';

function thumb(trip) {
  const photo = trip.cover
    ? `<img src="${img(trip.cover, 700)}" alt="${trip.place}" loading="lazy">`
    : ridgeSvg;
  return `<div class="thumb">${photo}<span class="tag">${trip.tag}</span></div>`;
}

/* ---------- Homepage ---------- */
const stories = document.getElementById("story-grid");
if (stories) {
  stories.innerHTML = TRIPS.map((t) => `
    <a class="card" href="${ROOT}logs/${t.slug}.html">
      ${thumb(t)}
      <div class="body"><h3>${t.place}</h3><p>${t.blurb}</p></div>
    </a>`).join("") + `
    <div class="card invite"><div class="body">
      <h3>The next trail</h3>
      <p>Add a trip to <code>TRIPS</code> in script.js and it shows up here.</p>
    </div></div>`;
}

const table = document.getElementById("trail-rows");
if (table) {
  table.innerHTML = TRIPS.map((t) => `
    <tr>
      <td>${t.place}</td>
      <td>${t.region}</td>
      <td>${t.when}</td>
      <td>${t.height}</td>
      <td><a href="${ROOT}logs/${t.slug}.html">Open log</a></td>
    </tr>`).join("");
}

const hero = document.getElementById("hero");
if (hero && HERO_PHOTO) {
  hero.style.setProperty("--hero-img", `url("${img(HERO_PHOTO, 1600)}")`);
  hero.classList.add("has-photo");
}

/* ---------- Gallery ---------- */
const gallery = document.getElementById("gallery");
if (gallery) {
  if (!PHOTOS.length) {
    gallery.innerHTML = `<div class="empty"><h3>No photos yet</h3>
      <p>Upload a photo to Cloudinary, copy its public ID, and add a line to <code>PHOTOS</code> in script.js.
      Reload this page and it appears here.</p></div>`;
  } else {
    gallery.className = "masonry";
    gallery.innerHTML = PHOTOS.map((p, i) => `
      <figure data-i="${i}" tabindex="0" role="button" aria-label="Open photo: ${p.caption || p.trip || ""}">
        <img src="${img(p.id, 700)}" alt="${p.caption || p.trip || "Travel photo"}" loading="lazy">
        ${(p.caption || p.trip) ? `<figcaption>${[p.caption, p.trip].filter(Boolean).join(", ")}</figcaption>` : ""}
      </figure>`).join("");

    const box = document.getElementById("lightbox");
    const open = (i) => {
      const p = PHOTOS[i];
      box.querySelector("img").src = img(p.id, 1600);
      box.querySelector("img").alt = p.caption || "";
      box.querySelector("p").textContent = p.caption || "";
      box.showModal();
    };
    gallery.addEventListener("click", (e) => { const f = e.target.closest("figure"); if (f) open(+f.dataset.i); });
    gallery.addEventListener("keydown", (e) => { if (e.key === "Enter") { const f = e.target.closest("figure"); if (f) open(+f.dataset.i); } });
    box.addEventListener("click", () => box.close());
  }
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

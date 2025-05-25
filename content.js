const speeds = Array.from({ length: 16 }, (_, i) => (0.25 * (i + 1)).toFixed(2));
const dropdownId = "yt-speed-dropdown";
const tailwindCdnId = "tailwind-cdn-style";

function injectTailwind() {
  if (!document.getElementById(tailwindCdnId)) {
    const link = document.createElement("link");
    link.id = tailwindCdnId;
    link.href = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
}

function createDropdown() {
  if (document.getElementById(dropdownId)) return;

  const dropdown = document.createElement("select");
  dropdown.id = dropdownId;

  dropdown.className = `
    fixed top-5 right-5 z-50
    bg-white text-gray-800
    border border-gray-300
    rounded-xl
    shadow-lg
    px-5 py-3
    text-lg font-semibold
    appearance-none
    cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition
    duration-300
    ease-in-out
  `.trim().replace(/\s+/g, ' ');

  dropdown.style.backgroundImage = `url("data:image/svg+xml,%3Csvg fill='none' stroke='%23666' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`;
  dropdown.style.backgroundRepeat = 'no-repeat';
  dropdown.style.backgroundPosition = 'right 1rem center';
  dropdown.style.backgroundSize = '1.25em';

  speeds.forEach((speed) => {
    const option = document.createElement("option");
    option.value = speed;
    option.textContent = `${speed}x`;
    dropdown.appendChild(option);
  });

  const savedSpeed = localStorage.getItem("yt-speed") || "1.00";
  dropdown.value = savedSpeed;

  dropdown.addEventListener("change", () => {
    const newSpeed = parseFloat(dropdown.value);
    const video = document.querySelector("video");
    if (video) video.playbackRate = newSpeed;
    localStorage.setItem("yt-speed", newSpeed);

    // Remove dropdown immediately on selection
    dropdown.remove();
  });

  document.body.appendChild(dropdown);
}

function applyStoredSpeedToVideo() {
  const savedSpeed = parseFloat(localStorage.getItem("yt-speed") || "1.00");
  const video = document.querySelector("video");
  if (video) {
    video.playbackRate = savedSpeed;
  }
}

// Show dropdown on Alt + S
document.addEventListener("keydown", (e) => {
  if (e.altKey && e.key.toLowerCase() === "s") {
    injectTailwind();
    createDropdown();
  }
});

// Remove dropdown if clicking outside of it
document.addEventListener("click", (e) => {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown && !dropdown.contains(e.target)) {
    dropdown.remove();
  }
});

// Observe changes to apply speed to new videos (e.g., YouTube navigation)
const observer = new MutationObserver(() => {
  applyStoredSpeedToVideo();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

applyStoredSpeedToVideo();

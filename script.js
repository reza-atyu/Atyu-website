// হ্যামবার্গার মেনু টগল
function toggleMenu(event) {
  event.stopPropagation();
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

// বাইরের জায়গায় ক্লিক করলে মেনু হাইড হবে
document.addEventListener("click", function () {
  const menu = document.getElementById("menu");
  menu.style.display = "none";
});

// স্ক্রল করলে মেনু হাইড হবে
window.addEventListener("scroll", function () {
  const menu = document.getElementById("menu");
  menu.style.display = "none";
});

// মেনুর ভিতরে ক্লিক করলে হাইড হবে না
document.getElementById("menu").addEventListener("click", function (event) {
  event.stopPropagation();
});

// পাসওয়ার্ড ফিল্ড দেখানো
function showPasswordField() {
  document.getElementById("password-section").style.display = "block";
}

// নোটিশ যোগ
document.getElementById("add-notice-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const password = document.getElementById("notice-password").value;
  const title = document.getElementById("notice-title").value;
  const content = document.getElementById("notice-content").value;

  if (password !== "atyu") {
    alert("ভুল পাসওয়ার্ড!");
    return;
  }

  const notices = JSON.parse(localStorage.getItem("notices") || "[]");
  const newNotice = { id: Date.now(), title, content };
  notices.push(newNotice);
  localStorage.setItem("notices", JSON.stringify(notices));

  document.getElementById("add-notice-form").reset();
  document.getElementById("password-section").style.display = "none";
  loadNotices();
});

// নোটিশ লোড
function loadNotices() {
  const notices = JSON.parse(localStorage.getItem("notices") || "[]");
  const list = document.getElementById("notice-list");
  const marquee = document.getElementById("notice-marquee");
  list.innerHTML = "";
  marquee.innerHTML = "";

  notices.forEach(notice => {
    const div = document.createElement("div");
    div.className = "notice";
    div.innerHTML = `
      <div class="notice-title" onclick="downloadNotice('${notice.title}', \`${notice.content}\`)">${notice.title}</div>
      <button onclick="deleteNotice(${notice.id})">❌</button>
    `;
    list.appendChild(div);

    const span = document.createElement("span");
    span.textContent = " 🔔 " + notice.title + " ";
    marquee.appendChild(span);
  });
}

// নোটিশ ডিলিট
function deleteNotice(id) {
  const password = prompt("পাসওয়ার্ড দিন:");
  if (password !== "1234") {
    alert("ভুল পাসওয়ার্ড!");
    return;
  }

  let notices = JSON.parse(localStorage.getItem("notices") || "[]");
  notices = notices.filter(notice => notice.id !== id);
  localStorage.setItem("notices", JSON.stringify(notices));
  loadNotices();
}

// PDF ডাউনলোড
function downloadNotice(title, content) {
  const blob = new Blob([`${title}\n\n${content}`], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${title}.pdf`;
  link.click();
}

// শুধুমাত্র ড্রপডাউন বাটনের জন্য
document.addEventListener("DOMContentLoaded", function () {
  const dropdownBtn = document.querySelector(".dropdown-btn");
  const dropdownContent = document.querySelector(".dropdown-content");

  if (dropdownBtn && dropdownContent) {
    dropdownBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdownContent.classList.toggle("show-dropdown");
    });

    // বাইরে ক্লিক করলে বন্ধ হবে
    window.addEventListener("click", function () {
      dropdownContent.classList.remove("show-dropdown");
    });
  }

  // নোটিশ লোড কল (DOMContentLoaded-এ একবার চালানো ভাল)
  loadNotices();
});

// নামাজের সময়
function convertTo12Hour(time24) {
  const [hour, minute] = time24.split(':');
  let h = parseInt(hour);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${minute} ${ampm}`;
}

fetch("https://api.aladhan.com/v1/timings?latitude=25.7466&longitude=89.3931&method=2")
  .then(res => res.json())
  .then(data => {
    const t = data.data.timings;
    document.getElementById("prayer-times").innerHTML = `
      🕓 ফজর: ${convertTo12Hour(t.Fajr)}<br/>
      🌅 সূর্যোদয়: ${convertTo12Hour(t.Sunrise)}<br/>
      ☀️ যোহর: ${convertTo12Hour(t.Dhuhr)}<br/>
      🌇 আসর: ${convertTo12Hour(t.Asr)}<br/>
      🌆 মাগরিব: ${convertTo12Hour(t.Maghrib)}<br/>
      🌙 এশা: ${convertTo12Hour(t.Isha)}
    `;
  })
  .catch(() => {
    document.getElementById("prayer-times").innerHTML = "নামাজের সময় লোড করা যাচ্ছে না।";
  });
// Load each page section as an independent HTML component before starting the application.
(async function () {
  const mounts = [...document.querySelectorAll("[data-part]")];
  await Promise.all(mounts.map(async mount => {
    const response = await fetch("/parts/" + mount.dataset.part);
    if (!response.ok) throw new Error("Could not load " + mount.dataset.part);
    mount.outerHTML = await response.text();
  }));
  const app = document.createElement("script");
  app.src = "/js/app.js";
  document.body.appendChild(app);
})().catch(error => {
  console.error(error);
  document.querySelector("main").insertAdjacentHTML(
    "beforeend",
    '<p class="warn">ไม่สามารถโหลดส่วนประกอบเว็บไซต์ได้ กรุณาเปิดผ่านเซิร์ฟเวอร์ด้วย npm start</p>'
  );
});

const form = document.querySelector("#brief-form");
const status = document.querySelector("#form-status");
const business = document.querySelector("#business");
const messageLink = document.querySelector("#message-link");
const submitLabel = document.querySelector("#send-request span");
const help = document.querySelector("#channel-help");
function resetRequest() {
  status.textContent = "";
  messageLink.hidden = true;
  messageLink.removeAttribute("href");
}
form.addEventListener("input", () => {
  business.setCustomValidity(
    business.value.trim() ? "" : "Введите название магазина.",
  );
  resetRequest();
});
form.addEventListener("change", () => {
  const email = form.elements.channel.value === "email";
  submitLabel.textContent = email
    ? "Подготовить письмо"
    : "Написать в Telegram";
  help.textContent = email
    ? "Откроется почтовая программа с черновиком. Письмо отправляете вы."
    : "Откроется Telegram с готовым текстом. Сообщение отправляете вы.";
  resetRequest();
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  business.setCustomValidity(
    business.value.trim() ? "" : "Введите название магазина.",
  );
  if (!form.reportValidity()) return;
  const text = [
    "Здравствуйте! Хочу обсудить запуск магазина на UZEL.",
    "",
    "Магазин: " + business.value.trim(),
    "Ассортимент: " + form.elements.assortment.value,
    "Задача: " + form.elements.task.value,
    "",
    "Подскажите, какие функции подойдут, что потребуется от нас и каковы условия подключения.",
  ].join("\r\n");
  const email = form.elements.channel.value === "email";
  const url = email
    ? "mailto:lugovoi.art@yandex.ru?subject=" +
      encodeURIComponent("Запуск интернет-магазина на UZEL") +
      "&body=" +
      encodeURIComponent(text)
    : "https://t.me/temmlu?text=" + encodeURIComponent(text);
  messageLink.href = url;
  messageLink.textContent = email
    ? "Открыть подготовленное письмо"
    : "Открыть подготовленное сообщение";
  messageLink.hidden = false;
  if (email) {
    messageLink.removeAttribute("target");
    messageLink.removeAttribute("rel");
    window.open(url, "_self");
  } else {
    messageLink.target = "_blank";
    messageLink.rel = "noopener noreferrer";
    window.open(url, "_blank", "noopener,noreferrer");
  }
  status.textContent =
    "Текст подготовлен. Проверьте и отправьте его в " +
    (email ? "почтовой программе." : "Telegram.") +
    " Если окно не открылось, воспользуйтесь ссылкой ниже.";
});

const store = document.querySelector("#concept-store");
const brandPicker = document.querySelector("#brand-picker");
const demoStatus = document.querySelector("#demo-status");
const count = document.querySelector("#cart-count");
const resetDemo = document.querySelector("#reset-demo");
let cartItems = 0;
brandPicker.hidden = false;
brandPicker.addEventListener("click", (event) => {
  const button = event.target.closest("[data-brand]");
  if (!button) return;
  store.dataset.theme = button.dataset.brand;
  document.querySelector("#showcase-scene").dataset.theme =
    button.dataset.brand;
  brandPicker
    .querySelectorAll("button")
    .forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
  demoStatus.textContent =
    "Цвет концепта изменён. Оформление настраивается под ваш бренд.";
});
for (const button of document.querySelectorAll(".demo-add")) {
  button.hidden = false;
  button.addEventListener("click", () => {
    cartItems += 1;
    count.textContent = String(cartItems);
    resetDemo.hidden = false;
    demoStatus.textContent = `${button.dataset.product}: добавлено в демо-корзину. Реальная покупка недоступна.`;
  });
}
resetDemo.addEventListener("click", () => {
  cartItems = 0;
  count.textContent = "0";
  resetDemo.hidden = true;
  demoStatus.textContent = "Демонстрационная корзина очищена.";
  document.querySelector(".demo-add").focus();
});

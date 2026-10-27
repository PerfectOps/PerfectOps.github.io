const scene = document.querySelector("#showcase-scene");
const scenarioControls = document.querySelector("#scenario-controls");
const pauseScenarios = document.querySelector("#pause-scenarios");
const scenarioButtons = [
  ...scenarioControls.querySelectorAll("[data-scenario]"),
];
const scenarioMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const scenarios = [
  {
    id: "tech",
    eyebrow: "Созданы для вашего ритма",
    title: ["Больше звука.", "Меньше шума."],
    description: ["Техника, с которой", "каждый день лучше."],
    appTitle: ["Больше", "любимого звука."],
    hero: "headphones.webp",
    products: [
      ["Смартфон", "49 990 ₽", "phone.webp"],
      ["Наушники", "6 990 ₽", "headphones.webp"],
      ["Зарядное устройство", "2 990 ₽", "charger.webp"],
    ],
  },
  {
    id: "fashion",
    eyebrow: "На каждый день",
    title: ["Ваш стиль.", "Ваш ритм."],
    description: ["Любимые вещи", "для ваших планов."],
    appTitle: ["Вещи", "в вашем стиле."],
    hero: "shirt-photo.jpg",
    products: [
      ["Рубашка", "4 990 ₽", "shirt-photo.jpg"],
      ["Кеды из замши", "8 990 ₽", "shoes-photo.jpg"],
      ["Сумка", "3 490 ₽", "bag-photo.jpg"],
    ],
  },
  {
    id: "home",
    eyebrow: "Коллекция для дома",
    title: ["Больше уюта.", "Ближе к дому."],
    description: ["Свет, текстиль и керамика", "для вашего дома."],
    appTitle: ["Дом,", "в котором уютно."],
    hero: "vase-photo.jpg",
    products: [
      ["Керамическая ваза", "2 490 ₽", "vase-photo.jpg"],
      ["Настольная лампа", "6 990 ₽", "lamp-photo.jpg"],
      ["Шерстяной плед", "4 990 ₽", "throw-photo.jpg"],
    ],
  },
];
const scenarioAssets = new Set(
  scenarios.flatMap((scenario) => [
    scenario.hero,
    ...scenario.products.map((product) => product[2]),
  ]),
);
for (const asset of scenarioAssets) {
  const preload = new Image();
  preload.src = "./assets/concept-" + asset;
}
let scenarioIndex = 0;
let scenarioTimer;
let scenarioPaused = false;
let scenarioTransition;
let scenarioSnapshot;
function setConceptLines(element, lines) {
  element.replaceChildren();
  lines.forEach((line, index) => {
    if (index) element.append(document.createElement("br"));
    element.append(document.createTextNode(line));
  });
}
function setConceptImage(element, asset, alt) {
  element.src = "./assets/concept-" + asset;
  element.alt = alt;
}
function renderScenario(index, announce = false) {
  scenarioIndex = index;
  const scenario = scenarios[index];
  scene.dataset.scenario = scenario.id;
  store.querySelector(".store-small").textContent = scenario.eyebrow;
  setConceptLines(store.querySelector(".store-hero h2"), scenario.title);
  setConceptLines(store.querySelector(".store-hero p"), scenario.description);
  setConceptImage(
    store.querySelector(".store-hero img"),
    scenario.hero,
    "Иллюстрация ассортимента: " + scenarioButtons[index].textContent,
  );
  store
    .querySelectorAll(".mini-products article")
    .forEach((article, productIndex) => {
      const [name, price, asset] = scenario.products[productIndex];
      setConceptImage(
        article.querySelector("img"),
        asset,
        "Иллюстрация: " + name,
      );
      article.querySelector(":scope > span").textContent = name;
      article.querySelector(":scope > strong").textContent = price;
      const button = article.querySelector(".demo-add");
      button.dataset.product = name;
      button.setAttribute("aria-label", "Добавить в демо-корзину: " + name);
    });
  scene.querySelector(".app-promo > span:first-child").textContent =
    scenario.eyebrow;
  setConceptLines(
    scene.querySelector(".app-promo > strong"),
    scenario.appTitle,
  );
  setConceptImage(
    scene.querySelector(".app-promo img"),
    scenario.hero,
    "Концепт приложения: " + scenarioButtons[index].textContent,
  );
  const [name, price, asset] = scenario.products[0];
  setConceptImage(scene.querySelector(".app-selection img"), asset, "");
  const appProduct = scene.querySelector(".app-selection div > span");
  appProduct.firstChild.textContent = name;
  appProduct.querySelector("small").textContent = price;
  cartItems = 0;
  count.textContent = "0";
  resetDemo.hidden = true;
  scenarioButtons.forEach((button, buttonIndex) =>
    button.setAttribute("aria-pressed", String(buttonIndex === index)),
  );
  if (announce)
    demoStatus.textContent =
      "Пример: " +
      scenarioButtons[index].textContent +
      ". Сайт и приложение обновлены. Данные демонстрационные.";
}
function clearScenarioSnapshot() {
  clearTimeout(scenarioTransition);
  scenarioSnapshot?.remove();
  scenarioSnapshot = undefined;
}
function switchScenario(index, announce = false) {
  clearScenarioSnapshot();
  if (index === scenarioIndex) return;
  if (scenarioMotion.matches) {
    renderScenario(index, announce);
    return;
  }
  const snapshot = scene.cloneNode(true);
  snapshot.removeAttribute("id");
  snapshot
    .querySelectorAll("[id]")
    .forEach((element) => element.removeAttribute("id"));
  snapshot.classList.add("scenario-snapshot");
  snapshot.setAttribute("aria-hidden", "true");
  snapshot.inert = true;
  renderScenario(index, announce);
  scene.append(snapshot);
  scenarioSnapshot = snapshot;
  // Фиксируем начальную непрозрачность слоя до запуска CSS-перехода.
  snapshot.getBoundingClientRect();
  snapshot.classList.add("is-leaving");
  scenarioTransition = setTimeout(clearScenarioSnapshot, 700);
}
function scheduleScenario() {
  clearTimeout(scenarioTimer);
  if (scenarioPaused || document.hidden) return;
  scenarioTimer = setTimeout(() => {
    switchScenario((scenarioIndex + 1) % scenarios.length);
    scheduleScenario();
  }, 2000);
}
scenarioButtons.forEach((button, index) =>
  button.addEventListener("click", () => {
    switchScenario(index, true);
    scheduleScenario();
  }),
);
pauseScenarios.addEventListener("click", () => {
  scenarioPaused = !scenarioPaused;
  pauseScenarios.setAttribute("aria-pressed", String(scenarioPaused));
  pauseScenarios.textContent = scenarioPaused ? "Продолжить" : "Пауза";
  scheduleScenario();
});
document.addEventListener("visibilitychange", scheduleScenario);
scenarioControls.hidden = false;
scheduleScenario();

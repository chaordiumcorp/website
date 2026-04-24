async function includeHTML() {
  const header = document.getElementById("header-placeholder");
  const footer = document.getElementById("footer-placeholder");

  if (header) header.innerHTML = await (await fetch("/assets/header.html", { cache: "no-store" })).text();
  if (footer) footer.innerHTML = await (await fetch("/assets/footer.html", { cache: "no-store" })).text();
}

// garante execução
includeHTML();

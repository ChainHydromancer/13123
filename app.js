(function () {
  const cfg = window.LUN_CONFIG || {};
  const downloadUrl = (cfg.downloadUrl || "").trim();
  const filename = cfg.downloadFilename || "package.zip";
  const password = cfg.archivePassword || "";

  const i18n = {
    en: {
      brand: "mylunora",
      kicker: "Package ready",
      headline: "Latest release",
      dek: "Save the archive, copy the password, extract, then run the current version.",
      download: "Download ZIP",
      fineprint: "One archive. Extract locally, then continue.",
      passwordTitle: "Archive password",
      passwordHint: "Required when extracting the ZIP",
      copy: "Copy",
      copied: "Copied",
      guideTitle: "After download",
      step1: "Open your Downloads folder",
      step2: "Right-click the ZIP → Extract All (or 7-Zip / WinRAR)",
      step3: "When asked, paste this password:",
      step4: "Open the folder and run the <em>current version</em>",
      title: "mylunora"
    },
    es: {
      brand: "mylunora",
      kicker: "Paquete listo",
      headline: "Último release",
      dek: "Guarda el archivo, copia la contraseña, extráelo y ejecuta la versión actual.",
      download: "Descargar ZIP",
      fineprint: "Un solo archivo. Extráelo en tu equipo y continúa.",
      passwordTitle: "Contraseña del archivo",
      passwordHint: "Necesaria al extraer el ZIP",
      copy: "Copiar",
      copied: "Copiado",
      guideTitle: "Después de descargar",
      step1: "Abre la carpeta Descargas",
      step2: "Clic derecho en el ZIP → Extraer todo (o 7-Zip / WinRAR)",
      step3: "Cuando te lo pida, pega esta contraseña:",
      step4: "Abre la carpeta y ejecuta la <em>versión actual</em>",
      title: "mylunora"
    },
    zh: {
      brand: "mylunora",
      kicker: "文件已就绪",
      headline: "最新发布",
      dek: "下载压缩包，复制密码，解压后运行当前版本。",
      download: "下载 ZIP",
      fineprint: "单个压缩包。在本地解压后继续。",
      passwordTitle: "压缩包密码",
      passwordHint: "解压 ZIP 时需要",
      copy: "复制",
      copied: "已复制",
      guideTitle: "下载之后",
      step1: "打开“下载”文件夹",
      step2: "右键点击 ZIP → 全部解压缩（或使用 7-Zip / WinRAR）",
      step3: "出现提示时，粘贴此密码：",
      step4: "打开解压后的文件夹并运行<em>当前版本</em>",
      title: "mylunora"
    }
  };

  let lang = localStorage.getItem("lun_lang") || "en";
  if (!i18n[lang]) lang = "en";

  function fillPasswords() {
    document.querySelectorAll("#passwordDisplay, #passwordInline").forEach((el) => {
      el.textContent = password;
    });
  }

  function applyLang(next) {
    lang = i18n[next] ? next : "en";
    localStorage.setItem("lun_lang", lang);
    const dict = i18n[lang];

    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
    document.title = dict.title;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (dict[key] != null) el.innerHTML = dict[key];
    });

    document.querySelectorAll(".lang").forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  async function copyPassword(button) {
    try {
      await navigator.clipboard.writeText(password);
    } catch {
      const input = document.createElement("textarea");
      input.value = password;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    const dict = i18n[lang];
    button.textContent = dict.copied;
    button.classList.add("is-done");
    window.setTimeout(() => {
      button.textContent = dict.copy;
      button.classList.remove("is-done");
    }, 1600);
  }

  function triggerDownload() {
    if (!downloadUrl) return;
    const link = document.createElement("a");
    link.href = `${downloadUrl}${downloadUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  document.querySelectorAll(".lang").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.lang));
  });

  document.getElementById("downloadBtn")?.addEventListener("click", triggerDownload);
  document.getElementById("copyPassword")?.addEventListener("click", (e) => copyPassword(e.currentTarget));
  document.getElementById("copyPasswordInline")?.addEventListener("click", (e) => copyPassword(e.currentTarget));

  fillPasswords();
  applyLang(lang);
})();

import { OH_NAV_SECTION_KEYS, ohGetMessages } from "./i18n.js";

function ohEscapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function ohResolveMessage(messages, key) {
  return key.split(".").reduce((value, part) => value?.[part], messages);
}

function ohRenderNavOption(section, isMenu) {
  const classes = ["oh-nav-option"];
  if (section.primary) classes.push("oh-nav-option--primary");

  const scrollAttr = section.href.startsWith("#") ? " data-oh-scroll" : "";
  const menuAttr = isMenu ? " data-oh-menu-link" : "";

  return `
    <a class="${classes.join(" ")}" href="${ohEscapeHtml(section.href)}"${scrollAttr}${menuAttr}>
      <i class="fa-solid ${ohEscapeHtml(section.icon)}" aria-hidden="true"></i>
      <span>
        <strong>${ohEscapeHtml(section.title)}</strong>
        <small>${ohEscapeHtml(section.description)}</small>
      </span>
    </a>
  `;
}

function ohRenderNavSurface(container, messages, isMenu) {
  const groups = OH_NAV_SECTION_KEYS.reduce((grouped, key) => {
    const group = messages.sections[key].group;
    grouped[group] = grouped[group] ?? [];
    grouped[group].push(key);
    return grouped;
  }, {});

  container.innerHTML = Object.entries(messages.nav.groups).map(([groupKey, label]) => {
    const headingId = isMenu ? `oh-menu-${groupKey}` : `oh-home-${groupKey}`;
    const headingTag = isMenu ? "h2" : "h3";
    const itemHtml = (groups[groupKey] ?? [])
      .map((sectionKey) => ohRenderNavOption(messages.sections[sectionKey], isMenu))
      .join("");

    return `
      <section class="${isMenu ? "oh-menu__group" : "oh-sitemap__group"}" aria-labelledby="${headingId}">
        <${headingTag} id="${headingId}">${ohEscapeHtml(label)}</${headingTag}>
        ${itemHtml}
      </section>
    `;
  }).join("");
}

class OhContentRenderer {
  mount() {
    const messages = ohGetMessages();

    document.querySelectorAll("[data-oh-i18n]").forEach((element) => {
      const value = ohResolveMessage(messages, element.dataset.ohI18n);
      if (value != null) element.textContent = value;
    });

    document.querySelectorAll("[data-oh-i18n-aria-label]").forEach((element) => {
      const value = ohResolveMessage(messages, element.dataset.ohI18nAriaLabel);
      if (value != null) element.setAttribute("aria-label", value);
    });

    document.querySelectorAll("[data-oh-nav-surface]").forEach((container) => {
      ohRenderNavSurface(container, messages, container.dataset.ohNavSurface === "menu");
    });
  }
}

export const ohContentRenderer = new OhContentRenderer();

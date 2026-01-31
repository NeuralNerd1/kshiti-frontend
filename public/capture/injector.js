(function () {
  if (window.__ELEMENT_CAPTURE_ACTIVE__)
    return;

  window.__ELEMENT_CAPTURE_ACTIVE__ = true;

  let last = null;

  function highlight(el) {
    if (last)
      last.style.outline =
        last.__old || "";

    el.__old = el.style.outline;
    el.style.outline = "2px solid #6366f1";
    last = el;
  }

  function buildLocators(el) {
    const locators = [];

    if (el.id)
      locators.push({
        selector_type: "id",
        selector_value: el.id,
      });

    locators.push({
      selector_type: "css",
      selector_value:
        el.tagName.toLowerCase() +
        (el.className
          ? "." +
            el.className
              .split(" ")
              .join(".")
          : ""),
    });

    locators.push({
      selector_type: "xpath",
      selector_value:
        "//" +
        el.tagName.toLowerCase(),
    });

    if (el.innerText?.trim())
      locators.push({
        selector_type: "text",
        selector_value:
          el.innerText.trim().slice(0, 60),
      });

    return locators;
  }

  function onHover(e) {
    e.stopPropagation();
    highlight(e.target);
  }

  function onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const el = e.target;

    window.opener.postMessage(
      {
        type: "ELEMENT_CAPTURED",
        payload: {
          locators: buildLocators(el),
        },
      },
      "*"
    );

    cleanup();
  }

  function cleanup() {
    document.removeEventListener(
      "mouseover",
      onHover,
      true
    );
    document.removeEventListener(
      "click",
      onClick,
      true
    );
  }

  document.addEventListener(
    "mouseover",
    onHover,
    true
  );
  document.addEventListener(
    "click",
    onClick,
    true
  );
})();

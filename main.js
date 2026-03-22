// XSS‑safe Dashboard JS
//
// - Avoids innerHTML for user‑facing text (use textContent instead).
// - Escapes HTML when you must inject it via innerHTML.

// HTML escape helper (for XSS protection)
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  console.log("MyDashboard JS loaded - XSS‑safe mode");

  // Example: safely update a dashboard widget with user‑facing text
  function updateWidgetSafe(widgetId, text) {
    const widget = document.getElementById(widgetId);
    if (widget) {
      widget.textContent = text; // Safe, no HTML injection
    }
  }

  // Example: if you must inject HTML (e.g., rich content), escape first
  function updateWidgetWithHtml(widgetId, rawHtml) {
    const widget = document.getElementById(widgetId);
    if (widget) {
      widget.innerHTML = escapeHtml(rawHtml); // Safe HTML injection
    }
  }

  // 👇 put your existing dashboard logic here
  // For example, simulate some labels/text updates (you’ll replace these with real logic):

  updateWidgetSafe("display1", "Dashboard ready (safe text)");
  updateWidgetSafe("display2", "No XSS here");
  updateWidgetSafe("display3", "Using textContent, not innerHTML");

  // Example of safe HTML insertion (e.g., a small link snippet)
  updateWidgetWithHtml("display4", "Click <a href='#'>here</a> to test (escaped)");

  // Attach any click/event handlers after DOM is ready
  // Example: if you had a widget that reacted to clicks:
  const clickyWidget = document.querySelector(".weather-widget");
  if (clickyWidget) {
    clickyWidget.addEventListener("click", () => {
      updateWidgetSafe("display1", "Weather widget clicked");
    });
  }
});

// Source - https://stackoverflow.com/a/65374098
// Posted by user10606394
// Retrieved 2026-11-14, License - CC BY-SA 4.0

function getCookie(key) {
  var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

export default getCookie;
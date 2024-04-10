function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function redirect() {
    var browserLanguage = navigator.language.split('-')[0]

    var languageCookie = getCookie("language");
    if (languageCookie) {
        browserLanguage = languageCookie;
    }

    if (browserLanguage=='pl') {
        if (window.location.pathname == '/portfolio/pl/'){
            return
        }
        window.location.href = '/portfolio/pl/';
    } else {
        if (window.location.pathname == '/portfolio/en/'){
            return
        }
        window.location.href = '/portfolio/en/';
    }
}

window.onload = redirect;
(function () {
  'use strict';

  var STORAGE_KEY = 'lang';
  var DEFAULT_LANG = 'en';
  var SUPPORTED = ['en', 'pt-br'];

  function getLang() {
    var urlParam = new URLSearchParams(window.location.search).get('lang');
    if (urlParam && SUPPORTED.indexOf(urlParam) !== -1) {
      localStorage.setItem(STORAGE_KEY, urlParam);
      return urlParam;
    }
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function applyStrings(strings) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (strings[key] !== undefined) {
        if (el.hasAttribute('data-i18n-html')) {
          el.innerHTML = strings[key];
        } else {
          el.textContent = strings[key];
        }
      }
    });
  }

  function applyLang(lang) {
    fetch('/assets/lang/' + lang + '.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + lang);
        return res.json();
      })
      .then(function (strings) {
        applyStrings(strings);
        document.documentElement.lang = lang === 'pt-br' ? 'pt-BR' : 'en';
        document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
          btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
        });
        localStorage.setItem(STORAGE_KEY, lang);
      })
      .catch(function (err) {
        console.error('[i18n]', err);
      });
  }

  function init() {
    applyLang(getLang());
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-lang-btn'));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

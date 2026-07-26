(function () {
  'use strict';

  var THEME_KEY = 'promptla_theme';
  var MOBILE_BREAKPOINT = 820;
  var COLLAPSE_POINT = 85;

  function preferredTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (error) {
      saved = null;
    }
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }

  applyTheme(preferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.promptla-unified-header');
    if (!header) return;

    var hamburger = header.querySelector('.hamburger');
    var logoLink = header.querySelector('.logo a');
    var nav = header.querySelector('.promptla-unified-nav');
    var menu = nav && nav.querySelector('#menu');
    var dropdowns = Array.prototype.slice.call(header.querySelectorAll('.nav-dropdown'));
    var ticking = false;

    if (!nav || !menu) return;

    if (!nav.id) nav.id = 'primaryNavigation';
    if (hamburger) {
      hamburger.setAttribute('aria-controls', nav.id);
      hamburger.setAttribute('aria-expanded', 'false');
    }

    function closeDropdowns(except) {
      dropdowns.forEach(function (item) {
        if (item === except) return;
        item.classList.remove('open', 'hover-open');
        var toggle = item.querySelector('.nav-dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }

    function setMenu(open) {
      header.classList.toggle('menu-open', open);
      document.body.classList.toggle('promptla-menu-open', open);
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
      }
      if (!open) closeDropdowns();
    }

    function setPeek(open) {
      if (window.innerWidth <= MOBILE_BREAKPOINT || !header.classList.contains('is-condensed')) {
        header.classList.remove('is-peeking');
        return;
      }
      header.classList.toggle('is-peeking', open);
      if (!open) closeDropdowns();
    }

    function updateHeader() {
      var condensed = window.scrollY > COLLAPSE_POINT;
      header.classList.toggle('is-condensed', condensed);
      if (!condensed) header.classList.remove('is-peeking');
      if (window.innerWidth > MOBILE_BREAKPOINT) setMenu(false);
      ticking = false;
    }

    function requestHeaderUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    }

    function themeLabel(theme) {
      return theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç';
    }

    function syncThemeButton(button) {
      var theme = document.documentElement.dataset.theme || 'dark';
      var icon = button.querySelector('.theme-toggle-icon');
      var text = button.querySelector('.theme-toggle-text');
      button.setAttribute('aria-label', themeLabel(theme));
      button.setAttribute('title', themeLabel(theme));
      button.setAttribute('aria-pressed', String(theme === 'light'));
      if (icon) icon.textContent = theme === 'dark' ? '☀' : '☾';
      if (text) text.textContent = theme === 'dark' ? 'Açık tema' : 'Koyu tema';
    }

    function installThemeToggle() {
      if (menu.querySelector('[data-theme-toggle]')) return;
      var item = document.createElement('li');
      item.className = 'theme-menu-item';
      item.innerHTML = '<button class="theme-toggle" data-theme-toggle type="button"><span class="theme-toggle-icon" aria-hidden="true"></span><span class="theme-toggle-text"></span></button>';
      menu.appendChild(item);
      var button = item.querySelector('[data-theme-toggle]');
      syncThemeButton(button);
      button.addEventListener('click', function () {
        var next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (error) {
          /* Theme still applies for the current page when storage is unavailable. */
        }
        syncThemeButton(button);
      });
    }

    installThemeToggle();
    updateHeader();

    window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
    window.addEventListener('resize', function () {
      if (window.innerWidth > MOBILE_BREAKPOINT) setMenu(false);
      requestHeaderUpdate();
    }, { passive: true });

    if (hamburger) {
      hamburger.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        setMenu(!header.classList.contains('menu-open'));
      });
      hamburger.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        setMenu(!header.classList.contains('menu-open'));
      });
    }

    if (logoLink) {
      logoLink.addEventListener('pointerenter', function () {
        setPeek(true);
      });
      logoLink.addEventListener('focus', function () {
        setPeek(true);
      });
    }

    header.addEventListener('pointerleave', function () {
      setPeek(false);
    });

    header.addEventListener('focusout', function (event) {
      if (!header.contains(event.relatedTarget)) setPeek(false);
    });

    dropdowns.forEach(function (item) {
      var toggle = item.querySelector('.nav-dropdown-toggle');
      var submenu = item.querySelector('.nav-submenu');
      if (!toggle || !submenu) return;
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-expanded', 'false');

      toggle.addEventListener('click', function (event) {
        if (window.innerWidth > MOBILE_BREAKPOINT) return;
        event.preventDefault();
        event.stopPropagation();
        var willOpen = !item.classList.contains('open');
        closeDropdowns(item);
        item.classList.toggle('open', willOpen);
        toggle.setAttribute('aria-expanded', String(willOpen));
      });

      toggle.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          item.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });
    });

    nav.querySelectorAll('a:not(.nav-dropdown-toggle)').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= MOBILE_BREAKPOINT) setMenu(false);
      });
    });

    document.addEventListener('click', function (event) {
      if (!header.contains(event.target)) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      setMenu(false);
      setPeek(false);
      if (hamburger && window.innerWidth <= MOBILE_BREAKPOINT) hamburger.focus();
    });
  });
})();

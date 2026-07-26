(function () {
  'use strict';

  var MOBILE_BREAKPOINT = 820;
  var COLLAPSE_POINT = 85;

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

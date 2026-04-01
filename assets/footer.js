/**
 * Shared site footer — include this on every app page.
 * Place <div id="site-footer"></div> where you want the footer,
 * then load this script: <script src="/assets/footer.js"></script>
 *
 * The script injects the footer HTML and its CSS (using the site's
 * standard CSS custom properties, so it picks up light/dark theme).
 */
(function () {
  var el = document.getElementById('site-footer');
  if (!el) return;

  if (!document.getElementById('__site-footer-css')) {
    var s = document.createElement('style');
    s.id = '__site-footer-css';
    s.textContent =
      '.site-footer{' +
        'text-align:center;' +
        'padding:2.5rem 1.5rem;' +
        'color:var(--text-secondary,#6B7280);' +
        'font-size:0.85rem;' +
        'border-top:1px solid var(--divider-color,#E5E7EB);' +
        'margin-top:2rem;' +
        'transition:border-color .4s ease,color .4s ease;' +
      '}' +
      '.site-footer p{margin:.3rem 0;}' +
      '.site-footer a{' +
        'color:var(--brand-primary,#0891B2);' +
        'text-decoration:none;' +
        'font-weight:600;' +
        'transition:color .3s ease;' +
      '}' +
      '.site-footer a:hover{text-decoration:underline;}';
    document.head.appendChild(s);
  }

  el.innerHTML =
    '<footer class="site-footer">' +
      '<p>Free to use, share, and remix. &nbsp;&middot;&nbsp; h/t to ' +
      '<a href="https://panphy.github.io/" target="_blank" rel="noopener noreferrer">PanPhy</a>' +
      '</p>' +
    '</footer>';
})();

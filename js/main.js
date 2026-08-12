/**
 * 페이지 인터랙션
 * - 스크롤 스파이 (현재 섹션 네비게이션 활성화)
 * - 섹션 등장 애니메이션
 * - 모바일 햄버거 메뉴
 * - 맨 위로 버튼
 * - PDF 저장(인쇄) 버튼
 *
 * 스크롤 위치 계산은 scroll 이벤트 대신 IntersectionObserver를 사용합니다.
 */

/* ------------------------------------------------------------------ *
 * 스크롤 스파이
 * ------------------------------------------------------------------ */
function initScrollSpy() {
  // 데스크톱 메뉴와 모바일 메뉴에 같은 앵커가 중복 존재하므로
  // 해시별로 링크를 묶어 두고 한꺼번에 활성화합니다.
  const linksByHash = new Map();

  document.querySelectorAll('header a[href^="#"]').forEach((link) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    if (!linksByHash.has(hash)) linksByHash.set(hash, []);
    linksByHash.get(hash).push(link);
  });

  const sections = [...linksByHash.keys()]
    .map((hash) => document.querySelector(hash))
    .filter(Boolean);

  if (sections.length === 0) return;

  function setActive(hash) {
    linksByHash.forEach((links, key) => {
      links.forEach((link) => link.classList.toggle('is-active', key === hash));
    });
  }

  const visible = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible.add(entry.target);
        } else {
          visible.delete(entry.target);
        }
      });

      // 화면 중앙 밴드에 걸친 섹션 중 문서 순서상 가장 위쪽을 활성으로 봅니다.
      const current = sections.find((section) => visible.has(section));
      if (current) setActive('#' + current.id);
    },
    // 뷰포트 중앙 부근(위 40% ~ 아래 55% 제외)에 들어온 섹션만 후보로 삼습니다.
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ------------------------------------------------------------------ *
 * 섹션 등장 애니메이션
 * ------------------------------------------------------------------ */
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (targets.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 모션 최소화 설정이면 애니메이션 없이 즉시 표시합니다.
  if (prefersReducedMotion) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // 한 번만 실행
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  targets.forEach((target) => observer.observe(target));
}

/* ------------------------------------------------------------------ *
 * 모바일 햄버거 메뉴
 * ------------------------------------------------------------------ */
function initMobileMenu() {
  const toggleButton = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');

  if (!toggleButton || !menu) return;

  function setOpen(isOpen) {
    menu.classList.toggle('hidden', !isOpen);
    toggleButton.setAttribute('aria-expanded', String(isOpen));
    toggleButton.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  }

  toggleButton.addEventListener('click', () => {
    setOpen(menu.classList.contains('hidden'));
  });

  // 메뉴 항목을 누르면 자동으로 닫습니다.
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  // Esc로 닫고 포커스를 토글 버튼으로 되돌립니다.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (menu.classList.contains('hidden')) return;
    setOpen(false);
    toggleButton.focus();
  });

  // 데스크톱 폭으로 넓어지면 열린 상태가 남지 않도록 초기화합니다.
  const desktop = window.matchMedia('(min-width: 768px)');
  const onDesktopChange = (event) => {
    if (event.matches) setOpen(false);
  };

  if (typeof desktop.addEventListener === 'function') {
    desktop.addEventListener('change', onDesktopChange);
  } else if (typeof desktop.addListener === 'function') {
    desktop.addListener(onDesktopChange);
  }
}

/* ------------------------------------------------------------------ *
 * 맨 위로 버튼
 * ------------------------------------------------------------------ */
function initToTop() {
  const button = document.getElementById('to-top');
  const sentinel = document.getElementById('scroll-sentinel');

  if (!button || !sentinel) return;

  // 히어로 직후에 놓인 sentinel이 화면 위로 사라지면 버튼을 노출합니다.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        button.classList.toggle('hidden', entry.isIntersecting);
      });
    },
    { threshold: 0 }
  );

  observer.observe(sentinel);

  button.addEventListener('click', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

/* ------------------------------------------------------------------ *
 * PDF 저장(인쇄) 버튼
 * ------------------------------------------------------------------ */
function initPrintButton() {
  const button = document.getElementById('print-button');
  if (!button) return;

  button.addEventListener('click', () => window.print());
}

/* ------------------------------------------------------------------ *
 * 초기화
 * ------------------------------------------------------------------ */
initScrollSpy();
initReveal();
initMobileMenu();
initToTop();
initPrintButton();

/**
 * 다크 모드 토글
 *
 * 주의: <html>에 dark 클래스를 붙이는 "초기화"는 이 파일이 아니라
 * index.html <head>의 인라인 스니펫이 담당합니다. 이 파일은 defer로 로드되므로
 * 여기서 초기화하면 라이트 모드로 한 번 그려진 뒤 바뀌어 화면이 깜빡입니다.
 * 이 파일은 토글 버튼의 동작과 아이콘 상태만 책임집니다.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var toggleButton = document.getElementById('theme-toggle');
  var sunIcon = document.getElementById('theme-icon-sun');
  var moonIcon = document.getElementById('theme-icon-moon');

  if (!toggleButton) return;

  /** 현재 테마에 맞는 아이콘과 레이블로 갱신 */
  function syncButton() {
    var isDark = root.classList.contains('dark');

    // 다크 모드일 때는 "라이트로 전환"을 뜻하는 해 아이콘을 보여줍니다.
    if (sunIcon) sunIcon.classList.toggle('hidden', !isDark);
    if (moonIcon) moonIcon.classList.toggle('hidden', isDark);

    toggleButton.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
    toggleButton.setAttribute('aria-pressed', String(isDark));
  }

  toggleButton.addEventListener('click', function () {
    var isDark = root.classList.toggle('dark');

    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {
      // localStorage를 쓸 수 없는 환경에서는 저장만 건너뜁니다.
    }

    syncButton();
  });

  // 사용자가 아직 직접 선택한 적이 없다면 OS 설정 변경을 따라갑니다.
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var onSchemeChange = function (event) {
    var hasChoice = false;
    try {
      hasChoice = Boolean(localStorage.getItem('theme'));
    } catch (e) {
      /* 접근 불가 시 OS 설정을 따름 */
    }

    if (hasChoice) return;

    root.classList.toggle('dark', event.matches);
    syncButton();
  };

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', onSchemeChange);
  } else if (typeof media.addListener === 'function') {
    // 구형 Safari 대응
    media.addListener(onSchemeChange);
  }

  syncButton();
})();

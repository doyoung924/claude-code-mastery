# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성
- **변수명/함수명**: 영어 (코드 표준 준수)

## 명령

```powershell
npm install
npm run dev     # src/input.css -> dist/output.css 감시 빌드
npm run build   # 최소화 빌드 (배포 전 필수)
```

테스트 러너와 린터는 없습니다. 검증은 브라우저에서 직접 확인합니다.

`file://`로 `index.html`을 열어도 동작합니다(데이터를 `fetch`하지 않는 구조). 다만 브라우저 확장·자동화 도구는 `file://`에 접근하지 못하므로, 그런 도구로 확인해야 할 때는 임시 정적 서버를 띄워 `http://localhost:<포트>`로 접근하세요.

## 아키텍처

**HTML / CSS / Vanilla JavaScript / Tailwind CSS로 만든 정적 단일 페이지 이력서**입니다. `ROADMAP.md`가 단계별 계획, `README.md`가 사용자용 문서입니다.

여러 파일을 읽어야 알 수 있는 핵심 구조:

- **번들러가 없습니다.** 빌드 도구는 Tailwind CLI 하나뿐이고 JS는 프레임워크 없이 브라우저에 그대로 로드됩니다. Vite/Webpack/React 도입은 이 전제를 바꾸는 일이므로 먼저 확인하세요.
- **이력서 내용은 `index.html`에 하드코딩되어 있습니다.** `data/resume.json` 같은 데이터 파일은 의도적으로 만들지 않았습니다(정적 HTML이 SEO·성능에 유리하고 `file://`에서도 열립니다). 내용을 데이터로 분리하려면 이 결정을 먼저 뒤집어야 합니다.
- **다크 모드 초기화와 토글은 분리되어 있습니다.** `<html>`에 `dark` 클래스를 붙이는 초기화는 `index.html` `<head>`의 **인라인 스크립트**가 렌더링 전에 수행하고, `js/theme.js`(`defer`)는 토글 버튼 동작과 아이콘 상태만 담당합니다. 초기화를 `theme.js`로 옮기면 첫 화면이 라이트로 그려진 뒤 전환되어 깜빡입니다.
- **반복되는 스타일은 `src/input.css`의 `@layer components`에 있습니다** (`.container-page`, `.section`, `.section-title`, `.badge`, `.card`, `.timeline-item`, `.nav-link`/`.is-active`, `.btn-primary`, `.btn-ghost`, `.icon-btn`, `.skip-link`, `.reveal`, `.no-print`). 마크업에 같은 유틸리티 조합을 다시 나열하지 말고 이 클래스를 재사용하세요.
- **`js/main.js`는 `index.html`의 특정 id에 의존합니다** — `#theme-toggle`, `#menu-toggle`/`#mobile-menu`, `#to-top`/`#scroll-sentinel`, `#print-button`. 마크업에서 이 id를 바꾸면 스크립트도 함께 고쳐야 합니다.
- **스크롤 처리는 `scroll` 이벤트가 아니라 `IntersectionObserver`를 씁니다.** 스크롤 스파이, 등장 애니메이션, 맨 위로 버튼 모두 동일한 방식입니다.
- **네비게이션 앵커는 데스크톱·모바일 메뉴에 중복 존재합니다.** 스크롤 스파이는 해시별로 링크를 묶어 양쪽을 동시에 갱신합니다.
- **`dist/output.css`는 빌드 산출물이지만 커밋 대상입니다.** GitHub Pages가 저장소를 빌드하지 않기 때문입니다. 직접 편집하지 말고 `src/input.css`를 고친 뒤 다시 빌드하세요.
- **Tailwind는 3.x에 고정되어 있습니다.** 4.x는 `tailwind.config.js` 없이 CSS-first로 설정 방식이 달라지므로, 올리려면 설정 파일과 `src/input.css`를 함께 이전해야 합니다.

## 개발 환경

- **git 저장소가 아닙니다.** 버전 관리 워크플로가 필요하면 먼저 `git init`을 실행하세요 (로드맵 Phase 1 항목).
- Windows + **Windows PowerShell 5.1** 환경이며 bash가 아닙니다.
  - `&&`와 `||`는 파싱 오류를 냅니다. `;` 또는 `A; if ($?) { B }` 형태로 연결하세요.
  - `head`/`tail`/`which`/`touch`가 없습니다. `Select-Object -First`, `Get-Content -Tail`, `Get-Command`, `New-Item`을 사용하세요.
- 경로에 비ASCII 사용자 디렉터리(`C:\Users\게스트\...`)가 포함됩니다. ASCII 전용 경로를 가정하거나 ANSI 인코딩으로 파일을 쓰는 도구는 여기서 깨질 수 있습니다. 다른 도구가 읽을 파일을 쓸 때는 `-Encoding utf8`을 명시하세요.

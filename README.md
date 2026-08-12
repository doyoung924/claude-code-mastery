# 개발자 웹 이력서

HTML / CSS / Vanilla JavaScript / Tailwind CSS로 만든 **정적 단일 페이지 개발자 이력서**입니다.
번들러 없이 Tailwind CLI 하나만 사용하며, 빌드 결과물을 그대로 정적 호스팅에 올릴 수 있습니다.

개발 계획과 단계별 체크리스트는 [`ROADMAP.md`](./ROADMAP.md)를 참고하세요.

## 주요 기능

- 반응형 레이아웃 (모바일 우선, `md` / `lg` 브레이크포인트)
- 다크 모드 — `localStorage`에 선택 저장, 최초 방문 시 OS 설정(`prefers-color-scheme`)을 따름
- 스크롤 스파이 네비게이션, 섹션 등장 애니메이션, 모바일 햄버거 메뉴, 맨 위로 버튼
- 접근성 — 본문 바로가기 링크, `aria-label`, 키보드 포커스 링, `prefers-reduced-motion` 대응
- SEO — Open Graph / Twitter Card 메타 태그, `schema.org/Person` JSON-LD
- 인쇄용 스타일 — "PDF로 저장" 버튼으로 A4 인쇄/PDF 저장

## 시작하기

Node.js가 설치되어 있어야 합니다.

```powershell
npm install
npm run dev     # CSS 감시 모드 (개발 중)
```

`npm run dev`를 켜 둔 채로 `index.html`을 브라우저에서 열면 됩니다.
데이터를 `fetch`하지 않으므로 `file://`로 직접 열어도 정상 동작합니다.

배포 전에는 최소화 빌드를 실행하세요.

```powershell
npm run build   # dist/output.css 최소화
```

> Windows PowerShell 환경입니다. 명령을 연결할 때 `&&`는 파싱 오류를 내므로 `;` 또는 `A; if ($?) { B }`를 사용하세요.

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | `src/input.css` → `dist/output.css` 감시 빌드 |
| `npm run build` | 최소화 빌드 (배포용) |

## 디렉터리 구조

```
index.html              # 이력서 본문 전체
src/input.css           # Tailwind 지시문 + 컴포넌트 클래스 + 인쇄 스타일
dist/output.css         # 빌드 산출물 (직접 편집하지 마세요)
js/theme.js             # 다크 모드 토글
js/main.js              # 스크롤 스파이, 등장 애니메이션, 메뉴, 맨 위로
assets/profile.svg      # 프로필 이미지
assets/favicon.svg      # 파비콘
tailwind.config.js      # 브랜드 컬러, 폰트, darkMode 설정
```

## 내용 교체 방법

이력서 내용은 모두 `index.html`에 직접 작성되어 있습니다. 아래 위치를 수정하세요.

| 바꿀 것 | 위치 |
|---------|------|
| 이름 · 한 줄 소개 | `<section id="home">`의 `<h1>`과 그 아래 문단, 그리고 `<head>`의 `<title>` · `description` · Open Graph · JSON-LD |
| 연락처 링크 | Hero의 아이콘 링크 3개(`mailto:`, GitHub, LinkedIn)와 `<section id="contact">`의 이메일 버튼 |
| 자기소개 | `<section id="about">` |
| 기술 스택 | `<section id="skills">`의 `.badge` 목록 |
| 경력 | `<section id="experience">`의 `.timeline-item` |
| 프로젝트 | `<section id="projects">`의 `.card` |
| 학력 | `<section id="education">` |

**프로필 사진 교체**: `assets/`에 사진을 넣고 `index.html`의 `<img src="./assets/profile.svg">`를 해당 파일로 바꾸세요. 사진을 쓸 경우 WebP로 변환하면 용량을 줄일 수 있습니다.

**스타일 수정**: 반복되는 클래스 조합은 `src/input.css`의 `@layer components`에 정의되어 있습니다(`.card`, `.badge`, `.timeline-item`, `.btn-primary` 등). 색상과 폰트는 `tailwind.config.js`의 `theme.extend`에서 바꿉니다.

## 다크 모드 동작 방식

화면 깜빡임(FOUC)을 막기 위해 **초기 테마 결정은 `index.html` `<head>`의 인라인 스크립트**가 렌더링 전에 처리합니다.
`js/theme.js`는 `defer`로 로드되며 토글 버튼 동작과 아이콘 상태만 담당합니다. 이 구조를 바꾸면 첫 화면이 라이트 모드로 한 번 그려진 뒤 전환되어 깜빡입니다.

## 성능 측정

Lighthouse 점수는 Chrome에서 직접 측정하세요.

1. 배포된 페이지(또는 로컬 서버 주소)를 Chrome에서 엽니다
2. `F12` → **Lighthouse** 탭 → Analyze page load

`file://`로 연 페이지는 정확한 측정이 어려우므로 로컬 서버나 배포 URL에서 측정하는 것을 권장합니다.

## GitHub Pages 배포

```powershell
npm run build
git add .
git commit -m "이력서 배포"
git remote add origin https://github.com/<사용자명>/<저장소명>.git
git push -u origin main
```

이후 GitHub 저장소에서 **Settings → Pages → Source**를 `main` 브랜치 / `/ (root)`로 지정하면 배포됩니다.

`dist/output.css`는 `.gitignore`에서 제외하지 않고 **커밋합니다.** GitHub Pages는 저장소를 빌드하지 않으므로 산출물이 저장소에 있어야 스타일이 적용됩니다.

## 라이선스

MIT

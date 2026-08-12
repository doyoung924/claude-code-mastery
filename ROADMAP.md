# 개발자 웹 이력서 개발 로드맵

정적 웹 이력서(Single Page)를 HTML / CSS / JavaScript / Tailwind CSS로 만들어 GitHub Pages에 배포하기까지의 단계별 계획입니다.

> **구현 현황 (2026-08-12)** — Phase 1~6 구현 완료. Phase 7은 `README.md`와 `.gitignore` 준비까지만 마쳤고, GitHub 저장소 생성·Pages 활성화는 계정이 필요해 남아 있습니다.
>
> 계획 대비 조정된 부분:
> - Tailwind CDN 단계(Phase 1)를 건너뛰고 **처음부터 CLI 빌드**로 시작했습니다. 최종 결과물은 동일합니다.
> - `assets/profile.jpg` → **`assets/profile.svg`** (플레이스홀더 아바타). 실제 사진으로 교체하는 방법은 `README.md` 참고.
> - `assets/resume.pdf`는 만들지 않고, **인쇄 스타일 + "PDF로 저장" 버튼**으로 대체했습니다. 이에 따라 Phase 6의 "이미지 WebP 변환"은 해당 사항이 없습니다.
> - `data/resume.json`(선택 항목)은 만들지 않았습니다. 이력서 내용은 `index.html`에 하드코딩되어 있습니다.
> - Lighthouse 점수는 CLI가 없어 측정하지 못했습니다. 측정 방법은 `README.md`에 안내해 두었습니다.

## 기술 스택

| 구분 | 사용 기술 | 비고 |
|------|-----------|------|
| 마크업 | HTML5 | 시맨틱 태그 기반 |
| 스타일 | Tailwind CSS 3.x | 유틸리티 클래스 중심 |
| 보조 스타일 | CSS | 커스텀 애니메이션, 프린트 스타일 |
| 스크립트 | Vanilla JavaScript (ES6+) | 프레임워크 없음 |
| 배포 | GitHub Pages | 정적 호스팅 |

빌드 도구는 Tailwind CLI만 사용합니다(번들러 없음). 초기 프로토타입 단계에서는 Tailwind CDN으로 시작하고, 3단계에서 CLI 빌드로 전환합니다.

## 목표 디렉터리 구조

```
claude-code-mastery/
├── index.html            # 이력서 본문 (단일 페이지)
├── src/
│   └── input.css         # Tailwind 지시문 + 커스텀 CSS
├── dist/
│   └── output.css        # Tailwind CLI 빌드 결과물
├── js/
│   ├── theme.js          # 다크모드 토글
│   └── main.js           # 스크롤 애니메이션, 네비게이션
├── assets/
│   ├── profile.jpg       # 프로필 이미지
│   └── resume.pdf        # PDF 이력서 (다운로드용)
├── data/
│   └── resume.json       # 이력서 데이터 (선택: 동적 렌더링용)
├── tailwind.config.js
├── package.json
└── README.md
```

---

## Phase 1. 프로젝트 초기화 (0.5일)

- [ ] `git init` 실행 및 `.gitignore` 작성 (`node_modules/`, `.DS_Store`)
- [ ] `npm init -y`로 `package.json` 생성
- [ ] 디렉터리 골격 생성 (`src/`, `js/`, `assets/`, `dist/`)
- [ ] `index.html` 기본 뼈대 작성 (`<!DOCTYPE html>`, `lang="ko"`, viewport 메타 태그)
- [ ] Tailwind CDN 스크립트로 임시 연결 후 화면에 "Hello" 출력 확인

**완료 기준**: 브라우저에서 `index.html`을 열었을 때 Tailwind 클래스(`text-3xl font-bold`)가 적용됨.

> Windows PowerShell 환경입니다. 명령 연결 시 `&&` 대신 `;` 또는 `A; if ($?) { B }`를 사용하세요.

## Phase 2. 콘텐츠 설계 및 마크업 (1일)

이력서에 들어갈 섹션을 확정하고 시맨틱 HTML로 뼈대를 작성합니다.

- [ ] **Header / Hero** — 이름, 한 줄 소개(예: "사용자 경험을 고민하는 프론트엔드 개발자"), 프로필 이미지, 연락처 아이콘(Email / GitHub / LinkedIn)
- [ ] **About** — 3~4문장 자기소개
- [ ] **Skills** — 카테고리별 기술 배지 (Frontend / Backend / Tools)
- [ ] **Experience** — 회사명, 직책, 근무 기간, 주요 업무 3줄 (타임라인 형태)
- [ ] **Projects** — 프로젝트 3개 (이름, 설명, 사용 기술, GitHub / 데모 링크)
- [ ] **Education** — 학교, 전공, 졸업 연도
- [ ] **Contact / Footer** — 이메일, 저작권 표기

**마크업 규칙**
- `<header>`, `<main>`, `<section>`, `<article>`, `<footer>` 시맨틱 태그 사용
- 각 `<section>`에 `id` 부여 (`#about`, `#skills`, `#experience`, `#projects`)
- 제목 계층은 `h1` 1개 → `h2`(섹션) → `h3`(항목) 순서 유지

**완료 기준**: CSS 없이도 문서 구조만으로 내용이 읽히는 상태.

## Phase 3. Tailwind CSS 빌드 환경 전환 (0.5일)

- [ ] `npm install -D tailwindcss` 후 `npx tailwindcss init`
- [ ] `tailwind.config.js`의 `content`에 `["./index.html", "./js/**/*.js"]` 설정
- [ ] `src/input.css`에 `@tailwind base; @tailwind components; @tailwind utilities;` 작성
- [ ] `package.json`에 스크립트 추가
  ```json
  {
    "scripts": {
      "dev": "tailwindcss -i ./src/input.css -o ./dist/output.css --watch",
      "build": "tailwindcss -i ./src/input.css -o ./dist/output.css --minify"
    }
  }
  ```
- [ ] CDN 스크립트 제거 후 `dist/output.css` 링크로 교체
- [ ] `theme.extend`에 브랜드 컬러, 폰트(Pretendard 등) 등록

**완료 기준**: `npm run dev` 실행 중 HTML 클래스 수정 시 스타일이 즉시 반영됨.

## Phase 4. 스타일링 및 반응형 레이아웃 (2일)

- [ ] 컬러 팔레트 / 타이포그래피 스케일 확정 (본문 1종, 제목 1종 폰트)
- [ ] 컨테이너 규격 통일 (`max-w-4xl mx-auto px-4`)
- [ ] 섹션 공통 간격 정의 (`py-16 md:py-24`)
- [ ] Skills 배지, Project 카드 컴포넌트 스타일링 (`rounded-lg shadow hover:shadow-lg transition`)
- [ ] Experience 타임라인 (좌측 세로선 + 도트) 구현
- [ ] 모바일 우선 반응형: 기본 1단 → `md:` 2단 → `lg:` 여백 확대
- [ ] 반복되는 클래스 조합은 `@layer components`로 추출 (예: `.section-title`, `.badge`)

**브레이크포인트 검증**: 375px(모바일) / 768px(태블릿) / 1440px(데스크톱)

**완료 기준**: 세 해상도 모두에서 가로 스크롤이 발생하지 않고 레이아웃이 깨지지 않음.

## Phase 5. JavaScript 인터랙션 (1.5일)

- [ ] **다크 모드 토글** — `tailwind.config.js`에 `darkMode: 'class'` 설정, `localStorage`에 선택 저장, 최초 방문 시 `prefers-color-scheme` 따름
- [ ] **부드러운 스크롤 네비게이션** — 상단 고정 네비게이션 바, 앵커 클릭 시 스크롤 이동
- [ ] **스크롤 스파이** — `IntersectionObserver`로 현재 섹션의 네비게이션 항목 활성화
- [ ] **등장 애니메이션** — 섹션이 뷰포트에 들어올 때 fade-in + translate-y
- [ ] **모바일 햄버거 메뉴** — 토글 시 메뉴 열기/닫기, 항목 클릭 시 자동 닫힘
- [ ] **맨 위로 버튼** — 일정 스크롤 이후 노출
- [ ] (선택) `data/resume.json`을 fetch해 섹션을 동적 렌더링

**구현 원칙**
- 모든 스크립트는 `defer` 속성으로 로드
- 전역 변수 오염 방지를 위해 모듈 패턴 또는 `type="module"` 사용
- `scroll` 이벤트 직접 사용 대신 `IntersectionObserver` 우선

**완료 기준**: 콘솔 에러 0건, 새로고침 후에도 다크모드 설정 유지.

## Phase 6. 접근성 · SEO · 성능 최적화 (1일)

**접근성 (a11y)**
- [ ] 모든 이미지에 의미 있는 `alt` 제공 (장식용은 `alt=""`)
- [ ] 아이콘 버튼에 `aria-label` 부여
- [ ] 키보드 Tab만으로 전체 탐색 가능 여부 확인, `focus-visible` 스타일 지정
- [ ] 본문 대비비 4.5:1 이상 확보 (다크 모드 포함)
- [ ] `prefers-reduced-motion`일 때 애니메이션 비활성화

**SEO**
- [ ] `<title>`, `<meta name="description">` 작성
- [ ] Open Graph / Twitter Card 메타 태그 추가
- [ ] `favicon.ico` 추가
- [ ] JSON-LD 구조화 데이터(`schema.org/Person`) 삽입

**성능**
- [ ] 이미지 WebP 변환 및 `loading="lazy"` 적용
- [ ] `npm run build`로 CSS 최소화 (미사용 클래스 제거 확인)
- [ ] Lighthouse 측정 — 목표: Performance 90+, Accessibility 95+, SEO 100

**부가**
- [ ] `@media print` 스타일로 A4 인쇄/PDF 저장 대응 (네비게이션·버튼 숨김)

## Phase 7. 배포 및 마무리 (0.5일)

- [ ] `README.md` 작성 (프로젝트 소개, 실행 방법, 스크린샷)
- [ ] GitHub 저장소 생성 및 푸시
- [ ] GitHub Pages 활성화 (Settings → Pages → `main` 브랜치 / root)
- [ ] 배포 URL에서 CSS·JS 경로 정상 로딩 확인 (상대 경로 사용)
- [ ] 모바일 실기기 및 Chrome / Safari / Firefox 교차 확인
- [ ] (선택) 커스텀 도메인 연결, GitHub Actions로 빌드 자동화

**완료 기준**: 공개 URL에서 데스크톱·모바일 모두 정상 동작.

---

## 전체 일정 요약

| Phase | 내용 | 예상 기간 | 누적 |
|-------|------|-----------|------|
| 1 | 프로젝트 초기화 | 0.5일 | 0.5일 |
| 2 | 콘텐츠 설계 및 마크업 | 1일 | 1.5일 |
| 3 | Tailwind 빌드 환경 | 0.5일 | 2일 |
| 4 | 스타일링 / 반응형 | 2일 | 4일 |
| 5 | JavaScript 인터랙션 | 1.5일 | 5.5일 |
| 6 | 접근성 · SEO · 성능 | 1일 | 6.5일 |
| 7 | 배포 및 마무리 | 0.5일 | 7일 |

**총 예상 기간: 약 7일 (1인 기준)**

## 향후 확장 아이디어

- 다국어 지원 (한국어 / 영어 전환)
- 방문자 분석 도구 연동 (Google Analytics, Plausible)
- 블로그 글 목록을 RSS로 가져와 표시
- 프로젝트 상세 페이지 분리 (다중 페이지 확장)
- Vite 도입 후 컴포넌트 기반 리팩터링

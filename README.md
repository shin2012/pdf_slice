# PDF 페이지 추출기 ✂️

[![GitHub Repository](https://img.shields.io/badge/GitHub-pdf__slice-blue?logo=github&style=flat-square)](https://github.com/shin2012/pdf_slice)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow?logo=javascript&style=flat-square)]()
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)]()

PDF 파일에서 원하는 페이지만 선택하여 새로운 PDF로 추출할 수 있는 웹 기반 도구입니다. 모든 작업은 클라이언트 측에서 안전하게 처리되므로 서버에 파일이 저장되지 않습니다.

---

## 🎯 주요 기능

- **🎨 직관적인 UI**: 드래그 앤 드롭 업로드와 그리드 레이아웃
- **🔍 페이지 썬네일 미리보기**: 모든 페이지를 시각적으로 확인하며 선택
- **✅ 다중 선택**: 원하는 페이지를 자유롭게 선택/해제
- **⚡ 빠른 처리**: 클라이언트 측 JavaScript로 빠른 PDF 처리
- **🔒 프라이빗**: 모든 작업이 브라우저에서 처리되어 프라이버시 보장
- **📱 반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원
- **📦 대용량 파일 지원**: 50MB 이상의 파일에 대한 경고 메시지

---

## 📋 시스템 요구사항

- **브라우저**: 최신 Chrome, Firefox, Safari, Edge
- **메모리**: 파일 크기에 따라 다름 (일반적으로 100MB 이상 권장)
- **네트워크**: CDN 라이브러리 로드를 위한 인터넷 연결 (선택사항 - 로컬 폴백 지원)

<details>
<summary><b>브라우저 지원 상세</b></summary>

| 브라우저 | 최소 버전 | 상태 |
|---------|---------|------|
| Chrome | 60+ | ✅ 완전 지원 |
| Firefox | 55+ | ✅ 완전 지원 |
| Safari | 11+ | ✅ 완전 지원 |
| Edge | 79+ | ✅ 완전 지원 |
| IE 11 | - | ❌ 미지원 |

</details>

---

## 🚀 설치 및 실행

### 방법 1: 로컬 파일 시스템 (가장 간단)

1. **저장소 복제**
   ```bash
   git clone https://github.com/shin2012/pdf_slice.git
   cd pdf_slice
   ```

2. **웹 서버 실행**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # 또는 Node.js (http-server 설치 필요)
   npx http-server -p 8000
   
   # 또는 PHP
   php -S localhost:8000
   ```

3. **브라우저에서 열기**
   ```
   http://localhost:8000
   ```

### 방법 2: Docker를 이용한 실행

**사전 조건**: Docker와 Docker Compose가 설치되어 있어야 합니다.

```bash
# 저장소 복제
git clone https://github.com/shin2012/pdf_slice.git
cd pdf_slice

# Docker Compose로 실행
docker-compose up -d

# 컨테이너 접속 (선택사항)
docker exec -it pdfedit /bin/sh

# 중지
docker-compose down
```

> 📌 **주의**: `docker-compose.yml`에는 `npm_network`라는 외부 네트워크가 정의되어 있습니다. 이를 생성하거나 기존 네트워크를 사용하도록 수정하세요.

### 방법 3: Docker만 사용

```bash
docker run -d \
  --name pdf-slice \
  -p 8000:80 \
  -v $(pwd):/usr/share/nginx/html:ro \
  nginx:alpine
```

---

## 💻 사용 방법

### 1단계: PDF 업로드
- 업로드 영역을 클릭하거나 PDF 파일을 드래그하여 업로드합니다.
- 파일 크기가 50MB를 초과하면 경고 메시지가 표시됩니다.

### 2단계: 페이지 선택
- 각 페이지 카드를 클릭하여 선택/해제합니다.
- 선택한 카드는 파란 테두리와 체크 표시(✓)가 표시됩니다.

### 3단계: 페이지 다운로드
- **선택한 페이지 다운로드** 버튼을 클릭합니다.
- 새로운 PDF 파일이 `{원본파일명}_extracted.pdf` 이름으로 다운로드됩니다.

### 추가 기능
- **전체 선택**: 모든 페이지를 한 번에 선택
- **전체 해제**: 모든 선택을 취소
- **새 파일**: 다른 PDF 파일을 업로드하기 위해 초기화

---

## 🏗️ 프로젝트 구조

<details>
<summary><b>상세 구조</b></summary>

```
pdf_slice/
├── README.md                  # 이 파일
├── index.html                 # 메인 HTML 파일
├── app.js                      # 주요 로직 (JavaScript)
├── style.css                   # 스타일시트
├── docker-compose.yml          # Docker Compose 설정
├── .gitignore                  # Git 제외 파일 목록
├── lib/                        # 라이브러리 (로컬 폴백용)
│   ├── pdf.min.js             # PDF.js 라이브러리
│   ├── pdf.worker.min.js      # PDF.js Worker
│   └── pdf-lib.min.js         # PDF-lib 라이브러리
└── .git/                       # Git 저장소

```

</details>

### 핵심 파일 설명

| 파일명 | 설명 |
|-------|------|
| `index.html` | 사용자 인터페이스 (HTML 마크업) |
| `app.js` | 핵심 로직 (PDF 로딩, 썸네일 생성, 페이지 추출) |
| `style.css` | 반응형 디자인 및 스타일링 |
| `docker-compose.yml` | Docker 컨테이너 설정 |

---

## 🔧 기술 스택

### 프론트엔드 라이브러리

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| **pdf.js** | 3.11.174 | PDF 렌더링 및 페이지 표시 |
| **pdf-lib** | 1.17.1 | PDF 생성 및 페이지 추출 |

### 라이브러리 로드 전략

1. **CDN 우선**: CloudFlare CDN에서 최신 버전 로드
2. **로컬 폴백**: CDN 로드 실패 시 `lib/` 폴더의 로컬 파일 사용
3. **Worker 관리**: PDF.js Worker는 자동으로 CDN 또는 로컬에서 선택

<details>
<summary><b>라이브러리 초기화 로직</b></summary>

```javascript
// CDN 주소
pdf.js: https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js
pdf.worker: https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js
pdf-lib: https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js

// 로컬 폴백 위치
pdf.js: lib/pdf.min.js
pdf.worker: lib/pdf.worker.min.js
pdf-lib: lib/pdf-lib.min.js
```

</details>

---

## 🎨 UI/UX 특징

### 색상 팔레트

<details>
<summary><b>색상 정의</b></summary>

| 색상 역할 | 값 | 사용처 |
|---------|-----|-------|
| Primary (주색) | `#2563eb` | 버튼, 선택 표시 |
| Hover | `#1d4ed8` | Primary 호버 상태 |
| Background | `#f8fafc` | 페이지 배경 |
| Surface | `#ffffff` | 카드, 패널 |
| Text (주요) | `#0f172a` | 본문 텍스트 |
| Text (보조) | `#64748b` | 설명, 메타 정보 |
| Border | `#e2e8f0` | 경계선 |
| Danger | `#ef4444` | 위험 버튼 |
| Success | `#22c55e` | 성공 상태 |

</details>

### 반응형 레이아웃

- **데스크톱** (1200px+): 자동으로 계산된 그리드 칼럼
- **태블릿** (768px-1199px): 3-4개 열 그리드
- **모바일** (<768px): 버튼 전체 너비, 2열 그리드

---

## 📊 핵심 기능 설명

### PDF 로딩 프로세스

<details>
<summary><b>상세 로딩 절차</b></summary>

1. **파일 검증**
   - MIME 타입 확인 (`application/pdf`)
   - 파일 크기 확인 (50MB 초과 시 경고)

2. **Worker 초기화**
   - CDN Worker 연결 테스트
   - 실패 시 로컬 Worker로 자동 전환

3. **PDF 파싱**
   - `pdf.js`로 PDF 문서 로드
   - 총 페이지 수 계산

4. **썸네일 생성**
   - 배치 단위(5개)로 병렬 렌더링
   - UI 반응성을 위해 배치 사이에 10ms 대기
   - 각 페이지는 A4 종횡비(1:1.414)로 표시

5. **인터랙션 활성화**
   - 모든 카드에 클릭 이벤트 리스너 추가
   - 다운로드 버튼 활성화

</details>

### PDF 추출 및 다운로드

<details>
<summary><b>추출 알고리즘</b></summary>

1. **선택된 페이지 정렬**
   - 사용자 선택 순서와 무관하게 페이지 번호 순서로 정렬

2. **새 문서 생성**
   - `pdf-lib`을 이용해 빈 PDF 문서 생성

3. **페이지 복사**
   - 원본 PDF에서 선택된 페이지만 복사
   - 모든 메타데이터 유지

4. **파일 저장 및 다운로드**
   - 바이트 배열로 변환
   - Blob 객체 생성
   - 브라우저 다운로드 트리거

</details>

---

## 🔒 보안 및 프라이버시

✅ **클라이언트 측 처리**: 모든 PDF 처리가 사용자의 브라우저에서만 발생
✅ **파일 전송 없음**: 서버로 파일이 전송되지 않음
✅ **로컬 스토리지 미사용**: 개인 데이터가 저장되지 않음
✅ **HTTPS 권장**: 보안을 위해 HTTPS 환경 사용 권장

---

## ⚙️ 설정 및 커스터마이징

### 파일 크기 경고 임계값 변경

`app.js`에서 다음 라인을 수정합니다:

```javascript
// 현재: 50MB
const MAX_FILE_SIZE_WARNING = 50 * 1024 * 1024;

// 변경 예: 100MB로 변경
const MAX_FILE_SIZE_WARNING = 100 * 1024 * 1024;
```

### 그리드 열 수 조정

`style.css`에서 다음 라인을 수정합니다:

```css
/* 현재: 200px 최소 너비 */
.page-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

/* 변경 예: 250px로 더 크게 */
.page-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
```

### 썸네일 렌더링 품질 조정

`app.js`의 `renderThumbnailIntoCard` 함수에서:

```javascript
// 현재: 300px 너비 기준
const scale = 300 / viewport.width;

// 변경 예: 400px로 높은 품질
const scale = 400 / viewport.width;
```

---

## 🐛 트러블슈팅

<details>
<summary><b>자주 나오는 문제와 해결법</b></summary>

### 문제: "PDF 처리 라이브러리를 불러오지 못했습니다" 오류

**원인**: CDN에서 라이브러리 로드 실패 및 로컬 폴백도 누락

**해결 방법**:
```bash
# lib 폴더의 라이브러리 파일 확인
ls -la lib/

# 누락된 파일이 있으면 아래에서 다운로드
# https://cdnjs.com/libraries/pdf.js/3.11.174
# https://cdnjs.com/libraries/pdf-lib/1.17.1
```

### 문제: 큰 PDF 파일에서 브라우저 응답 없음

**원인**: 메모리 부족 또는 썸네일 동시 렌더링 과다

**해결 방법**:
```javascript
// app.js의 배치 크기 감소
const batchSize = 3; // 기본값 5에서 3으로 감소
```

### 문제: 다운로드된 PDF가 손상됨

**원인**: 드물게 pdf-lib 라이브러리 로드 실패

**해결 방법**:
1. 브라우저 캐시 삭제
2. 새로운 탭에서 시도
3. 다른 브라우저 사용

### 문제: "CDN Worker failed" 콘솔 메시지

**상태**: 정상 작동 (로컬 폴백으로 자동 전환됨)

**확인 방법**: 개발자 도구의 콘솔 탭에서 오류 없이 처리되는지 확인

</details>

---

## 📈 성능 최적화

### 썸네일 생성 최적화

- **배치 처리**: 5개씩 병렬 렌더링 (CPU 효율성)
- **비동기 처리**: UI 블로킹 방지
- **지연 로딩 없음**: 모든 페이지를 미리 로드

### 메모리 관리

- 원본 PDF 바이트 복제: 변조 방지
- Canvas 객체 재사용 불가 (각 페이지마다 신규 생성)
- 블롭 URL 수동 해제: 메모리 누수 방지

---

## 🔄 지원되는 PDF 기능

<details>
<summary><b>PDF 특성 지원 상황</b></summary>

| 기능 | 지원 | 비고 |
|-----|------|------|
| 기본 페이지 추출 | ✅ | 완전 지원 |
| 이미지 포함 | ✅ | 완전 유지 |
| 텍스트 | ✅ | 완전 유지 |
| 메타데이터 | ✅ | 기본 정보만 복사 |
| 북마크 | ⚠️ | 부분 지원 (pdf-lib 제한) |
| 폼 필드 | ⚠️ | 부분 지원 (pdf-lib 제한) |
| 주석 | ❌ | 미지원 |
| 암호화 | ❌ | 미지원 |
| 서명 | ❌ | 미지원 |

</details>

---

## 📝 라이선스

MIT License - [LICENSE](LICENSE) 파일 참고

---

## 🤝 기여 방법

1. Fork 저장소
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add AmazingFeature'`)
4. 브랜치 푸시 (`git push origin feature/AmazingFeature`)
5. Pull Request 오픈

---

## 🔗 관련 링크

- **📚 PDF.js 문서**: https://mozilla.github.io/pdf.js/
- **📦 PDF-lib 문서**: https://pdfme.js.org/
- **🐛 이슈 추적**: https://github.com/shin2012/pdf_slice/issues
- **💬 토론**: https://github.com/shin2012/pdf_slice/discussions

---

## ⭐ 도움이 되셨나요?

프로젝트가 유용하다면 GitHub에서 ⭐ 스타를 눌러주세요!

---

**마지막 업데이트**: 2026년 10월

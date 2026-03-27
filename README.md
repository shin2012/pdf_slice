# PDF Slice 📄✂️

**PDF Slice**는 사용자의 소중한 문서를 서버로 전송하지 않고, 오직 브라우저 내에서만 안전하게 처리하는 **100% 클라이언트 사이드 PDF 페이지 추출 도구**입니다.

## 🌟 핵심 컨셉: "Your Data, Your Browser"

대부분의 온라인 PDF 도구는 파일을 서버로 업로드하여 처리합니다. 하지만 **PDF Slice**는 다릅니다.

- **완벽한 프라이버시**: 선택한 PDF 파일은 절대 서버로 업로드되지 않습니다. 모든 연산(파싱, 렌더링, 추출)은 사용자의 웹 브라우저 메모리 내에서만 이루어집니다.
- **초고속 처리**: 서버 전송 및 응답 대기 시간이 없으므로, 파일 크기에 관계없이 즉각적인 작업이 가능합니다.
- **오프라인 지원**: 한 번 로드되면 인터넷 연결 없이도 PDF 페이지 추출 기능을 사용할 수 있습니다.
- **보안성**: 민감한 개인정보나 기밀 문서도 유출 걱정 없이 안전하게 편집할 수 있습니다.

## ✨ 주요 기능

- **드래그 앤 드롭**: 간편한 파일 업로드 인터페이스.
- **실시간 썸네일**: PDF의 모든 페이지를 고화질 썸네일로 미리 확인.
- **정밀한 선택**: 추출하고 싶은 페이지만 개별 선택하거나, 전체 선택/해제 기능 제공.
- **모던 UI**: 깔끔하고 직관적인 업무용 디자인.
- **대용량 대응**: 브라우저 성능을 고려한 배치(Batch) 렌더링 방식 채택.

## 🛠 기술 스택

- **Frontend**: Vanilla JS, HTML5, CSS3
- **PDF Engine**: [pdf.js](https://mozilla.github.io/pdf.js/) (Rendering), [pdf-lib](https://pdf-lib.js.org/) (Manipulation)
- **Deployment**: Docker (Nginx Alpine)

## 🚀 시작하기 (Docker)

이 프로젝트는 **Nginx Proxy Manager (NPM)** 환경에서 쉽게 구동되도록 설계되었습니다.

1. **저장소 클론**
   ```bash
   git clone https://github.com/shin2012/pdf_slice.git
   cd pdf_slice
   ```

2. **네트워크 생성 (필요 시)**
   ```bash
   docker network create npm_network
   ```

3. **컨테이너 실행**
   ```bash
   docker-compose up -d
   ```

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

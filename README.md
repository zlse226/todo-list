# Todo List

할 일을 추가하고 진행 상태를 관리하는 웹 서비스입니다.
할 일마다 메모와 이미지 한 장을 첨부할 수 있습니다.

## 링크

- 배포 사이트: https://todo-list-ashen-nu-98.vercel.app
- GitHub 저장소: https://github.com/zlse226/todo-list

## 사용 기술

- Next.js
- TypeScript
- CSS Modules

## 주요 기능

### 할 일 목록

- 할 일을 입력하고 버튼을 누르거나 Enter를 눌러 추가합니다.
- 진행 중인 할 일과 완료된 할 일을 나누어 보여줍니다.
- 체크 버튼으로 할 일의 상태를 변경합니다.

### 할 일 상세

- 할 일의 이름과 진행 상태를 수정합니다.
- 메모와 이미지 한 장을 추가하고 수정합니다.
- 이미지 파일의 영문 파일명과 5MB 이하 조건을 확인합니다.
- 수정 완료 또는 삭제 후 목록 페이지로 이동합니다.

### 공통 UI와 반응형

- 헤더, 버튼, 체크박스를 공용 컴포넌트로 사용합니다.
- 모바일, 태블릿, 데스크탑 화면에 맞춰 배치합니다.
- Figma 시안의 색상을 CSS 변수로 관리합니다.

## 프로젝트 구조

```text
todo-list/
├── app/
│   ├── components/          # 공용 헤더, 버튼, 체크박스
│   ├── items/
│   │   └── [itemId]/        # 할 일 상세 페이지
│   ├── globals.css          # 공통 색상과 전역 스타일
│   ├── layout.tsx           # 공통 레이아웃
│   ├── page.module.css      # 목록 페이지 스타일
│   └── page.tsx             # 할 일 목록 페이지
├── public/
│   └── images/              # 로고와 아이콘 등 이미지
├── package.json
└── README.md
```

## 실행 방법

프로젝트 폴더에서 패키지를 설치하고 개발 서버를 실행합니다.

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`에 접속합니다.

배포용 빌드는 다음 명령으로 확인할 수 있습니다.

```bash
npm run build
```

## 데이터 관리

과제에서 제공한 Todo List API를 사용합니다.
할 일 조회·추가·수정·삭제와 이미지 업로드를 API에 요청합니다.

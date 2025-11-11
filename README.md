# 🍦 Ice Adventure

Phaser 3 기반의 비행 슈팅 게임입니다.

## 🎮 게임 설명

플레이어는 아이스크림 캐릭터를 조작하여 장애물을 피하고, 코인을 수집하며, 보스를 물리쳐야 합니다.

## 🚀 시작하기

### 필요 조건

- Node.js (v14 이상 권장)
- npm

### 설치

```bash
# 저장소 클론
git clone https://github.com/jungwonyu/ice_adventure.git
cd ice_adventure

# 의존성 설치
npm install
```

### 개발 모드 실행

```bash
# JS 파일 변경 시 자동 빌드 (watch 모드)
npm run watch
```

그 다음 `index.html`을 브라우저로 열거나 Live Server로 실행하세요.

### 프로덕션 빌드

```bash
# JS 파일을 번들링하여 dist/js/game.js 생성
npm run build
```

## 🛠️ 기술 스택

- **게임 엔진**: Phaser 3.60.0
- **빌드 도구**: Vite 5.0
- **언어**: JavaScript (ES6+ Modules)

## 📦 프로젝트 구조

```
ice_adventure/
├── assets/          # 게임 리소스 (이미지, 사운드, 비디오)
├── css/             # 스타일시트
├── data/            # 게임 데이터 (퀴즈 등)
├── js/              # 소스 코드
│   ├── Main.js      # 게임 진입점
│   ├── Boot.js      # 리소스 로딩
│   ├── MenuScene.js # 메뉴 화면
│   ├── GameScene.js # 메인 게임
│   └── utils.js     # 유틸리티 함수
├── dist/            # 빌드 결과물 (자동 생성)
└── index.html       # 메인 HTML
```

## 🎯 주요 기능

- 플레이어 이동 및 총알 발사
- 다양한 장애물 (1회/2회 타격형)
- 아이템 수집 (코인, 쉴드, 더블 총알, 워키토키)
- 보스 전투 시스템
- 퀴즈 시스템
- 레벨 진행 시스템 (총 10레벨)
- 수리 및 부활 시스템

## 📝 개발 히스토리

- **초기 버전**: 순수 HTML + JS (CDN 방식)
- **현재 버전**: Vite 빌드 시스템 도입
  - JS 파일만 번들링하여 최적화
  - 개발 시 watch 모드로 자동 빌드
  - assets는 그대로 유지하여 관리 용이

## 🎮 게임 조작법

- **키보드**: 방향키로 이동
- **마우스/터치**: 드래그로 이동
- **자동 발사**: 총알은 자동으로 발사됩니다

## 📄 라이선스

MIT License

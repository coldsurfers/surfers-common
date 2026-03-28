# shared-utils: react subpath 추가 + useDebouncedCallback

## 목표

`@coldsurf/shared-utils/react` subpath를 신규 추가하고,
콜백 debounce 훅 `useDebouncedCallback`을 제공한다.

기존 `./next` subpath 패턴을 그대로 따른다.

## 현재 구조

```
packages/shared-utils/
  src/
    index.ts        — 메인 엔트리
    next/index.ts   — Next.js 전용 유틸
  next/
    index.d.ts      — moduleResolution: node 폴백 타입
  tsdown.config.ts  — index + next/index 빌드
  package.json
    exports: { ".", "./next" }
    peerDependencies: { jwt-decode, schema-dts, zod }
```

## 목표 구조

```
packages/shared-utils/
  src/
    react/
      index.ts          — useDebouncedCallback 훅
  react/
    index.d.ts          — moduleResolution: node 폴백 타입
```

## 체크리스트

### 소스

- [x] `src/react/index.ts` 생성
  - `useDebouncedCallback<T>(fn: T, delay: number)` 구현
  - `fnRef`로 stale closure 방지
  - `'use client'` 미사용 — RSC 외 환경에서 무의미, 소비자가 경계 관리

### 타입 폴백

- [x] `react/index.d.ts` 생성
  - `export * from '../dist/react'`
  - `moduleResolution: node` 환경 대응

### package.json 수정

- [x] `exports`에 `"./react"` 추가
- [x] `files`에 `"react"` 추가
- [x] `peerDependencies`에 `react: "^18.0.0 || ^19.0.0"` 추가 (optional)
- [x] `peerDependenciesMeta`에 `react: { optional: true }` 추가
- [x] `devDependencies`에 `react: ^19.1.0`, `@types/react: ^19.1.0` 추가

### tsdown.config.ts 수정

- [x] `react/index` 엔트리 추가

### tsconfig.json 수정

- [x] `paths`에 `"react": ["./node_modules/@types/react"]` 추가
  - `baseUrl: "."` + 로컬 `react/` 폴더 충돌로 인해 `import 'react'`가 로컬 index.d.ts로 잡히는 문제 해결

### 검증

- [x] `pnpm build` 빌드 성공
- [x] `pnpm check:type` 타입 에러 없음
- [ ] `billets-admin`의 `libs/hooks/use-debounced-callback.ts` →
      `@coldsurf/shared-utils/react`로 교체

---

## 변경 범위 요약

| 파일 | 변경 |
|------|------|
| `src/react/index.ts` | 신규 — useDebouncedCallback |
| `react/index.d.ts` | 신규 — 타입 폴백 |
| `package.json` | exports / files / peerDeps 수정 |
| `tsdown.config.ts` | react/index 엔트리 추가 |
| `apps/billets-admin/libs/hooks/use-debounced-callback.ts` | 삭제 후 패키지 import로 교체 |

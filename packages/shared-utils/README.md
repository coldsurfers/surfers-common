# @coldsurfers/shared-utils

Shared utilities for COLDSURF services.

## Install

`zod` is a required peer dependency.

### pnpm

```bash
pnpm add @coldsurfers/shared-utils zod
```

### npm

```bash
npm install @coldsurfers/shared-utils zod
```

### yarn

```bash
yarn add @coldsurfers/shared-utils zod
```

### bun

```bash
bun add @coldsurfers/shared-utils zod
```

## Optional peers

Install only when you use related utilities.

```bash
pnpm add jwt-decode schema-dts
```

## Feature -> dependency map

- `decodeJwt` (`utils.jwt`) uses `jwt-decode` at runtime.
- `NextMetadataGenerator` (`utils.metadata`) uses `schema-dts` types for JSON-LD typing.

## What to install by use case

- You only use date/slug/uuid/number/parser/file/location/uri utils:
```bash
pnpm add @coldsurfers/shared-utils zod
```
- You use `decodeJwt`:
```bash
pnpm add @coldsurfers/shared-utils zod jwt-decode
```
- You use `NextMetadataGenerator` / `generateLdJson` with `schema-dts` types:
```bash
pnpm add @coldsurfers/shared-utils zod schema-dts
```
- You use both JWT + metadata helpers:
```bash
pnpm add @coldsurfers/shared-utils zod jwt-decode schema-dts
```

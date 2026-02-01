/**
 * URL을 완전히 디코딩 (이중/삼중 인코딩 모두 해결)
 */
export function fullyDecodeURI(uri: string): string {
  let decoded = uri;
  let prevDecoded = '';

  // 더 이상 디코딩되지 않을 때까지 반복
  while (decoded !== prevDecoded) {
    prevDecoded = decoded;
    try {
      decoded = decodeURIComponent(decoded);
    } catch (e) {
      // 잘못된 URI 시퀀스면 중단
      break;
    }
  }

  return decoded;
}

/**
 * pathname만 디코딩 (프로토콜, 도메인은 유지)
 */
export function fullyDecodePathname(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.pathname = fullyDecodeURI(urlObj.pathname);
    return urlObj.toString();
  } catch {
    // URL 파싱 실패 시 전체 문자열 디코딩
    return fullyDecodeURI(url);
  }
}

/**
 * %가 포함되어 있는지 확인 (인코딩 여부 체크)
 */
export function isEncoded(str: string): boolean {
  return str.includes('%');
}

/**
 * 실제 double-encoding 여부 확인
 * 예: "%2525" => true
 *     "%25"   => false (단일 인코딩)
 */
export function isDoubleEncoded(str: string): boolean {
  // "%25"가 아닌 "%2525" 패턴을 찾아야 double-encoding
  return /%25(25)+/i.test(str);
}

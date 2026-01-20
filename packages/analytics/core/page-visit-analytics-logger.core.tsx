import { type PropsWithChildren, useEffect, useRef } from 'react';
import { useFirebaseAnalyticsContext } from './firebase-analytics-provider.core';
import type { FBLogEvent } from './models';

export const PageVisitAnalyticsLogger = ({
  children,
  event,
}: PropsWithChildren<{
  event: FBLogEvent;
}>) => {
  const { logEvent } = useFirebaseAnalyticsContext();
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    if (hasLoggedRef.current) return;
    hasLoggedRef.current = true;

    logEvent(event);
  }, [logEvent, event]);

  return children;
};

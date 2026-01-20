import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';
import type { FBLogEvent } from './models';

type FirebaseAnalyticsContextType = {
  logEvent: (event: FBLogEvent) => void;
};

const FirebaseAnalyticsContext = createContext<FirebaseAnalyticsContextType>({
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  logEvent: null!,
});

export const FirebaseAnalyticsProvider = ({
  children,
  logEvent,
}: PropsWithChildren<FirebaseAnalyticsContextType>) => {
  const value = useMemo(
    () => ({
      logEvent,
    }),
    [logEvent]
  );

  return (
    <FirebaseAnalyticsContext.Provider value={value}>
      {children}
    </FirebaseAnalyticsContext.Provider>
  );
};

export const useFirebaseAnalyticsContext = () =>
  useContext(FirebaseAnalyticsContext);

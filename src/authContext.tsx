import { FC, createContext, useContext, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "./firebaseApp";

export type TUser = {
  email: string;
};

type TAuthContext = {
  user: TUser | null;
};

type TAuthProvider = {
  children: React.ReactNode;
};

export const AuthCxt = createContext<TAuthContext>({} as TAuthContext);

export const LS_USER_EMAIL = "ls-user-email-test";
const SS_GAME_USER = "tic-tac--toe-user";

export const AuthProvider: FC<TAuthProvider> = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem(SS_GAME_USER) as string)
  );
  const authCtx = useMemo<TAuthContext>(() => ({ user }), [user]);

  if (isSignInWithEmailLink(auth, window.location.href)) {
    const email = window.localStorage.getItem(LS_USER_EMAIL);

    if (email) {
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          // Clear email from storage.
          window.localStorage.removeItem(LS_USER_EMAIL);
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
          const user = { email: result.user.email };
          sessionStorage.setItem(SS_GAME_USER, JSON.stringify(user));
          setUser(user);
        })
        .catch((error) => {
          console.error(error);
          notifications.show({
            message: "Error during signing in, try again.",
            color: "red",
          });
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
  }

  return <AuthCxt.Provider value={authCtx}>{children}</AuthCxt.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthCxt);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider!");
  }

  return context;
};

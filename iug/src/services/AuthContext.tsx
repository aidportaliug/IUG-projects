import { getAuth, User } from "firebase/auth";
import React, { useContext, useEffect } from "react";

type ContextState = { user: User | null };
const auth = getAuth();

const FirebaseAuthContext = React.createContext<ContextState | undefined>(
  undefined
);

interface AuthContextProps {
  children?: React.ReactNode;
}
const FirebaseAuthProvider = ({ children }: AuthContextProps) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const value = { user };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser != null) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);
  //What should we do here? Can also have a blank screen?
  if (loading) {
    return <div> loading</div>;
  }
  return (
    <FirebaseAuthContext.Provider value={value}>
      {!loading && children}
    </FirebaseAuthContext.Provider>
  );
};

function useFirebaseAuth() {
  const context = React.useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error(
      "useFirebaseAuth must be used within a FirebaseAuthProvider"
    );
  }
  return { user: context.user, isAuthenticated: context.user != null };
}

export { FirebaseAuthProvider, useFirebaseAuth };

export const useAuthState = () => {
  const auth = useContext(FirebaseAuthContext);
  return { ...auth, isAuthenticated: auth?.user != null };
};

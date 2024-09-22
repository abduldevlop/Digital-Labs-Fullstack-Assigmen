import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle, logOut } from "../../firebase";
import axios from "axios"; // Make sure to install axios if you haven't already

interface ApiContextType {
  user: User | null;
  handleGoogleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const result = await signInWithGoogle();
      const userToken = await result.user.getIdToken(); // Get the ID token
      setUser(result.user);

      // Send the token to the backend for verification and storage
      await axios.post(`${baseUrl}/api/login`, { token: userToken });
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <ApiContext.Provider value={{ user, handleGoogleLogin, handleLogout }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

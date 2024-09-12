import { jwtDecode } from "jwt-decode";
import { axiosClient } from "../utils/axiosClient";
import { useInactivity } from "../hooks/useInactivity";
import { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext({
  publicImages: [],
  setPublicImages: () => {},
  token: null,
  user: {
    id: null,
    name: null,
    email: null,
  },
  setToken: () => {},
  logout: () => {},
});

const getToken = () => localStorage.getItem("token");

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

const StateProvider = ({ children }) => {
  const [publicImages, setPublicImages] = useState([]);
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState({});
  const isInactive = useInactivity();

  const init = async () => {
    if (!token) return;

    const decoded = decodeToken(token);
    if (!decoded) {
      logout();
      return;
    }

    setUser({
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    });
    await verifyToken(token);
  };

  const verifyToken = async (token) => {
    if (!token) return;

    try {
      const { data } = await axiosClient.get("/verify");
      if (!data.success) {
        logout();
      }
    } catch (error) {
      logout();
      throw new Error("Token verification failed:", error);
    }
  };

  const refreshToken = async () => {
    const token = getToken();
    if (!token) return;

    const decoded = decodeToken(token);
    const now = Date.now() / 1000;
    const refreshThreshold = 90;

    if (now > decoded.exp - refreshThreshold) {
      try {
        const { data } = await axiosClient.get("/refresh");
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          init();
        } else {
          logout();
        }
      } catch (error) {
        logout();
        throw new Error("Token refresh failed:", error);
      }
    }
  };

  useEffect(() => {
    init();
  }, [token]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        verifyToken(token);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [token]);

  useEffect(() => {
    if (isInactive && token) {
      logout();
    }
  }, [isInactive, token]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshToken();
    }, 60000 * 3); // Refresh token every 3 minutes

    return () => clearInterval(intervalId);
  }, []);

  const logout = () => {
    axiosClient
      .get("/logout")
      .then(() => {
        setToken(null);
        setUser({});
        localStorage.removeItem("token");
      })
      .catch((err) => console.error("Logout error:", err))
      .finally(() => {
        localStorage.removeItem("token");
        init();
      });
  };

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        logout,
        setToken,
        publicImages,
        setPublicImages,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

const useStateContext = () => {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }

  return context;
};

export { StateProvider, useStateContext };

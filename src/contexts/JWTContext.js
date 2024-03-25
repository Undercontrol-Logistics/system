import { createContext, useEffect, useReducer } from "react";

import axios from "../utils/axios";
import { isValidToken, setSession } from "../utils/jwt";

// Note: If you're trying to connect JWT to your own backend, don't forget
// to remove the Axios mocks in the `/src/index.js` file.

const INITIALIZE = "INITIALIZE";
const SIGN_IN = "SIGN_IN";
const SIGN_OUT = "SIGN_OUT";
const SIGN_UP = "SIGN_UP";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  id: null,
  role: null,
};

const JWTReducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        id: action.payload.id,
        role: action.payload.role,
      };
    case SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case SIGN_UP:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  // console.log("cheguei no auth provider");

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.get(
            "http://diesel.api.undercontrol.tech/login/login.php"
          );
          const { user } = response.data;

          console.log(user);

          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const signIn = async (email, password) => {
    // console.log("cheguei no sign in");

    const response = await axios.post(
      "https://diesel.api.undercontrol.tech/login/login.php",
      {
        email,
        password,
      }
    );
    const { accessToken, id, user, role } = response.data;
    setSession(accessToken);
    dispatch({
      type: SIGN_IN,
      payload: {
        user,
        id,
        role,
      },
    });
  };

  const signOut = async () => {
    setSession(null);
    dispatch({ type: SIGN_OUT });
  };

  const signUp = async (email, password, firstName, lastName) => {
    try {
      const response = await axios.post(
        "https://diesel.api.undercontrol.tech/login/register.php",
        {
          username: email, // Ajuste para o campo esperado pelo backend (username)
          password,
          firstName,
          lastName,
        }
      );

      const { token } = response.data;

      window.localStorage.setItem("accessToken", token); // Salvando o token no localStorage
      dispatch({
        // Supondo que dispatch seja passado como argumento ou esteja disponível no escopo
        type: SIGN_UP,
        payload: {
          token,
        },
      });
    } catch (error) {
      // Lidar com erros de requisição
      console.error("Error during sign up:", error);
      // Aqui você pode decidir como lidar com o erro, como exibir uma mensagem de erro para o usuário
    }
  };

  const resetPassword = (email) => console.log(email);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        signIn,
        signOut,
        signUp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

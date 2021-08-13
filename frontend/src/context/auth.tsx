import { createContext } from 'react';
type State = {
  authenticated: boolean;
  user: User | undefined;
};

type Action<T> = {
  type: string;
  payload: T;
};

const AuthContext = createContext<State>({
  authenticated: false,
  user: null,
});

const DispatContext = createContext(null);

const reducer = (state: State, { type, payload }: Action<User>) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
  }
};

import { createContext, useReducer, Dispatch, ReactNode } from 'react'

interface IState {
  latLong: string;
  coffeeStores: any[]; // Replace 'any[]' with the actual type of coffeeStores data if possible
}

interface IAction {
  type: string;
  payload: {
    latLong?: string;
    coffeeStores?: any[]; // Replace 'any[]' with the actual type of coffeeStores data if possible
  };
}
interface StoreProviderProps {
  children: ReactNode;
}

export const StoreContext = createContext<{ state: IState; dispatch: Dispatch<IAction> }>({
  state: { latLong: "", coffeeStores: [] },
  dispatch: () => {},
});

export const ACTION_TYPES = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES"
}
const storeReducer = (state: IState, action: IAction): IState => {
  switch(action.type){
    case ACTION_TYPES.SET_LAT_LONG: {
      return { ...state, latLong: action.payload.latLong || ""}
    }
    case ACTION_TYPES.SET_COFFEE_STORES: {
      return { ...state, coffeeStores: action.payload.coffeeStores || []}
    }
    default:
      throw new Error(`Error action type: ${action.type}`)
  }
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const initialState: IState = {
    latLong: "",
    coffeeStores: []
  }

  const [state, dispatch] = useReducer(storeReducer, initialState)
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
  }

export default StoreProvider
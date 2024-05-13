import { createStore } from "redux";
import layoutReducer from "./reducers/layoutReducer";

const enhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
const store = createStore(layoutReducer, enhancer())

export default store
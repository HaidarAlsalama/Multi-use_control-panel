import { combineReducers } from "redux";
import layoutReducer from "./layoutReducer";
import notificationReducer from "./notificationReducer";

export default combineReducers({
    layout: layoutReducer,
    notification: notificationReducer
})
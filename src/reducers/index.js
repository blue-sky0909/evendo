import { combineReducers } from "redux";
import login from "./login";
import order from "./order";

export default function getRootReducer(navReducer) {
    return combineReducers({
        nav: navReducer,
        login: login,
        order: order
    });
}

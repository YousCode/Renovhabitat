import { createStore, combineReducers } from "redux";
import {configureStore} from '@reduxjs/toolkit'
import reducers from "./reducers";

export default configureStore({ reducer: reducers });

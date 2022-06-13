import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Board } from './board';
import { Home } from "./home";
import { Thread } from "./thread";
import { List } from "./list";
import Urbit from '@urbit/http-api';
import './index.css'

const api = new Urbit('', '', window.desk);
window.api = api;
api.ship = window.ship;

export function App() {
  return (
  <BrowserRouter basename="/apps/channel">
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/board/:ship/:board" element={<Board/>}/>
      <Route path="/thread/:ship/:board/:index" element={<Thread/>}/>
      <Route path="/list/:ship/:board" element={<List/>}/>
    </Routes>
  </BrowserRouter>
  )
}
;
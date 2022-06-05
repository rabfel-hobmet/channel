import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Board } from './board'
// import your route components too

export function App() {
  const relative = "/apps/channel"
  return (
  <BrowserRouter>
    <Routes>
      <Route path={`${relative}/board/:ship/:board`} element={<Board/>}/>
    </Routes>
  </BrowserRouter>
  )
}
;
import React, { useEffect} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Board } from './board';
import { Home } from "./home";
import { Thread } from "./thread";
import { List } from "./list";
import { api } from "./state/api";
import useStorageState from "./state/storage";
import { useFileStore } from "./state/useFileStore";
import './index.css'

export function App() {
  const { s3 } = useStorageState();
  const credentials = s3.credentials;
  const { client, createClient, getFiles } = useFileStore();
  useEffect(() => {
    async function init() {
      useStorageState.getState().initialize(api);
    }

    init();
  }, []);

  useEffect(() => {
    const hasCredentials =
      credentials?.accessKeyId &&
      credentials?.endpoint &&
      credentials?.secretAccessKey;
    if (hasCredentials) {
      createClient(credentials);

      useStorageState.setState({ hasCredentials: true });
      console.log("client initialized");
    }
  }, [credentials]);

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
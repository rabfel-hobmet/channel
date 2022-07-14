// @ts-nocheck
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Board } from "./board";
import { Home } from "./home";
import { Thread } from "./thread";
import { List } from "./list";
import { Catalog } from "./catalog";
import { api } from "./state/api";
import useStorageState from "./state/storage";
import { useFileStore } from "./state/useFileStore";
import "./index.css";

export function App() {
  const [providers, setProviders] = useState<string[]>([]);
  const [boards, setBoards] = useState([]);
  const { s3 } = useStorageState();
  const credentials = s3.credentials;
  const { createClient } = useFileStore();

  useEffect(() => {
    async function init() {
      useStorageState.getState().initialize(api);
      addEventListener('beforeunload', e => {
        api.reset()
      })
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
    }
  }, [credentials]);

  useEffect(() => {
    const init = async () => {
      const providers = await api.scry({
        app: "channel-client",
        path: "/providers",
      });
      setProviders(providers["providers"]);
    };
      init();
  }, [api]);

  useEffect(() => {
    const init = async () => {
      const bards = [];
      const newBoards = await providers.reduce((prevPromise, nextBoard) => {
        return prevPromise.then(async () => {
          return bards.push({ship: nextBoard, boards: await window.api.scry({ app: "channel-client", path: `/boards/${nextBoard}`}).then((res) => res.boards)})
        })
      }, Promise.resolve())
        setBoards(bards);
    };
    init();
  }, [providers, api]);

  return (
    <BrowserRouter basename="/apps/channel">
      <Routes>
        <Route path="/" element={<Home providers={providers} boards={boards}/>} />
        <Route path="/board/:ship/:board" element={<Board boards={boards} />} />
        <Route path="/thread/:ship/:board/:index" element={<Thread boards={boards} />} />
        <Route path="/list/:ship/:board" element={<List boards={boards} />} />
        <Route path="/catalog/:ship/:board" element={<Catalog boards={boards} />} />
      </Routes>
    </BrowserRouter>
  );
}

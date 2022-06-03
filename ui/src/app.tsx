import React, { useEffect, useState } from 'react';
import Urbit from '@urbit/http-api';
import { graph } from '@urbit/api';


const api = new Urbit('', '', window.desk);
api.ship = window.ship;

export function App() {
  const [latest, setLatest] = useState("");
  const [msg, setMsg] = useState({});

  useEffect(() => {
    async function init() {
    const { latest } = await (api.scry({app: "channel-client", path: "/latest/~zod/b"}));
    setLatest(latest);
    }

    init();
  }, []);

  useEffect(() => {
    async function init() {
      const msg = await api.scry({app: "graph-store", path: `/graph/~zod/b/depth-first/26/${latest + 1}`})
      console.log(msg["graph-update"]["add-nodes"]);
      setMsg(msg["graph-update"]["add-nodes"]);
    };

    if (latest !== "") {
      init();
    }
  }, [latest])

  return (
    <main className="flex flex-col items-left justify-center min-h-screen">
      {Object.entries(msg?.nodes || {}).filter((each) => each[0].includes("/1/1")).sort((a, b) => a[1]?.post?.["time-sent"] - b[1]?.post?.["time-sent"]).reverse().map((each) => {
        return <p className="p-8 bg-gray-200 my-2 max-w-prose w-full">{each[1]?.post?.contents?.[1].text}</p>
      })}
    </main>
  );
}

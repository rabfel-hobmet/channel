import React, { useEffect, useState } from 'react';
import Urbit from '@urbit/http-api';


const api = new Urbit('', '', window.desk);
api.ship = window.ship;

export function App() {
  const [msg, setMsg] = useState();

  useEffect(() => {
    async function init() {
    const message = await api.scry({app: "graph-store", path: "/graph/~zod/b/depth-first/25"})
    console.log(message)
    }

    init();
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen">

    </main>
  );
}

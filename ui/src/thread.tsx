import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { graph, decToUd } from '@urbit/api';

export function Thread() {
  const [thread, setThread] = useState([]);
  const [op, setOp] = useState();
  const [reply, setReply] = useState("");
  const {ship, board, index} = useParams();

  useEffect(() => {
    async function init() {
      console.log(index)
      const msg = await window.api.scry(graph.getNode(ship, board, `/${index}`));
      console.log(msg)
      Object.entries(msg["graph-update"]["add-nodes"]["nodes"]).map(([key, value]) => {
        const op = value["children"][1]["children"][1]["post"]["contents"][1].text;
        setOp(op);
      });
    };
    init()
  }, [ship, board, index])

  const submitReply = () => {
    console.log({
      app: "channel-client",
      mark: "channel-stacy",
      json: {
          "add-poast": {
            "maybe-index": index,
            message: [{text: reply}],
              image: null,
              ship: ship,
              board: board
          }
      }
  })
      return window.api.poke({
          app: "channel-client",
          mark: "channel-stacy",
          json: {
              "add-poast": {
                  "maybe-index": index,
                  message: [{text: reply}],
                  image: null,
                  ship: ship,
                  board: board
              }
          }
      })
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <p>{op}</p>
      <textarea className="border p-2 border-black rounded-xl max-w-prose" onChange={e => setReply(e.target.value)}/>
      <button className="bg-gray-100 rounded-xl max-w-prose p-2" onClick={submitReply}>submit</button>
    </main>
  );
}

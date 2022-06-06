import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { graph } from '@urbit/api';
import { Link } from 'react-router-dom';

export function Thread() {
  const [thread, setThread] = useState({});
  const [op, setOp] = useState();
  const [reply, setReply] = useState("");
  const {ship, board, index} = useParams();

  useEffect(() => {
    async function init() {
      const msg = await window.api.scry(graph.getNode(ship, board, `/${index}`));
      Object.entries(msg["graph-update"]["add-nodes"]["nodes"]).map(([key, value]) => {
        const op = value["children"][1]["children"][1]["post"];
        setOp(op);
        const thread = value["children"][2]["children"];
        setThread(thread);
      });
    };
    init()
  }, [ship, board, index])

  const submitReply = () => {
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
      }).then(() => location.reload())
  }

  return (
    <main className="flex flex-col items-left space-y-8 justify-center min-h-screen px-4">
      <Link className="text-4xl font-bold max-w-fit bg-ridge-yellow my-4 p-2 border border-black" to={`/board/${ship}/${board}`}>BACK TO BOARD</Link>
      <p className="bg-black text-ridge-yellow w-fit py-4 px-32 flex items-start">{op?.["contents"]?.[1]?.text}</p>
      {Object.entries(thread || {}).map(([key, value]) => {
        return <p className="ml-16 py-8 border-y border-black w-full max-w-prose">{value?.children?.[1]?.post?.contents[0].text}</p>
      })}
      <div className="flex space-x-4">
      <textarea className="border p-2 basis-5/6 border-black rounded-xl max-w-prose bg-ridge-yellow" onChange={e => setReply(e.target.value)}/>
      <button className="bg-black basis-1/10 text-ridge-yellow border-2 border-black rounded-xl max-w-prose p-2" onClick={submitReply}>submit</button>
      </div>
    </main>
  );
}

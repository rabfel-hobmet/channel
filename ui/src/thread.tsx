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
    <main className="flex flex-col items-left px-4 space-y-3 justify-start min-h-screen">
        <ul className="flex my-3 pl-9 divide-x-2">
          <li className='px-3'> <Link to={`/board/${ship}/${board}`} className="text-2xl font-bold text-link-blue hover:text-link-hover hover:underline">back to /{board}/</Link></li>
          <li className='px-3'> <Link to={`/list/${ship}/${board}`} className="text-2xl font-bold text-link-blue hover:text-link-hover hover:underline">thread list</Link> </li>
          <li className='px-3'> <h2 className="text-link-blue text-2xl">catalog</h2> </li>
        </ul>
      <hr/>
      <p className="py-3 px-6 outline outline-1 bg-chan-element max-w-prose flex">{op?.["contents"]?.[1]?.text}</p>
      {Object.entries(thread || {}).map(([key, value]) => {
        return <p className="py-3 px-6 outline outline-1 max-w-prose">{value?.children?.[1]?.post?.contents[0].text}</p>
      })}
      
      <div className="grid gap-3">
        <textarea className="outline outline-1 p-3 max-w-prose bg-chan-bg max-h-56 h-24" onChange={e => setReply(e.target.value)}/>
        <button className="outline outline-1 outline-gray-300 p-2 bg-chan-element text-chan-red max-w-fit" onClick={submitReply}>post</button>
      </div>
      <hr/>
    </main>
  );
}

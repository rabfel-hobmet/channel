import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { graph } from '@urbit/api';
import { Link } from 'react-router-dom';
import PostBox from './components/postbox';

export function Thread() {
  const [thread, setThread] = useState({});
  const [op, setOp] = useState();
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
  }, [ship, board, index]);

  return (
    <main className="flex flex-col items-left px-4 space-y-3 justify-start min-h-screen">
        <ul className="flex my-3 pl-9 divide-x-2">
          <li className='px-3'> <Link to={`/board/${ship}/${board}`} className="text-2xl font-bold text-link-blue hover:text-link-hover hover:underline">back to /{board}/</Link></li>
          <li className='px-3'> <Link to={`/list/${ship}/${board}`} className="text-2xl font-bold text-link-blue hover:text-link-hover hover:underline">thread list</Link> </li>
          <li className='px-3'> <h2 className="text-link-blue text-2xl">catalog</h2> </li>
        </ul>
      <hr/>
      <div className="py-3 outline outline-1 bg-chan-element max-w-prose">
      <p className="py-3 px-6 flex">{op?.["contents"]?.[1]?.text}</p>
      <p className="text-right px-6 text-chan-red font-semibold">{new Date(op?.["time-sent"]).toLocaleString()}</p>
      </div>
      {Object.entries(thread || {}).sort(([aKey, aValue], [bKey, bValue]) => {
        return aValue?.post?.["time-sent"] > bValue?.post?.["time-sent"] ? 1 : -1
      }).map(([key, value]) => {
        return <div className="ml-8 flex flex-col outline outline-1 max-w-prose"><div className="p-3 flex space-x-2">{value?.children?.[1].post?.contents.map((obj) => {
          switch(Object.keys(obj)[0]) {
            case "url":
              return <a target="_blank" href={obj["url"]}><img className="object-contain max-h-24" src={obj["url"]}/></a>
            case "text":
              return <p className="">{obj["text"]}</p>
          }
        })}
        </div><p className="bg-chan-border text-chan-bg font-bold pr-2 text-right text-xs">{new Date(value?.post?.["time-sent"]).toLocaleString()}</p></div>
      })}
      <hr/>
      <PostBox index={index} ship={ship} board={board}/>
    </main>
  );
}

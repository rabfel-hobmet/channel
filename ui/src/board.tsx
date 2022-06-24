import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { graph } from '@urbit/api';
import { Link } from 'react-router-dom';
import PostBox from './components/postbox';

export function Board() {
  const [boardContent, setBoard] = useState([]);
  const {ship, board} = useParams();

  useEffect(() => {
    async function init() {
      const msg = await window.api.scry({app: "channel-client", path: `/get-nodes/${ship}/${board}/0`})
      console.log(await window.api.scry(graph.getGraph(ship, board)))
      setBoard(msg["page"].map((each) => {
        const index = Object.keys(each["graph-update"]["add-nodes"]["nodes"])[0];
        return each?.["graph-update"]?.["add-nodes"]?.["nodes"]?.[index]["children"][1]["children"][1]["post"]}
        ));
    };
    init()
  }, [ship, board])

  return (
    <main className="flex flex-col items-left px-4 space-y-3 justify-start min-h-screen">
        <ul className="flex my-3 pl-9 divide-x-2">
          <li className='px-3'> <h2 className="text-chan-red text-2xl">/{board}/</h2> </li>
          <li className='px-3'> <Link to={`/list/${ship}/${board}`} className="text-2xl font-bold text-link-blue hover:text-link-hover hover:underline">thread list</Link> </li>
          <li className='px-3'> <h2 className="text-link-blue text-2xl">catalog</h2> </li>
          <li className='px-3'> <Link to="/" className="text-2xl font-bold text-link-blue hover:text-link-hover hover:underline">home</Link> </li>
        </ul>
      <hr/>
      <div>{boardContent.map((each) => {
        return <React.Fragment key={each["index"]}><Link to={`/thread/${ship}/${board}/${each["index"].slice(0, -4)}`}>
          <p className="p-3 outline outline-1 outline-black border-b-4 border-chan-border bg-chan-element hover:text-link-hover hover:underline my-3 max-w-prose">{each["contents"][1].text}</p>
          </Link><hr/></React.Fragment>
      })}</div>
        <PostBox index={null} ship={ship} board={board}/>
    </main>
  );
}

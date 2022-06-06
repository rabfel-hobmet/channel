import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

export function Board() {
  const [boardContent, setBoard] = useState([]);
  const {ship, board} = useParams();

  useEffect(() => {
    async function init() {
      const msg = await window.api.scry({app: "channel-client", path: `/get-nodes/${ship}/${board}`})
      setBoard(msg["page"].map((each) => {
        const index = Object.keys(each["graph-update"]["add-nodes"]["nodes"])[0];
        return each?.["graph-update"]?.["add-nodes"]?.["nodes"]?.[index]["children"][1]["children"][1]["post"]}
        ));
    };
    init()
  }, [ship, board])

  return (
    <main className="flex flex-col items-left px-4 justify-center min-h-screen">
      <Link to="/"><h2 className="text-4xl font-bold max-w-fit bg-ridge-yellow my-4 p-2 border border-black">BACK TO BOARDS</h2></Link>
      <p>{boardContent.map((each) => {
        console.log(each)
       return <Link to={`/thread/${ship}/${board}/${each["index"].slice(0, -4)}`}><p className="p-4 bg-black border-4 border-double border-ridge-yellow text-ridge-yellow my-2 max-w-prose">{each["contents"][1].text}</p></Link>
      })}</p>
    </main>
  );
}

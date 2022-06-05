import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

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
    <main className="flex flex-col items-left justify-center min-h-screen">
      <p>{boardContent.map((each) => {
        console.log(each)
       return each["contents"][1].text 
      })}</p>
    </main>
  );
}

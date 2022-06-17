import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

export function List() {
  const [boardContent, setBoard] = useState([]);
  const {ship, board} = useParams();

  useEffect(() => {
    async function init() {
      const msg = await window.api.scry({app: "channel-client", path: `/get-nodes/${ship}/${board}/0`})
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
          <li className='px-3'> <Link to={`/board/${ship}/${board}`} className="text-2xl font-bold text-link-blue hover:text-link-hover hover:underline">/{board}/</Link> </li>
          <li className='px-3'> <h2 className="text-chan-red text-2xl">thread list</h2> </li>
          <li className='px-3'> <h2 className="text-link-blue text-2xl">catalog</h2> </li>
          <li className='px-3'> <Link to="/" className="text-2xl font-bold text-link-blue hover:text-link-hover hover:underline">home</Link> </li>
        </ul>
      <hr/>

      <table className='table-auto max-w-2xl text-left my-3'>
        <thead>
          <tr><th>#</th><th>topic</th><th>replies</th><th>last update</th></tr>
        </thead>
        <tbody>{boardContent.map((each) => {
            console.log(each)
            var date = new Date(each["time-sent"]).toLocaleString()
            return <tr className=' hover:bg-yellow-100 even:bg-chan-element odd:bg-chan-element-alt'>
                        <td>0</td>
                        <td><Link to={`/thread/${ship}/${board}/${each["index"].slice(0, -4)}`} className='text-link-blue hover:text-link-hover hover:underline'>{each["contents"][1].text}</Link></td>
                        <td>0</td>
                        <td>{date}</td>
                  </tr>
          })}
        </tbody>
      </table>
    </main>
  );
}
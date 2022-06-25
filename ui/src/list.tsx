import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

export function List() {
  const [boardPosts, setBoardPosts] = useState([]);
  const {ship, board} = useParams();

  useEffect(() => {
    async function init() {
      const msg = await window.api.scry({app: "channel-client", path: `/get-nodes/${ship}/${board}/0`})
      setBoardPosts(msg["page"].map((each) => {
        const index = Object.keys(each["graph-update"]["add-nodes"]["nodes"])[0];
        const node = each?.["graph-update"]?.["add-nodes"]?.["nodes"]?.[index];
        return { post: node["children"][1]["children"][1]["post"], thread: node["children"][2]["children"] }
      }));
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

      <table className='table-auto max-w-3xl text-left my-3'>
        <thead>
          <tr><th>topic</th><th>replies</th><th>last updated</th></tr>
        </thead>
        <tbody>{boardPosts.map((each) => {
            var replies = each.thread == null ? 0 : Object.keys(each?.thread).length;
            var latestUpdate = replies === 0 ? each.post["time-sent"] : Math.max(... Object.values(each.thread).map(e => { return e.post["time-sent"] }))
            var substrPost;
            {each.post.contents.slice(1).map((obj) => {
              switch(Object.keys(obj)[0]) {
                case "text": substrPost = obj["text"].substring(0, 65)
              }})}

            return <tr className=' hover:bg-yellow-100 even:bg-chan-element odd:bg-chan-element-alt'>
                        <td><Link to={`/thread/${ship}/${board}/${each.post["index"].slice(0, -4)}`} className='text-link-blue hover:text-link-hover hover:underline'>{substrPost}</Link></td>
                        <td>{replies}</td>
                        <td>{new Date(latestUpdate).toLocaleString()}</td>
                  </tr>
          })}
        </tbody>
      </table>
    </main>
  );
}
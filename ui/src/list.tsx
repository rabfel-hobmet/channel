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
        const post = node["children"][1]["children"][1]["post"];
        const thread = node["children"][2]["children"];
        let replies = thread == null ? 0 : Object.keys(thread).length;
        let latestUpdate = replies === 0 ? post["time-sent"] : Math.max(... Object.values(thread).map(e => { return e?.post["time-sent"] }))
        return { post: post, thread: thread, replies: replies, latestUpdate: latestUpdate }
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

      <table className='table-auto max-w-2xl text-left my-3'>
        <thead>
          <tr><th>topic</th><th>replies</th><th>last updated</th></tr>
        </thead>
        <tbody>{Object.values(boardPosts || {}).sort((aValue, bValue) => {
          return aValue?.latestUpdate < bValue?.latestUpdate ? 1 : -1
        }).map((each) => {
            let extractedText;
            {each.post.contents.slice(1).map((obj) => {
              switch(Object.keys(obj)[0]) {
                case "text": extractedText = obj["text"]
              }})}

            return <tr className=' hover:bg-yellow-100 even:bg-chan-element odd:bg-chan-element-alt'>
                        <td><div className='w-96 truncate'><Link to={`/thread/${ship}/${board}/${each.post["index"].slice(0, -4)}`} className='text-link-blue hover:text-link-hover hover:underline'>{extractedText}</Link></div></td>
                        <td>{each.replies}</td>
                        <td>{new Date(each.latestUpdate).toLocaleString()}</td>
                  </tr>
          })}
        </tbody>
      </table>
    </main>
  );
}
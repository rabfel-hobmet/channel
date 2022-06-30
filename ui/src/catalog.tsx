import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { graph } from '@urbit/api';
import { Link } from 'react-router-dom';
import ChannelNav from './components/navbar';

export function Catalog() {
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

      return(
          <main className='flex flex-col items-left px-4 space-y-3 justify-start min-h-screen'>
              <ChannelNav ship={ship} board={board}/>
              <hr/>
          </main>
      );
}
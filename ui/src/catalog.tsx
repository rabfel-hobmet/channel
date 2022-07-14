// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import ChannelNav from "./components/navbar";
import PostBox from "./components/postbox";

export function Catalog({boards}) {
  const [boardPosts, setBoardPosts] = useState([]);
  const { ship, board } = useParams();

  useEffect(() => {
    async function init() {
      const msg = await window.api.scry({
        app: "channel-client",
        path: `/get-nodes/${ship}/${board}/0`,
      });
      setBoardPosts(
        msg["page"].map((each) => {
          const index = Object.keys(
            each["graph-update"]["add-nodes"]["nodes"]
          )[0];
          const node =
            each?.["graph-update"]?.["add-nodes"]?.["nodes"]?.[index];
          const post = node["children"][1]["children"][1]["post"];
          const thread = node["children"][2]["children"];
          let replies = thread == null ? 0 : Object.keys(thread).length;
          let latestUpdate =
            replies === 0
              ? post["time-sent"]
              : Math.max(
                  ...Object.values(thread).map((e) => {
                    return e?.post["time-sent"];
                  })
                );
          return {
            post: post,
            thread: thread,
            replies: replies,
            latestUpdate: latestUpdate,
          };
        })
      );
    }
    init();
  }, [ship, board]);

  return (
    <main className="flex flex-col items-left px-4 space-y-3 justify-start min-h-screen">
      <ChannelNav ship={ship} board={board} boards={boards} />
      <PostBox index={null} ship={ship} board={board} className="self-center"/>
      <div className="self-center flex flex-wrap gap-9 max-w-full justify-center items-center">
        {Object.values(boardPosts || {})
          .sort((a, b) => {
            return a?.latestUpdate < b?.latestUpdate ? 1 : -1;
          })
          .map((each) => {
            let op_url;
            let op_text;
            {
              each.post.contents?.slice(1).map((obj) => {
                switch (Object.keys(obj)[0]) {
                  case "url":
                    op_url = obj["url"];
                  case "text":
                    op_text = obj["text"];
                }
              });
            }

            return (
              each.post.contents && (
                <Link
                  to={`/thread/${ship}/${board}/${each.post["index"]?.slice(
                    0,
                    -4
                  )}`}
                  className="hover:bg-chan-element"
                  key={`op-${each.post["index"]}`}
                >
                  <div className="m-9 max-w-xs">
                    <img
                      className="object-contain max-h-32 drop-shadow-sm mx-auto"
                      src={op_url}
                    />
                    <div key="content-container" className="text-center">
                      <p>R:{each.replies}</p>
                      <p className="truncate">{op_text}</p>
                    </div>
                  </div>
                </Link>
              )
            );
          })}
      </div>
    </main>
  );
}

// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { graph, deSig } from "@urbit/api";
import { Link } from "react-router-dom";
import PostBox from "./components/postbox";
import ChannelNav from "./components/navbar";

export function Board() {
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

  const deleteThread = (index) => {
    window.api
      .poke({
        app: "graph-store",
        mark: "graph-update-3",
        json: {
          "remove-posts": {
            resource: {
              ship: ship,
              name: board,
            },
            indices: [index],
          },
        },
      })
      .then(() => location.reload());
  };

  return (
    <main className="flex flex-col items-left px-4 space-y-3 justify-start min-h-screen">
      <ChannelNav ship={ship} board={board} />
      <hr />

      {Object.values(boardPosts || {})
        .sort((aValue, bValue) => {
          return aValue?.latestUpdate < bValue?.latestUpdate ? 1 : -1;
        })
        .map((each, i) => {
          let op_url;
          let op_text;
          {
            each?.post?.contents?.slice(1).map((obj) => {
              switch (Object.keys(obj)[0]) {
                case "url":
                  op_url = obj["url"];
                case "text":
                  op_text = obj["text"];
              }
            });
          }
          return (
            each?.post?.contents && (
              <React.Fragment key={`${each["index"]}-${i}`}>
                <div
                  className="my-3 space-x-2 flex"
                  key={`op-${each["index"]}`}
                >
                  <a target="_blank" href={op_url}>
                    <img className="object-contain max-h-48" src={op_url} />
                  </a>
                  <div key={`container-${each["index"]}`}>
                    <div
                      className="gap-2 inline-flex"
                      key={`thread-${each["index"]}`}
                    >
                      <p>
                        {new Date(each?.post?.["time-sent"]).toLocaleString()}
                      </p>
                      <Link
                        to={`/thread/${ship}/${board}/${each?.post[
                          "index"
                        ]?.slice(0, -4)}`}
                        className="text-link-blue hover:text-link-hover hover:underline"
                      >
                        [visit thread]
                      </Link>
                      {deSig(window.ship) === deSig(ship) && (
                        <span
                          className="text-chan-red cursor-pointer hover:underline"
                          onClick={() => deleteThread(each?.post["index"])}
                        >
                          [delete thread]
                        </span>
                      )}
                    </div>
                    <p key={`text-${each["index"]}`} className="">
                      {op_text}
                    </p>
                  </div>
                </div>

                {each?.post?.contents &&
                  Object.values(each.thread || {})
                    .sort((a, b) => {
                      return a.post["time-sent"] > b.post["time-sent"] ? 1 : -1;
                    })
                    .slice(-3)
                    .map((value, i) => {
                      return (
                        <div
                          key={`div-${i}`}
                          className="ml-3 flex flex-col outline outline-1 max-w-prose"
                        >
                          <div className="p-3 flex space-x-2">
                            {value?.children?.[1].post?.contents.map(
                              (obj, i) => {
                                switch (Object.keys(obj)[0]) {
                                  case "url":
                                    return (
                                      <a
                                        key={`a-${i}`}
                                        target="_blank"
                                        href={obj["url"]}
                                      >
                                        <img
                                          className="object-contain max-h-48"
                                          src={obj["url"]}
                                        />
                                      </a>
                                    );
                                  case "text":
                                    return <p key={`p-${i}`}>{obj["text"]}</p>;
                                }
                              }
                            )}
                          </div>
                          <p className="bg-chan-border text-chan-bg font-bold pr-2 text-right text-xs">
                            {new Date(
                              value?.post?.["time-sent"]
                            ).toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                <hr />
              </React.Fragment>
            )
          );
        })}
      <PostBox index={null} ship={ship} board={board} />
    </main>
  );
}

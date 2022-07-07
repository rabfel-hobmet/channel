import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { graph } from "@urbit/api";
import PostBox from "./components/postbox";
import ChannelNav from "./components/navbar";

export function Thread() {
  const [thread, setThread] = useState({});
  const [op, setOp] = useState();
  const { ship, board, index } = useParams();

  useEffect(() => {
    async function init() {
      const msg = await window.api.scry(
        graph.getNode(ship, board, `/${index}`)
      );
      Object.entries(msg["graph-update"]["add-nodes"]["nodes"]).map(
        ([key, value]) => {
          const op = value["children"][1]["children"][1]["post"];
          setOp(op);
          const thread = value["children"][2]["children"];
          setThread(thread);
        }
      );
    }
    init();
  }, [ship, board, index]);

  const deletePost = (index) => {
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

  let op_text;
  let op_url;

  return (
    <main className="flex flex-col items-left px-4 space-y-3 justify-start min-h-screen">
      <ChannelNav ship={ship} board={board} />
      <hr />

      {op?.["contents"].map((obj) => {
        switch (Object.keys(obj)[0]) {
          case "url":
            op_url = obj["url"];
          case "text":
            op_text = obj["text"];
        }
      })}
      <div className="my-3 space-x-2 flex" key="op">
        <a target="_blank" href={op_url}>
          <img className="object-contain max-h-48" src={op_url} />
        </a>
        <div key="content-container">
          <div className="gap-2 inline-flex" key="thread-info">
            <p>{new Date(op?.["time-sent"]).toLocaleString()}</p>
          </div>
          <p key="optext" className="">
            {op_text}
          </p>
        </div>
      </div>

      {Object.entries(thread || {})
        .sort(([aKey, aValue], [bKey, bValue]) => {
          return aValue?.post?.["time-sent"] > bValue?.post?.["time-sent"]
            ? 1
            : -1;
        })
        .map(([key, value]) => {
          return (
            <div className="ml-8 flex flex-col outline outline-1 max-w-prose">
              <div className="p-3 flex space-x-2">
                {value?.children?.[1].post?.contents.map((obj) => {
                  switch (Object.keys(obj)[0]) {
                    case "url":
                      return (
                        <a target="_blank" href={obj["url"]}>
                          <img
                            className="object-contain max-h-48"
                            src={obj["url"]}
                          />
                        </a>
                      );
                    case "text":
                      return <p className="">{obj["text"]}</p>;
                  }
                })}
              </div>
              <p className="bg-chan-border text-chan-bg font-bold pr-2 text-right text-xs">
                <span className="">delete</span>
                {new Date(value?.post?.["time-sent"]).toLocaleString()}
              </p>
            </div>
          );
        })}
      <hr />
      <PostBox index={index} ship={ship} board={board} />
    </main>
  );
}

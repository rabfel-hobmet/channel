// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { graph, deSig } from "@urbit/api";
import PostBox from "./components/postbox";
import ChannelNav from "./components/navbar";
import { process_text } from "./lib/text";

export function Thread({boards}) {
  const [thread, setThread] = useState({});
  const [op, setOp] = useState({});
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
      <ChannelNav ship={ship} board={board} boards={boards} />
      <hr />

      {op?.["contents"]?.map((obj) => {
        switch (Object.keys(obj)[0]) {
          case "url":
            op_url = obj["url"];
          case "text":
            op_text = process_text(obj["text"] || "");
        }
      })}
      <div className="my-3 space-x-2 flex" key="op">
        <a target="_blank" href={op_url}>
          <img className="object-contain max-h-48" src={op_url} />
        </a>
        <div key="content-container">
          <div className="gap-2 inline-flex md:flex-row flex-col md:items-center md:justify-center" key="thread-info">
            <p>{new Date(op?.["time-sent"]).toLocaleString()}</p>
            <p className="text-chan-green align-middle leading-none">{op?.["index"]?.slice(14, -4)}</p>
          </div>
          <div key="optext" className="">
            {op_text}
          </div>
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
            value?.children?.[1]?.post?.contents && <div className="md:ml-8 flex flex-col outline outline-1 max-w-prose">
              <div className="p-3 flex space-x-2">
                {value?.children?.[1].post?.contents?.map((obj) => {
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
                      return <div className="">{process_text(obj["text"]) || ""}</div>;
                  }
                })}
              </div>
              <div className="bg-chan-border text-chan-bg font-bold flex md:flex-row flex-col md:items-center md:justify-between p-1">
              {deSig(window.ship) === deSig(ship) && <span className="text-chan-red mr-2 cursor-pointer" onClick={() => deletePost(value?.children?.[1].post?.["index"])}>delete</span>}
                          <p className="font-bold text-xs">
                            {new Date(
                              value?.post?.["time-sent"]
                            ).toLocaleString()}
                          </p>
                          <p className="text-xs align-middle leading-none font-bold">{value?.children?.[1]?.post["index"]?.split("/")?.[3]?.slice(13)}</p>
                          </div>
            </div>
          );
        })}
      <PostBox className="pl-9" index={index} ship={ship} board={board} />
    </main>
  );
}

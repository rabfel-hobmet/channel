import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { graph } from '@urbit/api';
import { Link } from 'react-router-dom';
import { useFileStore } from './state/useFileStore';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import useStorageState from './state/storage';
import { dateToDa, deSig } from '@urbit/api';

export function Thread() {
  const { client } = useFileStore();
  const { s3 } = useStorageState();
  const [thread, setThread] = useState({});
  const [op, setOp] = useState();
  const [image, setImage] = useState("");
  const [reply, setReply] = useState("");
  const [file, setFile] = useState<FileList>();
  const {ship, board, index} = useParams();

  useEffect(() => {
    async function init() {
      const msg = await window.api.scry(graph.getNode(ship, board, `/${index}`));
      Object.entries(msg["graph-update"]["add-nodes"]["nodes"]).map(([key, value]) => {
        const op = value["children"][1]["children"][1]["post"];
        setOp(op);
        const thread = value["children"][2]["children"];
        setThread(thread);
      });
    };
    init()
  }, [ship, board, index]);

  useEffect(() => {
    if (file !== undefined) {
      const timestamp = deSig(dateToDa(new Date()));
      client?.send(
        new PutObjectCommand({
          Bucket: s3.configuration.currentBucket,
          Key: `${timestamp}-${file[0].name}`,
          Body: file[0],
          ACL: "public-read",
          ContentType: file[0].type
        })
      ).then(() => setImage(`${s3.credentials.endpoint}/${s3.configuration.currentBucket}/${timestamp}-${file[0].name}`)).catch((err) => console.error(err))
    }
  }, [file])

  const submitReply = () => {
      return window.api.poke({
          app: "channel-client",
          mark: "channel-stacy",
          json: {
              "add-poast": {
                  "maybe-index": index,
                  message: [{text: reply}],
                  image: image || null,
                  ship: ship,
                  board: board
              }
          }
      }).then(() => location.reload())
  }

  return (
    <main className="flex flex-col items-left px-4 space-y-3 justify-start min-h-screen">
        <ul className="flex my-3 pl-9 divide-x-2">
          <li className='px-3'> <Link to={`/board/${ship}/${board}`} className="text-2xl font-bold text-link-blue hover:text-link-hover hover:underline">back to /{board}/</Link></li>
          <li className='px-3'> <Link to={`/list/${ship}/${board}`} className="text-2xl font-bold text-link-blue hover:text-link-hover hover:underline">thread list</Link> </li>
          <li className='px-3'> <h2 className="text-link-blue text-2xl">catalog</h2> </li>
        </ul>
      <hr/>
      <div className="py-3 outline outline-1 bg-chan-element max-w-prose">
      <p className="py-3 px-6 flex">{op?.["contents"]?.[1]?.text}</p>
      <p className="text-right px-6 text-chan-red font-semibold">{new Date(op?.["time-sent"]).toLocaleString()}</p>
      </div>
      {Object.entries(thread || {}).sort(([aKey, aValue], [bKey, bValue]) => {
        return aValue?.post?.["time-sent"] > bValue?.post?.["time-sent"] ? 1 : -1
      }).map(([key, value]) => {
        return <div className="ml-8 flex flex-col outline outline-1 max-w-prose"><div className="p-3 flex space-x-2">{value?.children?.[1].post?.contents.map((obj) => {
          switch(Object.keys(obj)[0]) {
            case "url":
              return <a target="_blank" href={obj["url"]}><img className="object-contain max-h-24" src={obj["url"]}/></a>
            case "text":
              return <p className="">{obj["text"]}</p>
          }
        })}
        </div><p className="bg-chan-border text-chan-bg font-bold pr-2 text-right text-xs">{new Date(value?.post?.["time-sent"]).toLocaleString()}</p></div>
      })}
      
      
      <div className="grid gap-3">
        <p>Image</p>
      <input value={image} placeholder="https://urbit.org/loss.jpg" className="outline outline-1 p-3 max-w-prose bg-chan-bg" onChange={e => setImage(e.target.value)}/>
      {client !== null && <input onChange={(e) => setFile(e.target.files)} type="file"/>}
      <p>Reply</p>
        <textarea className="outline outline-1 p-3 max-w-prose bg-chan-bg max-h-56 h-24" onChange={e => setReply(e.target.value)}/>
        <button className="outline outline-1 outline-gray-300 p-2 bg-chan-element text-chan-red max-w-fit" onClick={submitReply}>post</button>
      </div>
      <hr/>
    </main>
  );
}

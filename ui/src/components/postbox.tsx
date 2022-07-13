// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useFileStore } from "../state/useFileStore";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import useStorageState from "../state/storage";
import { dateToDa, deSig } from "@urbit/api";

export default function PostBox({ index, ship, board, className = "" }) {
  const { client } = useFileStore();
  const { s3 } = useStorageState();
  const [image, setImage] = useState("");
  const [reply, setReply] = useState("");
  const [file, setFile] = useState<FileList>();

  useEffect(() => {
    if (file !== undefined) {
      const timestamp = deSig(dateToDa(new Date()));
      client
        ?.send(
          new PutObjectCommand({
            Bucket: s3.configuration.currentBucket,
            Key: `${timestamp}-${file[0].name}`,
            Body: file[0],
            ACL: "public-read",
            ContentType: file[0].type,
          })
        )
        .then(() => {
          const endpoint = s3.credentials.endpoint.startsWith("http") ? s3.credentials.endpoint : `https://${s3.credentials.endpoint}`;
          return setImage(
            `${endpoint}/${s3.configuration.currentBucket}/${timestamp}-${file[0].name}`
          )}
        )
        .catch((err) => console.error(err));
    }
  }, [file]);

  const submitReply = () => {
    return window.api
      .poke({
        app: "channel-client",
        mark: "channel-stacy",
        json: {
          "add-poast": {
            "maybe-index": index,
            message: [{ text: reply }],
            image: image || null,
            ship: ship,
            board: board,
          },
        },
      })
      .then(() => location.reload());
  };

  return (
    <>
    <hr/>
    <div className={"text-xs grid gap-3 w-full max-w-prose pb-6 my-3 " + className}>
      <p>Image</p>
      <input
        value={image}
        placeholder="https://urbit.org/loss.jpg"
        className="outline outline-1 p-3 bg-chan-element"
        onChange={(e) => setImage(e.target.value)}
      />
      {client !== null && (
        <input onChange={(e) => setFile(e.target.files)} type="file" />
      )}
      <p>Reply</p>
      <textarea
        className="outline outline-1 p-3 w-full bg-chan-element max-h-56 h-24"
        onChange={(e) => setReply(e.target.value)}
      />
      <button
        className="outline outline-1 outline-gray-300 p-2 bg-chan-element text-chan-red max-w-fit"
        onClick={submitReply}
      >
        post
      </button>
    </div>
    </>
  );
}

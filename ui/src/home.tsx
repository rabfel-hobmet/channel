// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Prompt from './components/prompt'

export function Home() {
  const [providers, setProviders] = useState<string[]>([]);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const init = async () => {
      const providers = await api.scry({
        app: "channel-client",
        path: "/providers",
      });
      setProviders(providers["providers"]);
    };
      init();
  }, []);

  useEffect(() => {
    const init = async () => {
      const bards = [];
      const newBoards = await providers.reduce((prevPromise, nextBoard) => {
        return prevPromise.then(async () => {
          return bards.push({ship: nextBoard, boards: await window.api.scry({ app: "channel-client", path: `/boards/${nextBoard}`}).then((res) => res.boards)})
        })
      }, Promise.resolve())
        setBoards(bards);
    };
    init();
  }, [providers]);

  const addHost = () => {
    const ship = window.prompt("What ship? eg. ~zod");
    return window.api
      .poke({
        app: "channel-client",
        mark: "channel-stacy",
        json: {
          "see-hoast": ship,
        },
      })
      .then(() => location.reload());
  };

  return (
    <>
    <Prompt />
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-prose justify-center p-6 grid grid-rows-1 gap-2">
        <h2 className="font-bold text-chan-red text-8xl text-center">
          channel
        </h2>
        <h2 className="text-chan-red text-4xl text-center border-chan-border">
          boards:
        </h2>
      </div>

      <div className="w-full flex flex-col overflow-y-auto justify-between h-96 max-w-prose border-b-8 p-6 my-4 bg-chan-element border-chan-border outline outline-1 outline-black z-10">
        <div>
          {boards.map((ship) => {
            return <div key={`container-${ship.ship}`}>
              <h2 className="font-semibold px-1 bg-chan-border">{ship.ship}:</h2>
              {ship.boards.map((board) => {
                return <Link
                className="text-link-blue px-1 hover:text-link-hover hover:underline"
                to={`/board/${ship.ship}/${board.board}`}
                key={`link-${board.board}`}
              >
                /{board.board}/
              </Link>
              })}
            </div>
          })}
        </div>
        <p
          onClick={() => addHost()}
          className="uppercase font-bold text-right cursor-pointer"
        >
          Add provider
        </p>
      </div>
      <p className="text-xs flex items-center"><span className="pr-24">For ~winder-dapsym, with love</span> <img src="https://freedom-club.sfo2.digitaloceanspaces.com/rabsef-bicrym/2022.7.09..18.39.59-Quartus-Logo-Channel-2.png" className="h-6 hover:animate-spin-slow cursor-help"/></p>
    </main>
    </>
  );
}

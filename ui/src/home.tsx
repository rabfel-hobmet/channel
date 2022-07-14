// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import Prompt from './components/prompt'

export function Home({ boards, providers }) {

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

      <div className="w-full flex flex-col overflow-y-scroll overflow-x-hidden justify-between h-96 max-w-prose border-b-8 p-6 mb-4 bg-chan-element border-chan-border outline outline-1 outline-black z-10">
        <div className="">
          {boards.map((ship) => {
            return <div key={`container-${ship.ship}`}>
              <h2 className="font-semibold px-1 bg-chan-border mt-2">{ship.ship}:</h2>
              {ship.boards.map((board) => {
                return <Link
                className="text-link-blue px-1 hover:text-link-hover hover:underline block"
                to={`/board/${ship.ship}/${board.board}`}
                key={`link-${board.board}`}
              >
                /{board.board}/ - {board?.name}
              </Link>
              })}
            </div>
          })}
        </div>
        <p
          onClick={() => addHost()}
          className="uppercase font-bold text-right cursor-pointer pt-8"
        >
          Add provider
        </p>
      </div>
      <p className="text-xs flex items-center"><span className="pr-24">For ~winder-dapsym, with love</span> <img src="https://freedom-club.sfo2.digitaloceanspaces.com/rabsef-bicrym/2022.7.09..18.39.59-Quartus-Logo-Channel-2.png" className="h-6 hover:animate-spin-slow cursor-help"/></p>
    </main>
    </>
  );
}

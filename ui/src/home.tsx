// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Home() {
  const [prompt, setPrompt] = useState(true);
  const [providers, setProviders] = useState<string[]>([]);
  const [boards, setBoards] = useState({});

  useEffect(() => {
    const prompt = Boolean(JSON.parse(localStorage.getItem('channel-prompt-0.0.1') ?? "true"));
    if (prompt === false) {
      setPrompt(prompt)
    }
  }, []);

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
        let newBoards = {};
        providers.forEach(async (ship) => {
          const board = await window.api.scry({ app: "channel-client", path: `/boards/${ship}`});
          newBoards[ship] = board;
        });
        // const scries = providers.map((provider) => ({prov: provider, scry: {
        //   app: "channel-client",
        //   path: `/boards/${provider}`,
        // }}));
        // newBoards = await Promise.all(scries.map((e) => api.scry(e.scry)));
        setBoards(newBoards);
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

  const dismissPrompt = () => {
    setPrompt(false);
    return localStorage.setItem('channel-prompt-0.0.1', JSON.stringify(false))
  }

  return (
    <>
    {prompt && <div className="absolute w-screen h-screen z-20 flex justify-center items-center">
      <div className="bg-chan-element w-full max-w-prose max-h-96 overflow-auto border-2 border-chan-border p-4 flex flex-col space-y-4 text-sm">
        <p className="text-center font-bold text-chan-red pb-4">Disclaimer</p>
        <p><span className="text-chan-red font-bold">Welcome to channel 0.0.1</span>, Urbit's premier imageboard application. We are in closed beta. To make the most of your experience using this software, please note the following:</p>
        <li><span className="text-chan-red font-bold">You can only trust your fists.</span> Guard your opsec carefully. Boards can be hosted on any ship, and while ship names during posting are scrambled using a per-ship, per-agent SHA256 seed and not able to be scried and descrambled by the operator through +dbug, theoretically an operator could read their event log or monitor incoming packets.</li>
        <li>Likewise, while we import your s3 keys for easy upload, you have to ensure your s3 buckets are using a name that doesn't identify your ship. We do not provide s3-store editing facilities here -- use Groups or Silo.</li>
        <p className="text-center bg-chan-border font-bold text-white py-2 cursor-pointer" onClick={() => dismissPrompt()}>I agree</p>
        <p><span className="text-chan-red font-bold">Problem?</span> Send DMs to ~haddef-sigwen, ~rabsef-bicrym or ~libbyl-lonsyd and DMCAs to the garbage bin.</p>
        <hr className="border-chan-border"/>
      <p className="text-center font-bold text-chan-red">Release notes</p>
      <p>Initial release. To come:</p>
      <li>Ship ban button</li>
      <li>Detect or set additional board janitors</li>
      <li>Board announcements</li>
      <li>Board pagination</li>
      <li>Application and board theming</li>
      <li>FE: create a board</li>
      </div>
      </div>}
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
          {Object.entries(boards).map(([key, value]) => {
            return (
              <div key={`container-${key}`}>
                <h2
                  className="font-semibold px-1 bg-chan-border"
                  key={`header-${key}`}
                >
                  {key}:
                </h2>
                {value["boards"].map((board, i) => (
                  <Link
                    className="text-link-blue px-1 hover:text-link-hover hover:underline"
                    to={`/board/${key}/${board.board}`}
                    key={`link-${i}`}
                  >
                    /{board.board}/
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
        <p
          onClick={() => addHost()}
          className="uppercase font-bold text-right cursor-pointer"
        >
          Add provider
        </p>
      </div>
      <p className="text-xs flex items-center">For ~winder-dapsym, with love <img src="https://freedom-club.sfo2.digitaloceanspaces.com/rabsef-bicrym/2022.7.09..18.39.59-Quartus-Logo-Channel-2.png" className="h-6 hover:animate-spin-slow pl-24"/></p>
    </main>
    </>
  );
}

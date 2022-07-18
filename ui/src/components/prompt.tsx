import React from 'react';
import { useEffect, useState } from 'react';

export default function Prompt() {
    const [prompt, setPrompt] = useState("true");
    const dismissPrompt = () => {
        setPrompt("false");
        return localStorage.setItem('channel-prompt-0.0.7', JSON.stringify("false"))
      }
    useEffect(() => {
        const prompt = Boolean(JSON.parse(localStorage.getItem('channel-prompt-0.0.7') ?? "true"));
        if (prompt === "false") {
          setPrompt(prompt)
        }
      }, []);
    return prompt ? <div className="absolute w-screen h-screen z-20 flex justify-center items-center">
    <div className="bg-chan-element w-full max-w-prose max-h-96 overflow-auto border-2 border-chan-border p-4 flex flex-col space-y-4 text-sm">
      <p className="text-center font-bold text-chan-red pb-4">Disclaimer</p>
      <p><span className="text-chan-red font-bold">Welcome to channel 0.0.7</span>, Urbit's premier imageboard application. We are in closed beta. To make the most of your experience using this software, please note the following:</p>
      <li><span className="text-chan-red font-bold">You can only trust your fists.</span> Guard your opsec carefully. Boards can be hosted on any ship, and while ship names during posting are scrambled using a per-ship, per-agent SHA256 seed and not able to be scried and descrambled by the operator through +dbug, theoretically an operator could pilfer through their event log or monitor incoming packets.</li>
      <li>Likewise, while we import your s3 keys for easy upload, you have to ensure your s3 buckets are using a name that doesn't identify your ship. We do not provide s3-store editing facilities here -- use Groups or Silo.</li>
      <li><span className="text-chan-red font-bold">Planets only</span>. Any other types of ships will find boards don't load and, inexplicably, taste ringlets of blood in their mouth.</li>
      <li><span className="text-chan-red font-bold">~sitden-sonnet boards are SFW</span>. See %docs for guidance running boards with looser moral restraint.</li>
      <p className="text-center bg-chan-border font-bold text-white py-2 cursor-pointer" onClick={() => dismissPrompt()}>I agree</p>
      <p><span className="text-chan-red font-bold">Problem?</span> Send DMs to ~haddef-sigwen, ~rabsef-bicrym or ~libbyl-lonsyd and DMCAs to the garbage bin.</p>
      <hr className="border-chan-border"/>
    <p className="text-center font-bold text-chan-red">Release notes</p>
    <li>Prevents a crash.</li>
    <p>To come:</p>
    <li>Ship ban button</li>
    <li>Sages</li>
    <li>Reference to prior posts in thread</li>
    <li>Detect or set additional board janitors</li>
    <li>Board announcements</li>
    <li>Board pagination</li>
    <li>Application and board theming</li>
    <li>FE: create a board</li>
    </div>
    </div> : null
}
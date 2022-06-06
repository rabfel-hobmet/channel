import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { Link } from 'react-router-dom';

export function Home() {
    const [providers, setProviders] = useState<string[]>([]);
    const [boards, setBoards] = useState({});

    useEffect(() => {
        const init = async() => {
            const providers = await api.scry({app: "channel-client", path: "/providers"});
            setProviders(providers["providers"]);
        }
        init();
    }, []);

    useEffect(() => {
        const init = async() => {
            if (providers?.length > 0) {
                providers.map(async(provider) => {
                    const incomingBoards = await api.scry({app: "channel-client", path: `/boards/${provider}`});
                    let newBoards = Object.assign({}, boards);
                    newBoards[provider] = incomingBoards;
                    setBoards(newBoards);
                })
            }
        }
        init();
    }, [providers]);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-4 space-y-4 lg:space-y-0">
            <Marquee gradient={false} className="static lg:absolute min-w-screen pt-96 -top-80 -right-44 lg:rotate-12 border-b-4 bg-black border-black" speed={200}>
            <h2 className="text-8xl text-ridge-yellow font-bold">CHANNEL</h2>
            </Marquee>
            <h2 className="bg-black w-screen static lg:absolute text-ridge-yellow text-4xl z-0 border-y-4 border-double border-ridge-yellow">CHOOSE YOUR PROVIDER</h2>
        <div className="w-full flex flex-col overflow-y-auto justify-between h-96 max-w-prose border rounded-xl p-2 my-16 bg-ridge-yellow border-black z-10">
            <div>
            {Object.entries(boards).map(([key, value]) => {
                return <><h2 className="font-semibold font-mono" key={key}>{key}</h2>
                {value["boards"].map((board) => <Link className="text-red-500" to={`/board/${key}/${board.board}`}>/{board.board}/</Link>)}
                </>
            })}
            </div>
            <p className='uppercase font-bold text-right'>Add provider</p>
        </div>
        <p>Use at your own risk.</p>
        </main>
    )
}
import React, { useEffect, useState } from 'react';
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
        <main className="flex flex-col items-left justify-center min-h-screen">
        <div>
            {Object.entries(boards).map(([key, value]) => {
                return <><h2 key={key}>{key}</h2>
                {value["boards"].map((board) => <Link to={`/board/${key}/${board.board}`}>{board.board}</Link>)}
                </>
            })}
        </div>
        </main>
    )
}
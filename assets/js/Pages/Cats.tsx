import axios from "axios";
import * as React from "react";
import { useList, useMount } from "react-use";
import { CatsCreate } from "./Cats/CatsCreate";
import { CatsIndex } from "./Cats/CatsIndex";

export function Cats() {
    const [isLoading, setLoading] = React.useState(false);
    const [cats, { set: setCats }] = useList([]);

    async function load() {
        const response = await axios.get(window.host + "/api/cats");
        setCats(response.data);
    }

    useMount(async function() {
        setLoading(true);
        await load();
        setLoading(false);
    });

    return (
        <div className="container">
            <div className={"row"}>
                <div className={"col-6"}>
                    <CatsCreate onCreated={load}/>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    {
                        isLoading ?
                            (
                                <div className="text-center">
                                    <div className="spinner-grow" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <CatsIndex onDeleted={load} cats={cats}/>
                            )
                    }
                </div>
            </div>
        </div>
    );
}

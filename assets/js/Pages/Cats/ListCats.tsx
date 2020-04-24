import * as React from "react";
import { useList, useMount } from "react-use";
import { Link } from "react-router-dom";
import { ApplicationContext } from "../../Contexts/ApplicationContext";
import { Cat } from "../../Datas/Cat";

export function ListCats() {
    const { client } = React.useContext(ApplicationContext);
    const [isLoading, setLoading] = React.useState(false);
    const [cats, { set: setCats }] = useList([]);

    async function load() {
        const response = await client.get<Cat[]>("/api/cats");
        setCats(response.data);
    }

    useMount(async function () {
        setLoading(true);
        await load();
        setLoading(false);
    });

    return (
        <div className="row">
            <div className="col">
                <div className="row">
                    <div className="col">
                        <h1>Cats</h1>
                    </div>
                    <div className="col text-right">
                        <Link className={"btn btn-primary"} to={"/cats/create"}>
                            <span className="fas fa-plus"/> Create Cat
                        </Link>
                    </div>
                </div>
                {
                    isLoading ?
                        (
                            <div className="text-center">
                                <div className="spinner-grow" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        cats.map(cat => {
                                            async function handleDelete() {
                                                try {
                                                    await client.delete("/api/cats/" + cat.id);
                                                } finally {
                                                    await load();
                                                }
                                            }

                                            return (
                                                <tr key={cat.id}>
                                                    <td>
                                                        <span className="fas fa-cat"/> {cat.name}
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-danger" onClick={handleDelete}><span
                                                            className="fas fa-times"/></button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        )
                }
            </div>
        </div>
    );
}

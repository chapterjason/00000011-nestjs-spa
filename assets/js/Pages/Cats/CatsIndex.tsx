import axios from "axios";
import * as React from "react";
import { Cat } from "../../Datas/Cat";

export interface CatsIndexProps {
    cats: Cat[];
    onDeleted: () => void;
}

export function CatsIndex(props: CatsIndexProps) {
    const { cats, onDeleted } = props;

    return (
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
                                await axios.delete(window.host + "/api/cats/" + cat.id);
                            } finally {
                                onDeleted();
                            }
                        }

                        return (
                            <tr key={cat.id}>
                                <td>
                                    <span className="fas fa-cat"/> {cat.name}
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={handleDelete}><span className="fas fa-times"/></button>
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
}

import axios from "axios";
import * as React from "react";
import { Cat } from "../../Datas/Cat";

export interface CatsCreateProps {
    onCreated: (cat: Cat) => void;
}

export function CatsCreate(props: CatsCreateProps) {
    const { onCreated } = props;
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [isLoading, setLoading] = React.useState(false);
    const input = React.useRef(null);

    function handleChange(event: React.FormEvent<HTMLInputElement>) {
        if (!isLoading) {
            setName(event.currentTarget.value);
        }
    }

    async function handleEnter(event: React.KeyboardEvent<HTMLInputElement>) {
        if (!isLoading) {
            if ("Enter" === event.key) {
                await handleClick();
            }
        }
    }

    async function handleClick() {
        if (!isLoading) {
            setLoading(true);
            setError("");
            try {
                const response = await axios.post(window.host + "/api/cats", { name });
                setName("");
                onCreated(response.data);
            } catch (error) {
                setError(error.response.data.message.join("\n"));
            } finally {
                setLoading(false);
                input.current.focus();
            }
        }
    }

    return (
        <fieldset {...(isLoading ? { disabled: true } : {})}>
            <legend>Create a Cat!</legend>
            <div className="form-group">
                <label htmlFor="cat-name">Name:</label>
                <input type="text" className="form-control" ref={input} id="cat-name" onKeyPress={handleEnter}
                    value={name} onChange={handleChange}/>
            </div>
            {
                error.length > 0 &&
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            }
            <button type="button" className="btn btn-primary" onClick={handleClick}>
                {isLoading ? <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"/> :
                    <span>Create</span>}
            </button>
        </fieldset>
    );
}

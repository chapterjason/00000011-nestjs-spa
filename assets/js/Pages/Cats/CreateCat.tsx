import { ApplicationContext } from "../../Contexts/ApplicationContext";
import * as React from "react";
import { Cat } from "../../Datas/Cat";
import { Client } from "../../Services/Client";
import { ValidationError } from "../../Datas/ValidationError";
import { useHistory } from "react-router-dom";

export function CreateCat() {
    const { client } = React.useContext(ApplicationContext);
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [isLoading, setLoading] = React.useState(false);
    const input = React.useRef(null);
    const history = useHistory();

    function handleChange(event: React.FormEvent<HTMLInputElement>) {
        if (!isLoading) {
            setName(event.currentTarget.value);
        }
    }

    async function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
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
                const response = await client.post<Cat>("/api/cats", { name });
                setName("");
            } catch (error) {
                if (Client.isRequestError<ValidationError>(error)) {
                    setError(error.response.data.message.join("\n"));
                } else {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
                input.current.focus();
                history.push("/cats");
            }
        }
    }

    const disabled = isLoading ? { disabled: true } : {};

    return (
        <div className="row">
            <div className="col">
                <div className="row">
                    <div className="col">
                        <h1>Create a Cat!</h1>
                    </div>
                    <div className="col">
                        <div className="col text-right">
                            <button className="btn btn-secondary" onClick={history.goBack}>
                                <span className="fas fa-chevron-left"/> Back
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="cat-name">Name:</label>
                            <input type="text" className="form-control" ref={input} id="cat-name"
                                   onKeyPress={handleKeyPress}
                                   value={name}
                                   onChange={handleChange}
                                   {...disabled}
                            />
                        </div>
                        {
                            error.length > 0 &&
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        }
                        <button type="button" className="btn btn-primary"
                                onClick={handleClick} {...disabled}>
                            {isLoading ?
                                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"/> :
                                <span>Create</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

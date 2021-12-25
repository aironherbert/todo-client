import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";

type UserType = {
    id: number | undefined;
    name: string | undefined;
}
export default function Login({ user, setUser }: { user: UserType, setUser: (user: UserType) => void }) {
    const [name, setName] = useState<string | undefined>()
    return (
        <div>
            <h1>Digite o nome de usuário: </h1>
            <form onSubmit={(e) => {
                e.preventDefault()
                setUser({ ...user, name })
            }}>
                <TextField fullWidth size="small" autoFocus className="input1" type="text" name="title" value={name} onChange={(e) => setName(e.target.value ?? undefined)} />
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: "10px" }}>Entrar</Button>
            </form>
        </div>
    );
}
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";

type UserType = {
  id?: number;
  name?: string;
};
export default function Login({
  user,
  setUser,
}: {
  user: UserType;
  setUser: (user: UserType) => void;
}) {
  const [name, setName] = useState<string>();
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Simple Todo List</h1>

      <h2>Digite o nome de usuário: </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setUser({ ...user, name });
        }}
      >
        <FormControl>
          <TextField
            label="Usuário"
            autoFocus
            required
            name="login-name"
            value={name}
            onChange={(e) => setName(e.target.value ?? undefined)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Entrar
          </Button>
        </FormControl>
      </form>
    </div>
  );
}


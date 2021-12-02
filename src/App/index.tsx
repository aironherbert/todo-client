import { useQuery, gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, Card, TextField } from '@material-ui/core';

import "./index.css";
// import styled from '@emotion/styled';

const GET_TODOS = gql`
  query todos {
    todos{
      id
      title
      description
      insertedAt
      updatedAt
      color
      done
    }
  }
`;

const CREATE_TODO = gql`
  mutation createTodo($title: String, $description: String, $color: String, $done: Boolean) {
    createTodo(title: $title, description: $description, color: $color, done: $done) {
      id
      title
      description
      insertedAt
      updatedAt
      color
      done
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      id
      title
      description
      insertedAt
      updatedAt
      color
      done
    }
  }
`;

const UPDATE_TODO = gql`
  mutation updateTodo($id: Int!, $title: String, $description: String, $color: String, $done: Boolean) {
    updateTodo(id: $id, title: $title, description: $description, color: $color, done: $done) {
      id
      title
      description
      insertedAt
      updatedAt
      color
      done
    }
  }
`;

interface Todo {
  id: number;
  title: string;
  description: string;
  insertedAt: string;
  updatedAt: string;
  color: string;
  done: boolean;
}

export default function App() {

  const { loading, error, data } = useQuery(GET_TODOS);

  const [createTodo] = useMutation(CREATE_TODO, { refetchQueries: [GET_TODOS, "todos"] });
  const [deleteTodo] = useMutation(DELETE_TODO, { refetchQueries: [GET_TODOS, "todos"] });
  const [updateTodo] = useMutation(UPDATE_TODO);

  const [status, setStatus] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#000000");
  const [selected, setSelected] = useState<{ id: number | null, title: string, description: string, color: string, done: boolean }>({ id: null, title: "", description: "", color: "#000000", done: false });

  const handleCreate = async () => {
    setTitle("");
    setDescription("");
    setColor("#000000")
    await createTodo({
      variables: {
        title,
        description,
        color,
        done: false
      }
    }).catch(err => console.log(err));
    setTitle("");
    setDescription("");
    setColor("#000000")
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="container">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button variant="contained" style={{ marginBottom: "5px" }} onClick={() => setStatus(status === "create" ? "" : "create")}>{status === "create" ? "Fechar" : "Criar nova atividade"}</Button>
        {status === "create" &&
          <Card className="create" style={{ display: "flex", justifyContent: "flex-start" }}>
            <form onSubmit={(event) => {
              event.preventDefault();
              handleCreate();
            }}>
              <label>
                <TextField autoFocus type="text" name="title" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label>
                <TextField multiline fullWidth type="text" name="description" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>
              <label>
                <input style={{ height: "3.5rem" }} type="color" value={color} onChange={(e) => setColor(e.target.value)} />
              </label>
              <Button variant="contained" type="submit">Salvar</Button>
            </form>
          </Card>
        }
      </div>
      {data?.todos.map((todo: Todo) =>
        <Card key={todo.id} style={{ backgroundColor: todo.color, display: "flex", minWidth: "50%", borderRadius: "10px", justifyContent: "space-between", alignItems: "center", padding: "10px", position: "relative", marginBottom: "5px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "10px", width: "100%", padding: "2px", marginRight: "5px" }}>
            {status === "edit" && todo.id === selected.id ? <>
              <form className="edit" onSubmit={async (event) => {
                event.preventDefault();
                await updateTodo({
                  variables: {
                    ...selected
                  }
                }).then(() => setStatus("")).catch(err => console.log(err));
              }}>
                <div className="labels">
                  <TextField fullWidth size="small" autoFocus className="input1" type="text" name="title" value={selected.title} onChange={(e) => setSelected({ ...selected, title: e.target.value })} />
                  <TextField fullWidth size="small" className="input2" type="text" name="description" value={selected.description} onChange={(e) => setSelected({ ...selected, description: e.target.value })} />
                </div>
                <Button size="small" variant="contained" className="button" type="submit">Salvar</Button>
              </form>
            </> :
              <>
                <h6 style={{ textDecoration: `${todo.done ? "line-through" : "none"}`, padding: "5px", margin: "0" }}>{todo.title}</h6>
                <div style={{ textDecoration: `${todo.done ? "line-through" : "none"}`, padding: "5px" }}>{todo.description}</div>
              </>}
          </div>


          <div style={{ display: "flex" }}>
            <button onClick={async () => {
              setSelected({ id: todo.id, title: todo.title, description: todo.description, color: todo.color, done: todo.done });
              setStatus(status === "edit" ? "" : "edit");
            }}><EditIcon /></button>
            <button onClick={async () => {
              await updateTodo({ variables: { id: todo.id, done: !todo.done } })
            }
            }>{todo.done ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}</button>
            <button onClick={async () => {
              await deleteTodo({ variables: { id: todo.id } })
            }}><DeleteIcon /></button>
          </div>
        </Card>)
      }
    </div >
  )

}
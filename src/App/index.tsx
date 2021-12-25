import { useQuery, gql, useMutation } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, Card, TextField } from '@material-ui/core';

import "./index.css";
import ModalApp from './components/molecules/Modal';
import Login from './components/login';

const GET_USER = gql`
  query user($name: String){
    profile(name: $name){
      id
      name
      insertedAt
      updatedAt
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
  }
`

const CREATE_TODO = gql`
  mutation createTodo($title: String, $description: String, $color: String, $done: Boolean, $userId: Int!){
    createTodo(title: $title, description: $description, color: $color, done: $done, userId: $userId){
      id
      title
      description
      userId
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

  const [user, setUser] = useState<{ id: number | undefined, name: string | undefined }>({ id: undefined, name: undefined })
  const { loading, error, data } = useQuery(GET_USER, { variables: { name: user.name } });

  useEffect(() => {
    if (data) {
      setUser({ name: data?.profile?.name ?? undefined, id: data?.profile?.id ?? undefined })
    }
  }, [data, data?.profile])

  const [createTodo] = useMutation(CREATE_TODO, { refetchQueries: [GET_USER, "profile"] });
  const [deleteTodo] = useMutation(DELETE_TODO, { refetchQueries: [GET_USER, "profile"] });
  const [updateTodo] = useMutation(UPDATE_TODO);


  const ref = useRef<HTMLInputElement>(null);

  const [state, setState] = useState("");
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
        done: false,
        userId: user.id
      }
    }).catch(err => console.log(err));
    setTitle("");
    setDescription("");
    setColor("#000000")
    setState("")
  }

  if (error) return <p>Error: {error}</p>;
  if (!user || !data?.profile) return <Login setUser={setUser} user={user} />
  return (
    <div className="container">
      <h1>Simple Todo List</h1>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div><h1>{user.name}
          <Button variant="contained" style={{ marginLeft: "10px", backgroundColor: "red" }} color="secondary" onClick={() => {
            setState("")
            setUser({ id: undefined, name: undefined })
          }}>Sair</Button>
        </h1>
        </div>
        <Button variant="contained" style={{ marginBottom: "5px" }} color={`${state === "create" ? "secondary" : "primary"}`} onClick={() => setState(state === "create" ? "" : "create")}>{state === "create" ? "Fechar" : "Criar nova atividade"}</Button>
        {state === "create" &&
          <Card className="create" style={{ display: "flex", justifyContent: "flex-start", marginBottom: "5px" }}>
            <form onSubmit={(event) => {
              event.preventDefault();
              handleCreate();
            }}>
              <label>
                <TextField size="small" autoFocus type="text" name="title" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label>
                <TextField multiline fullWidth type="text" name="description" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>
              <label>
                <input style={{ height: "3.5rem" }} type="color" value={color} onChange={(e) => setColor(e.target.value)} />
              </label>
              <Button variant="contained" color="primary" type="submit">Salvar</Button>
            </form>
          </Card>
        }
      </div>
      {loading ? "Carregando..." : data?.profile?.todos?.map((todo: Todo) => {
        const dateItem = new Date(todo.updatedAt);
        const dateItemString = dateItem.toLocaleString('pt-BR');

        return (
          <Card onClick={(e) => {
            if (e.currentTarget === e.target) {
              setSelected(todo)
              setState("editColor")
            }
          }} key={todo.id} style={{ backgroundColor: todo.color, display: "flex", minWidth: "50%", borderRadius: "10px", justifyContent: "space-between", alignItems: "center", padding: "10px", position: "relative", marginBottom: "5px", opacity: `${todo.done ? "0.5" : "1"}` }}>
            <div style={{ backgroundColor: "white", borderRadius: "10px", width: "100%", padding: "2px", marginRight: "5px" }}>
              {state === "edit" && todo.id === selected.id ? <>
                <form className="edit" onSubmit={async (event) => {
                  event.preventDefault();
                  await updateTodo({
                    variables: {
                      ...selected
                    }
                  }).then(() => setState("")).catch(err => console.log(err));
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
              <div style={{ position: "absolute", bottom: "2px", right: "10px", fontSize: "10px", fontWeight: 700, backgroundColor: "white", borderRadius: "2px", padding: "2px 4px" }}>{dateItemString}</div>
            </div>


            <div style={{ display: "flex" }}>
              <button onClick={async () => {
                setSelected({ id: todo.id, title: todo.title, description: todo.description, color: todo.color, done: todo.done });
                setState(state === "edit" ? "" : "edit");
              }}><EditIcon /></button>
              <button onClick={async () => {
                await updateTodo({ variables: { id: todo.id, done: !todo.done } })
              }
              }>{todo.done ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}</button>
              <button onClick={async () => {
                await deleteTodo({ variables: { id: todo.id } })
              }}><DeleteIcon /></button>
            </div>
          </Card>

        )
      })
      }
      <ModalApp title="Alterando" isOpen={state === "editColor"} onClose={() => setState("")}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h3>Escolha a cor</h3>
          <input ref={ref} style={{ height: "3.5rem" }} type="color" value={selected.color} onChange={(e) => {
            setSelected({ ...selected, color: e.target.value })
          }
          } />
          <Button style={{ marginTop: "10px" }} size="small" variant="contained" className="button" onClick={() => {
            updateTodo({ variables: { id: selected.id, color: selected.color } })
            setState("")
          }}>Salvar</Button>
        </div>
      </ModalApp>
    </div >
  )

}
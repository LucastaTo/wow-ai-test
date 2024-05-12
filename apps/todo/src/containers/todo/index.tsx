import { ChangeEvent, FC, useEffect, useState } from "react";
import { StyledWrap, StyledAddTodo } from "./style";
import TodoCard from "./todo-card";
import TodoModal from "./modal";
import { PlusCircle } from "react-feather";
import SearchBar from "./search-bar";
import { alertSuccess } from "src/utils/toast";
import Pusher from "pusher-js";
import { CONFIG } from "src/configs";
import axios from "axios";
import { randomString } from "src/helpers";

export interface ITodoProp {
  id?: number;
  name: string;
  desc: string;
  color: string;
  dueDate?: Date;
  isBlockedBy?: string | null;
  status: "pending" | "completed";
}

const pusher = new Pusher(CONFIG.PUSHER_KEY, {
  cluster: CONFIG.PUSHER_CLUSTER,
});

const todoListTemp: ITodoProp[] = [
  {
    id: 1,
    name: "Test",
    desc: "Testinnggggg",
    color: "#00edf1",
    status: "completed",
  },
  {
    id: 2,
    name: "Test 1",
    desc: "Testinnggggg 1",
    color: "#d7d7d7",
    status: "completed",
  },
  {
    id: 3,
    name: "Test 2",
    desc: "Testinnggggg 2",
    color: "#ffc107",
    status: "completed",
  },
  {
    id: 4,
    name: "Test 3",
    desc: "Testinnggggg 3",
    color: "#94b710",
    status: "completed",
  },
];

const TodoContainer: FC = () => {
  const sendBlockMessage = async (id: number) => {
    await axios.post("http://localhost:5174/block", {
      todoId: id,
      userId: userObjectId,
    });
  };

  const sendOpenMessage = async (id: number) => {
    await axios.post("http://localhost:5174/open", {
      todoId: id,
    });
  };

  const [show, setShow] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [todoList, setTodoList] = useState<ITodoProp[] | []>([]);
  const [todoSelected, setTodoSelected] = useState<ITodoProp | null>(null);
  const [userObjectId, setUserObjectId] = useState<string | null>(null);

  const handleCloseModal = (isChange: boolean) => {
    if (todoSelected?.isBlockedBy === userObjectId)
      sendOpenMessage(todoSelected?.id || 0);
    setTodoSelected(null);
    setShow(false);

    if (isChange) {
      const todoListStore = localStorage.getItem("todoList");
      setTodoList(todoListStore ? JSON.parse(todoListStore) : []);
    }
  };

  useEffect(() => {
    const todoListStore = localStorage.getItem("todoList");
    const objectId = localStorage.getItem("objectId");
    if (!todoListStore) {
      localStorage.setItem("todoList", JSON.stringify(todoListTemp));
      setTodoList(todoListTemp);
    } else {
      setTodoList(
        JSON.parse(todoListStore).map((todo: ITodoProp) => ({
          ...todo,
          isBlockedBy: null,
        }))
      );
    }

    if (!objectId) {
      const tempString = randomString(16);
      localStorage.setItem("objectId", JSON.stringify(tempString));
      setUserObjectId(tempString);
    } else {
      setUserObjectId(JSON.parse(objectId));
    }
  }, []);

  useEffect(() => {
    const channel = pusher.subscribe("todo");
    channel.bind("block", (data: any) => {
      const updatedTodoList: ITodoProp[] = todoList.map((todo) =>
        todo?.id === data?.todoId
          ? { ...todo, isBlockedBy: data?.userId }
          : todo
      );

      setTodoList(updatedTodoList);
      localStorage.setItem("todoList", JSON.stringify(updatedTodoList));
    });

    channel.bind("open", (data: any) => {
      const updatedTodoList: ITodoProp[] = todoList.map((todo) =>
        todo?.id === data?.todoId ? { ...todo, isBlockedBy: null } : todo
      );

      setTodoList(updatedTodoList);
      localStorage.setItem("todoList", JSON.stringify(updatedTodoList));
    });
    return () => {
      if (userObjectId) {
        channel.unbind(`open`);
      }
    };
  }, [userObjectId]);

  useEffect(() => {
    const todoListStore = localStorage.getItem("todoList");
    if (todoListStore) {
      if (selectedFilter) {
        const filteredTodoList = JSON.parse(todoListStore).filter(
          (x: ITodoProp) => x.status === selectedFilter
        );

        setTodoList(filteredTodoList);
      } else setTodoList(JSON.parse(todoListStore));
    }
  }, [selectedFilter]);

  const handleOpenModal = () => setShow(true);

  const handleDelete = (e: ChangeEvent, id: number) => {
    e.stopPropagation();
    const updatedTodoList = todoList.filter((todo) => todo.id !== id);

    setTodoList(updatedTodoList);
    localStorage.setItem("todoList", JSON.stringify(updatedTodoList));

    alertSuccess({
      message: "Deleted",
    });
  };

  const handleComplete = (e: ChangeEvent, id: number) => {
    e.stopPropagation();
    const updatedTodoList: ITodoProp[] = todoList.map((todo) =>
      todo.id === id ? { ...todo, status: "completed" } : todo
    );

    setTodoList(updatedTodoList);
    localStorage.setItem("todoList", JSON.stringify(updatedTodoList));
    alertSuccess({
      message: "Completed",
    });
  };

  const handleSearch = (val: string) => {
    const todoListStore = localStorage.getItem("todoList");
    if (todoListStore) {
      const filteredTodoList =
        val !== "" && selectedFilter !== ""
          ? JSON.parse(todoListStore).filter(
              (x: ITodoProp) =>
                x.name.toLowerCase().includes(val.toLowerCase()) &&
                x.status === selectedFilter
            )
          : val === "" && selectedFilter !== ""
            ? JSON.parse(todoListStore).filter(
                (x: ITodoProp) => x.status === selectedFilter
              )
            : JSON.parse(todoListStore);

      setTodoList(filteredTodoList);
    }
  };

  return (
    <>
      <SearchBar
        onSearch={handleSearch}
        selectedFilter={selectedFilter}
        setSelectedFilter={(
          e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >
        ) => setSelectedFilter(e.target.value)}
      />
      <StyledWrap>
        {todoList
          .sort((a, b) => Number(b.id) - Number(a.id))
          .map((todo) => (
            <TodoCard
              key={todo.id}
              status={todo.status}
              descrtiption={todo.desc}
              name={todo.name}
              color={todo.color}
              onClick={() => {
                handleOpenModal();
                setTodoSelected(todo);
                if (todo?.isBlockedBy === null) sendBlockMessage(todo.id || 0);
              }}
              onDelete={(e: ChangeEvent) => handleDelete(e, todo.id || 0)}
              onComplete={(e: ChangeEvent) => handleComplete(e, todo.id || 0)}
            />
          ))}
        <StyledAddTodo className="add-todo" onClick={handleOpenModal}>
          <PlusCircle size={40} />
        </StyledAddTodo>
      </StyledWrap>
      <TodoModal
        show={show}
        onClose={handleCloseModal}
        todo={todoSelected}
        userId={userObjectId}
      />
    </>
  );
};

export default TodoContainer;

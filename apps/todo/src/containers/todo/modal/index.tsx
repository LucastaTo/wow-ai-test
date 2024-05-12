import { ChangeEvent, FC, memo, useEffect, useMemo, useState } from "react";
import { Button, Textarea, ModalTitle, Spinner, Input } from "@todo/ui";
import { X } from "react-feather";
import {
  StyledBody,
  StyledClose,
  StyledColor,
  StyledFooter,
  StyledModal,
  StyledModalHeader,
  StyledWrapColors,
} from "./style";
import { ITodoProp } from "..";
import { alertSuccess } from "src/utils/toast";
import classNames from "classnames";

interface IProps {
  onClose: (isChange: boolean) => void;
  show: boolean;
  todo: ITodoProp | null;
  userId: string | null;
}

interface ErrorProps {
  message: string;
}

const defaultColors: string[] = [
  "#00edf1",
  "#d7d7d7",
  "#ffc107",
  "#94b710",
  "rgb(202 147 147)",
  "rgb(215 137 185 / 48%)",
];
const defaultTodo: ITodoProp = {
  color: defaultColors[0],
  desc: "",
  name: "",
  status: "pending",
};
const TodoModal: FC<IProps> = memo(({ show, onClose, todo, userId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [newTodo, setNewTodo] = useState<ITodoProp | null>(defaultTodo);
  const [nameError, setNameError] = useState<ErrorProps>({ message: "" });
  const [descError, setDescError] = useState<ErrorProps>({ message: "" });
  const handleError = (): boolean => {
    setDescError({
      message:
        newTodo?.desc === ""
          ? "Description cannot be empty"
          : newTodo && newTodo?.desc?.length > 1000
            ? "You have excceded maxium charater limit"
            : "",
    });
    setNameError({
      message:
        newTodo?.name === ""
          ? "Name cannot be empty"
          : newTodo && newTodo?.name?.length > 50
            ? "You have excceded maxium charater limit"
            : "",
    });

    if (
      newTodo &&
      (newTodo?.desc === "" ||
        newTodo?.name === "" ||
        newTodo?.name?.length > 50 ||
        newTodo?.desc?.length > 1000)
    ) {
      return false;
    }

    return true;
  };
  const handleConfirmNote = () => {
    setLoading(true);
    if (handleError()) {
      const todoListStore = localStorage.getItem("todoList");
      if (todo?.id) {
        let todoList: ITodoProp[] =
          todoListStore != null ? JSON.parse(todoListStore) : [];
        const updatedList = todoList.flatMap((item) => {
          if (item.id === todo.id) {
            return newTodo;
          } else {
            return item;
          }
        });
        localStorage.setItem("todoList", JSON.stringify(updatedList));
      } else {
        let todoList: ITodoProp[] =
          todoListStore != null ? JSON.parse(todoListStore) : [];
        const newId =
          todoList.length > 0
            ? Math.max(...todoList.map((item) => item.id || 0)) + 1
            : 1;
        const newTodoWithId: ITodoProp = {
          id: newId,
          name: newTodo?.name || "",
          desc: newTodo?.desc || "",
          color: newTodo?.color || "",
          dueDate: newTodo?.dueDate || undefined,
          status: newTodo?.status || "pending",
        };
        todoList.push(newTodoWithId);
        localStorage.setItem("todoList", JSON.stringify(todoList));
      }

      setTimeout(() => {
        setLoading(false);
        handleClose(true);
        alertSuccess({
          message: `${todo?.id ? "Create" : "Update"} the node successfully`,
        });
      }, 5 * 1000);
    } else setLoading(false);
  };

  const handleClose = (isChange: boolean = false) => {
    setNewTodo(defaultTodo);
    setDescError({ message: "" });
    setNameError({ message: "" });
    onClose(isChange);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (newTodo) setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
  };

  const handleChooseColor = (color: string) => {
    setNewTodo((prevState) => ({
      ...(prevState || {}),
      color,
      name: prevState?.name || "",
      desc: prevState?.desc || "",
      dueDate: prevState?.dueDate || undefined,
      status: prevState?.status || "pending",
    }));
  };

  useEffect(() => {
    setNewTodo(todo || defaultTodo);
  }, [todo]);

  const ColorOptions = useMemo(() => {
    return defaultColors.map((color) => (
      <StyledColor
        name="color"
        id="color"
        className="color__input"
        onClick={() => handleChooseColor(color)}
        key={color}
        $color={color}
        $isActive={newTodo?.color !== color}
      />
    ));
  }, [newTodo?.color]);

  return (
    <StyledModal onClose={handleClose} show={show} size="md">
      <StyledModalHeader>
        <ModalTitle>{todo != null ? "Edit Note" : "Create Note"}</ModalTitle>
        <StyledClose onClose={handleClose} disabled={loading}>
          <X size={20} />
        </StyledClose>
      </StyledModalHeader>
      <StyledBody>
        <Input
          type="text"
          name="name"
          id="name"
          className={classNames("name__input", {
            isBlock: todo?.isBlockedBy !== userId,
          })}
          placeholder="Title"
          value={newTodo?.name}
          onChange={handleChange}
          showErrorOnly
          disabled={loading}
          feedbackText={nameError.message}
          state={nameError.message !== "" ? "error" : "success"}
          showState={nameError.message !== ""}
        />
        <Textarea
          name="desc"
          id="desc"
          className={classNames("desc__input", {
            isBlock: todo?.isBlockedBy !== userId,
          })}
          placeholder="..."
          value={newTodo?.desc}
          onChange={handleChange}
          showErrorOnly
          disabled={loading}
          feedbackText={descError.message}
          state={descError?.message !== "" ? "error" : "success"}
          showState={descError?.message !== ""}
        />
        <StyledWrapColors>{ColorOptions}</StyledWrapColors>
      </StyledBody>
      <StyledFooter className="modal-footer">
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          disabled={
            loading ||
            (todo?.desc === newTodo?.desc &&
              todo?.name === newTodo?.name &&
              todo?.color === newTodo?.color) ||
            todo?.isBlockedBy !== userId
          }
          onClick={handleConfirmNote}
          className="btn-confirm"
        >
          {loading ? (
            <span className="loadingIcon">
              <Spinner size="xs" color="white" />
            </span>
          ) : todo != null ? (
            "Confirm"
          ) : (
            "Create"
          )}
        </Button>
      </StyledFooter>
    </StyledModal>
  );
});

export default TodoModal;

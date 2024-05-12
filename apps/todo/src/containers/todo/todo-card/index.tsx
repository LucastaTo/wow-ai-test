import { ChangeEvent, FC, useState } from "react";
import {
  StyleWrapperButton,
  StyledButon,
  StyledTodoCardBody,
  StyledTodoCardTitle,
  StyledWrapTodoCard,
} from "./style";
import { Check, Trash } from "react-feather";

interface IProps {
  name: string;
  descrtiption: string;
  status: "pending" | "completed";
  color: string;
  onClick: () => void;
  onDelete: (e: ChangeEvent) => void;
  onComplete: (e: ChangeEvent) => void;
}

const TodoCard: FC<IProps> = ({
  name,
  status,
  descrtiption,
  color,
  onClick,
  onDelete,
  onComplete,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <StyledWrapTodoCard
      $color={color}
      $status={status}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StyledTodoCardTitle>{name}</StyledTodoCardTitle>
      <StyledTodoCardBody>{descrtiption}</StyledTodoCardBody>
      {isHovered && (
        <StyleWrapperButton>
          {status === "pending" && (
            <StyledButon className="completed-button" onClick={onComplete}>
              <Check size={20} color="green" />
            </StyledButon>
          )}
          <StyledButon className="delete-button" onClick={onDelete}>
            <Trash size={20} color="red" />
          </StyledButon>
        </StyleWrapperButton>
      )}
    </StyledWrapTodoCard>
  );
};

export default TodoCard;

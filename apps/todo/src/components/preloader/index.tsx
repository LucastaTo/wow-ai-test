import { FC } from "react";
import { Spinner } from "@todo/ui";
import { StyledLoader } from "./style";

const Preloader: FC = () => {
    return (
        <StyledLoader>
            <Spinner size="lg" color="primary" />
        </StyledLoader>
    );
};

export default Preloader;

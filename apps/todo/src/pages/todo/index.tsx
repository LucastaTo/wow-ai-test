import React from "react";
import Layout from "../../layouts";
import Content from "../../layouts/content";
import TodoContainer from "src/containers/todo";

const Todo: React.FC = () => {
    return (
        <Layout>
            <Content fullHeight>
                <TodoContainer />
            </Content>
        </Layout>
    );
};

export default Todo;

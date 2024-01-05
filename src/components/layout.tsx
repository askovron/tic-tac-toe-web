import { Container, Flex } from "@mantine/core";
import { FC, ReactNode } from "react";
import { Header } from "./header";

type TLayout = {
  children?: ReactNode;
};

export const Layout: FC<TLayout> = ({ children }) => {
  return (
    <Container p="sm" style={{ height: "100vh" }}>
      <Flex
        style={{ height: "100%" }}
        align="center"
        direction="column"
        justify="space-between"
      >
        <Header />
        {children}
      </Flex>
    </Container>
  );
};

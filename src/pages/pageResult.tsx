import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../authContext";
import { Anchor, Flex, Group, Text } from "@mantine/core";
import { Layout } from "../components/layout";

const generateResultString = (result?: string) => {
  return {
    win: "You win 🏆",
    loose: "You loose 🤙",
    tie: "It's a tie 🥔",
  }[result as string];
};

export const PageResult = () => {
  const { user } = useAuth();
  const { result } = useParams();

  if (!user) return <Navigate to="/" />;

  return (
    <Layout>
      <Flex m="auto" direction="column" align="center">
        <Text size="xl">{generateResultString(result)}</Text>
        <Group mt="3rem">
          <Anchor component={Link} to="/game">
            Start new game
          </Anchor>
          |
          <Anchor component={Link} to="/history">
            View history
          </Anchor>
        </Group>
      </Flex>
    </Layout>
  );
};

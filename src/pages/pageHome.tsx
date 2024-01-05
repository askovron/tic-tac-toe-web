import { Anchor, Flex, List, Text } from "@mantine/core";
import { Layout } from "../components/layout";
import { useAuth } from "../authContext";
import { Link } from "react-router-dom";

const anonymousText = (
  <List type="unordered">
    <List.Item>
      <Text>You must be logged in to play games.</Text>
    </List.Item>
    <List.Item>
      <Text>
        Use the following link to navigate to{" "}
        <Anchor component={Link} to="/login">
          the login page
        </Anchor>{" "}
        and follow instructions.
      </Text>
    </List.Item>
  </List>
);
const loggedInText = (
  <List type="unordered">
    <List.Item>
      <Text>
        Start{" "}
        <Anchor component={Link} to="/game">
          new game
        </Anchor>
        .
      </Text>
    </List.Item>
    <List.Item>
      <Text>
        Browse recent{" "}
        <Anchor component={Link} to="/history">
          game history
        </Anchor>
        .
      </Text>
    </List.Item>
  </List>
);

export const PageHome = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <Flex m="auto" dir="column">
        {!user ? anonymousText : loggedInText}
      </Flex>
    </Layout>
  );
};

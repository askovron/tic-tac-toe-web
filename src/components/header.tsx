import { useAuth } from "../authContext";
import { Flex, Space, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { Anchor } from "@mantine/core";

export const Header = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Flex>
      <Anchor mr="auto" component={Link} to="/">
        Home
      </Anchor>
      <Space w="xs" />
      |
      <Space w="xs" />
      <Text>
        Logged in as <b>{user.email}</b>
      </Text>
    </Flex>
  );
};

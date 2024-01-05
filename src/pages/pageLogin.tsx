import { useAuth, LS_USER_EMAIL } from "../authContext";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Text,
  Paper,
  Group,
  Button,
  Stack,
  Container,
} from "@mantine/core";
import { useCallback, useState } from "react";
import { auth } from "../firebaseApp";
import { sendSignInLinkToEmail } from "firebase/auth";
import { Navigate } from "react-router-dom";

type TLoginForm = {
  email: string;
};

export const PageLogin = () => {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const form = useForm<TLoginForm>({
    initialValues: {
      email: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
    },
  });
  const submitForm = useCallback(({ email }: TLoginForm) => {
    sendSignInLinkToEmail(auth, email, {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: import.meta.env.VITE_CURRENT_HOST,
      // This must be true.
      handleCodeInApp: true,
    })
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem(LS_USER_EMAIL, email);
        notifications.show({
          title: "Email has been sent",
          message:
            "Use the link that was sent to you to log in. You can close this window.",
          color: "green",
        });
        setSent(true);
      })
      .catch((error) => {
        console.error(error);
        notifications.show({
          message: "Error during sending link to email, please try again.",
          color: "red",
        });
      });
  }, []);

  if (user) return <Navigate to="/" />;

  return (
    <Container p="sm" style={{ height: "100vh" }}>
      <Paper radius="md" p="xl" w="30rem" withBorder m="auto">
        <Text size="lg" fw={500}>
          Welcome to Tic Tac Toe Web
        </Text>

        <form onSubmit={form.onSubmit(submitForm)}>
          <Stack mt={10}>
            <TextInput
              required
              label="Enter your email"
              placeholder="email@dot.com"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius="md"
            />
            <Text size="sm" c="dimmed">
              After submission you should receive an email with the login link.
            </Text>
          </Stack>

          <Group justify="center" mt="xl">
            <Button
              type="submit"
              rightSection={sent ? "✅" : null}
              disabled={sent}
            >
              All set
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

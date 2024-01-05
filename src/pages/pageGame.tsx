import { useAuth } from "../authContext";
import { useGameRoom } from "../useGameRoom";
import { Flex, Title, Text, Skeleton } from "@mantine/core";
import { Navigate } from "react-router-dom";
import { Layout } from "../components/layout";
import "./game.css";

const getHelperText = (isYourMove: boolean) =>
  isYourMove ? "Your move." : "Wait for your turn.";

export const PageGame = () => {
  const { user } = useAuth();
  const { gameBoard, gameRoom, matchmaking, handleCellClick, currentPlayerId } =
    useGameRoom();
  const isYourMove = currentPlayerId === user?.email;

  if (user == null) return <Navigate to="/" />;

  return (
    <Layout>
      <Flex m="auto" direction="column">
        {matchmaking ? (
          <>
            <Text m="auto">Matchmaking...</Text>
            <Skeleton w={375} h={375} mt="2rem" />
          </>
        ) : (
          <>
            <Title order={3}>Room: {gameRoom?.key}</Title>
            <Text>{getHelperText(isYourMove)}</Text>
            <div
              id="game-board"
              className={`board ${isYourMove ? "" : "disalbed"}`}
            >
              {gameBoard.map((value, index) => (
                <div
                  key={index}
                  className="cell"
                  onClick={() => handleCellClick(index)}
                >
                  {value}
                </div>
              ))}
            </div>
          </>
        )}
      </Flex>
    </Layout>
  );
};

PageGame.whyDidYouRender = true;

import {
  DatabaseReference,
  child,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { useAuth } from "./authContext";
import { useEffect, useRef, useState } from "react";
import { database } from "./firebaseApp";
import { useNavigate } from "react-router-dom";
import { playSound, TABLE_GAME_ROOMS, TABLE_HISTORY } from "./helpers";

const NEW_GAME_BOARD: TCellState[] = Array(9).fill("");

export const useGameRoom = () => {
  const { user } = useAuth();
  const [gameRoom, setGameRoom] = useState<DatabaseReference>();
  const [currentPlayer, setCurrentPlayer] = useState<TCellState>("");
  const [gameBoard, setGameBoard] = useState<TCellState[]>(NEW_GAME_BOARD);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>();
  const [matchmaking, setMatchmaking] = useState<boolean>(true);
  const activeListeners = useRef<(() => unknown)[]>([]);
  const navigate = useNavigate();

  const endGame = (winner?: Omit<TCellState, "">) => {
    if (!gameRoom) return;

    activeListeners.current.forEach((unsubscribe) => unsubscribe());

    const gameRoomRef = ref(database, `${TABLE_GAME_ROOMS}/${gameRoom!.key}`);

    onValue(
      gameRoomRef,
      (snapshot) => {
        const gameRoomResult = snapshot.val();
        let winnerPlayerId;

        try {
          winnerPlayerId = {
            X: gameRoomResult.host,
            O: gameRoomResult.guest,
            undefined: "0",
          }[winner as string];
        } catch (e) {
          // room was deleted, most probably you loose
        }

        navigate(
          winnerPlayerId === "0"
            ? "/result/tie"
            : winnerPlayerId === user?.email
            ? "/result/win"
            : "/result/loose"
        );

        if (winnerPlayerId === user?.email) {
          remove(gameRoomRef);
          set(push(ref(database, TABLE_HISTORY)), {
            host: gameRoomResult.host,
            guest: gameRoomResult.guest,
            winner: winnerPlayerId,
            createdAt: Date.now(),
          });
        }
      },
      {
        onlyOnce: true,
      }
    );
  };
  const checkWinner: (nextGmeBoard: TCellState[]) => void = (nextGmeBoard) => {
    const winningCombinations: number[][] = [
      // Rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonals
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        nextGmeBoard[a] &&
        nextGmeBoard[a] === nextGmeBoard[b] &&
        nextGmeBoard[a] === nextGmeBoard[c]
      ) {
        endGame(nextGmeBoard[a]);
        return;
      }
    }

    // Check for a tie
    if (!nextGmeBoard.includes("")) {
      endGame();
    }
  };
  const handleCellClick = (index: number) => {
    if (
      !gameRoom ||
      matchmaking ||
      gameBoard[index] !== "" ||
      currentPlayerId !== user?.email
    ) {
      return;
    }

    const newGameBoard = [...gameBoard];
    newGameBoard[index] = currentPlayer;
    setGameBoard(newGameBoard);

    // Update the game state in the database
    update(ref(database, `${TABLE_GAME_ROOMS}/${gameRoom.key}`), {
      gameState: newGameBoard,
      lastMove: user!.email,
    });
  };

  useEffect(() => {
    if (!user) return;

    const gameRoomsRef = ref(database, TABLE_GAME_ROOMS);
    onValue(
      gameRoomsRef,
      (snapshot) => {
        const gameRooms = snapshot.val();

        if (gameRooms) {
          const availableRoom = Object.keys(gameRooms).find(
            (roomId) =>
              gameRooms[roomId].guest === "" &&
              gameRooms[roomId].host != user?.email
          );

          if (availableRoom) {
            const availableRoomRef = ref(
              database,
              `${TABLE_GAME_ROOMS}/${availableRoom}`
            );
            set(child(availableRoomRef, "guest"), user!.email);
            setGameRoom(availableRoomRef);

            return;
          }
        }

        const newRoomRef = push(gameRoomsRef);

        set(newRoomRef, {
          host: user!.email,
          guest: "",
          lastMove: "",
          gameState: NEW_GAME_BOARD,
        });

        setGameRoom(newRoomRef);
      },
      {
        onlyOnce: true,
      }
    );
  }, [user]);

  useEffect(() => {
    if (!gameRoom) return;

    // Listen for changes in the game state in the newly created room
    activeListeners.current.push(
      onValue(gameRoom, (gameRoomSnapshot) => {
        const gameRoom: TGameRoom = gameRoomSnapshot.val();
        if (!gameRoom) return;

        playSound();

        checkWinner(gameRoom.gameState);
        const firstMove = gameRoom.lastMove === "";

        setGameBoard(gameRoom.gameState);

        const nextPlayerId = firstMove
          ? gameRoom.host
          : gameRoom.lastMove === gameRoom.host
          ? gameRoom.guest!
          : gameRoom.host;
        setCurrentPlayerId(nextPlayerId);

        const amIHost = user?.email === gameRoom.host;
        const myChar = amIHost ? "X" : "O";
        const guestChar = amIHost ? "O" : "X";
        const nextplayer = nextPlayerId === user?.email ? myChar : guestChar;
        setCurrentPlayer(nextplayer);

        const mm = gameRoom.host === "" || gameRoom.guest === "";
        setMatchmaking(mm);
      })
    );
  }, [gameRoom]);

  useEffect(
    () => () => {
      endGame(currentPlayer === "X" ? "O" : "X");
    },
    []
  );

  return {
    gameRoom,
    gameBoard,
    currentPlayerId,
    currentPlayer,
    endGame,
    matchmaking,
    handleCellClick,
  };
};

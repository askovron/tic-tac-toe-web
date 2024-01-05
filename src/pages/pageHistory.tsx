import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Anchor, Flex } from "@mantine/core";
import { useAuth } from "../authContext";
import { Layout } from "../components/layout";
import { database } from "../firebaseApp";
import { TABLE_HISTORY } from "../helpers";
import { onValue, ref } from "firebase/database";
import { HistoryTable, type THistoryRecord } from "../components/historyTable";

const MAX_DISPLAY_ROWS = 15;

export const PageHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<THistoryRecord[]>([]);

  useEffect(() => {
    onValue(
      ref(database, TABLE_HISTORY),
      (snapshot) => {
        const historyRecords: Record<string, THistoryRecord> = snapshot.val();

        if (!historyRecords) return;

        setHistory(
          Object.values(historyRecords)
            .filter(
              ({ host, guest }: THistoryRecord) =>
                host === user?.email || guest === user?.email
            )
            .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
            .slice(0, MAX_DISPLAY_ROWS)
        );
      },
      {
        onlyOnce: true,
      }
    );
  }, []);

  if (!user) return <Navigate to="/" />;

  return (
    <Layout>
      <Flex m="auto" direction="column" align="center">
        <HistoryTable data={history} />
        <Anchor mt="3rem" component={Link} to="/game">
          Start new game
        </Anchor>
      </Flex>
    </Layout>
  );
};

import { FC } from "react";
import { Table, Text, Title, Tooltip } from "@mantine/core";
import { useAuth } from "../authContext";

export type THistoryRecord = Pick<TGameRoom, "host" | "guest"> & {
  winner: TGameRoom["host"];
  createdAt?: number;
};

const highlightCurrentUser = (str?: string, email?: string) =>
  str?.length && str === email ? <b>{str}</b> : str;

export const HistoryTable: FC<{ data: THistoryRecord[] }> = ({ data }) => {
  const { user } = useAuth();
  if (data.length === 0) return <Text>The history is empty at the moment</Text>;

  return (
    <>
      <Tooltip label="15 games max">
        <Title mb="2rem" order={3}>
          Most recent games:
        </Title>
      </Tooltip>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Host / X</Table.Th>
            <Table.Th>Guest / O</Table.Th>
            <Table.Th>Winner</Table.Th>
            <Table.Th>Played date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map(({ host, guest, winner, createdAt }, idx) => (
            <Table.Tr key={idx}>
              <Table.Td>{highlightCurrentUser(host, user?.email)}</Table.Td>
              <Table.Td>{highlightCurrentUser(guest, user?.email)}</Table.Td>
              <Table.Td>{highlightCurrentUser(winner, user?.email)}</Table.Td>
              <Table.Td>
                {createdAt ? new Date(createdAt).toLocaleString() : ""}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
};

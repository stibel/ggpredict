import { debounce, has } from "lodash";
import { useEffect, useState } from "react";
import {
  useGetPlayersByPageQuery,
  useGetPlayersByPhraseQuery,
} from "../../services/players";
import { Player } from "../../types/player";
import { Page } from "../page";

interface TableCellProps {
  player: Player;
}

const TableCell = ({
  player: {
    name,
    nick,
    rankingPosition,
    team: { name: teamName },
  },
}: TableCellProps) => {
  return (
    <div style={{ width: "100%", display: "flex", height: "4vh" }}>
      <div style={{ width: "50%", textAlign: "left" }}>
        {name} - {nick}
      </div>
      <div style={{ width: "25%", textAlign: "left" }}>
        {rankingPosition || "X"}
      </div>
      <div style={{ width: "25%", textAlign: "left" }}>{teamName || "X"}</div>
    </div>
  );
};

export const Table = () => {
  const [page, setPage] = useState(0);
  const [phrase, setPhrase] = useState("");
  const [totalPages, setTotalPages] = useState();
  const [byPages, setByPages] = useState(true);
  const [playersShown, setPlayersShown] = useState(0);
  const { data, isLoading } = useGetPlayersByPageQuery(page.toString());
  const { data: searchData } = useGetPlayersByPhraseQuery(phrase);

  useEffect(() => {
    if (byPages) {
      if (data) {
        setTotalPages(data.totalPages);
        setPlayersShown(data.numberOfElements);
      }
    } else {
      if (searchData) {
        setTotalPages(searchData.totalPages);
        setPlayersShown(searchData.numberOfElements);
      }
    }
  }, [byPages, data, searchData]); //couldn't come up with anything smarter

  const debouncedSetPhrase = debounce((phrase) => setPhrase(phrase), 500);

  const handleInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setByPages(!value);
    debouncedSetPhrase(value);
  };

  return (
    <Page>
      <main
        style={{
          width: "80%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexFlow: "column",
          color: "#FFFAF0",
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          onChange={handleInputChange}
        />
        <div
          style={{
            padding: 5,
            margin: 5,
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            width: "100%",
            height: "80vh",
            border: "1px solid #FFFAF0",
          }}
        >
          {isLoading ? (
            <h2>Loading...</h2>
          ) : byPages ? (
            data.content.map((player: Player) => {
              return <TableCell key={player.id} player={player} />;
            })
          ) : has(searchData, "content") ? (
            searchData.content.map((player: Player) => {
              return <TableCell key={player.id} player={player} />;
            }) //display full list if no search phrase, display no results if no search matches
          ) : (
            <h2>No results</h2>
          )}
        </div>
        <footer
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            style={{ width: "10%" }}
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
          >
            Previous
          </button>
          <div style={{ width: "40%", textAlign: "center" }}>
            {byPages && `Page ${page + 1} of ${isLoading ? "?" : totalPages}`}
          </div>
          <div style={{ width: "40%", textAlign: "center" }}>
            {isLoading
              ? "?"
              : `${playersShown} ${playersShown > 1 ? "players" : "player"}`}
          </div>
          <button
            style={{ width: "10%" }}
            onClick={() => setPage(page + 1)}
            disabled={!totalPages || page === totalPages - 1}
          >
            Next
          </button>
        </footer>
      </main>
    </Page>
  );
};

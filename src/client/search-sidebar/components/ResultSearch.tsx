import {
  Button,
  Form,
  Image,
  InputGroup,
  ListGroup,
  Spinner,
} from 'react-bootstrap';
import CopyButton from '../../CopyButton.tsx';
import { ResultSearchType } from './Search';
import { serverFunctions } from '../../utils/serverFunctions.ts';
import React, { useState } from 'react';

const ResultSearch = ({
  resultSearch,
  setErrorMessage,
  setShowError,
}: {
  resultSearch: ResultSearchType;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setShowError: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);

  const player = JSON.parse(resultSearch.player);
  const code = resultSearch.code;
  const items = JSON.parse(resultSearch.items);
  const playerItems = JSON.parse(player.items);

  const [playerName, setPlayerName] = useState(player.name);
  const [playerClan, setPlayerClan] = useState(player.clan);
  const [selectedItems, setSelectedItems] = useState(
    new Set(playerItems?.map((item: { name: string }) => item.name) || [])
  );

  const toggleItem = (itemName: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(itemName) ? newSet.delete(itemName) : newSet.add(itemName);
      return newSet;
    });
  };

  const sentInfo = async () => {
    setLoading(true);
    try {
      await serverFunctions.updatePlayer(
        player.id,
        playerName,
        Array.from(selectedItems) as string[],
        player.clan
      );
    } catch (error: any) {
      setErrorMessage(
        error.message.replace(/^Error:\s*/, '') || 'Не удалось обновить данные'
      );
      setShowError(true);
    } finally {
      setLoading(false);
      setPlayerClan(true);
    }
  };

  return (
    <>
      <hr className="my-2" />
      <InputGroup size="sm" className="p-2">
        <InputGroup.Text>Имя:</InputGroup.Text>
        <Form.Control
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <InputGroup.Text>ж.р.</InputGroup.Text>
        <InputGroup.Checkbox
          aria-label="sex"
          className="mt-0"
          checked={!!player.sex}
          disabled
        />
        <CopyButton text={player} />
      </InputGroup>
      <InputGroup size="sm" className="p-2">
        <InputGroup.Text>Код:</InputGroup.Text>
        <Form.Control as="textarea" rows={1} value={code} readOnly />
        <CopyButton text={code} />
      </InputGroup>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(70vh)',
        }}
      >
        <h6 className="text-center">Предметы</h6>

        <ListGroup
          className="px-2 pb-1 flex-grow-1"
          data-bs-spy="scroll"
          style={{
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          {items.map((elem: { name: string; url: string }, index: number) => (
            <ListGroup.Item
              key={index}
              className="d-flex align-items-center"
              style={{ cursor: 'pointer' }}
              data-column-index={index + 1}
              onClick={
                player.row !== null
                  ? async () =>
                      await serverFunctions.activateCell(player.row, index + 1)
                  : undefined
              }
            >
              <Form.Check
                aria-label={index.toString()}
                className="me-1"
                checked={selectedItems.has(elem.name)}
                onChange={() => toggleItem(elem.name)}
                onClick={(event) => event.stopPropagation()}
              />
              <Image src={elem.url} className="me-1" width={25} height={25} />
              <span style={{ fontSize: '0.9rem' }}>{elem.name}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {!playerClan && (
          <div className="d-flex align-items-center text-muted small m-1">
            <span className="mx-2 text-danger">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-exclamation-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
              </svg>
            </span>
            <span style={{ fontSize: '0.75rem' }}>
              Игрок не найден — будет добавлен в таблицу
            </span>
          </div>
        )}

        <Button
          variant="success"
          className="d-block mx-auto"
          size="sm"
          disabled={loading}
          onClick={sentInfo}
        >
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            'Обновить информацию в таблице'
          )}
        </Button>
      </div>
    </>
  );
};

export default ResultSearch;

import { useState, useEffect } from 'react';
import { serverFunctions } from '../../utils/serverFunctions.ts';
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  ProgressBar,
  Row,
} from 'react-bootstrap';
import CopyButton from '../../CopyButton.tsx';
import { ErrorToast } from '../../ErrorToast.tsx';

const ProgressMenu = () => {
  const [playerCount, setPlayerCount] = useState<number | null>(0);
  const [maxPlayers, setMaxPlayers] = useState(-1);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    serverFunctions.startChecking().catch(async (error: any) => {
      setErrorMessage(
        error.message.replace(/^Error:\s*/, '') ||
          'Не удалось запустить проверку'
      );
      setShowError(true);
      setTimeout(async () => {
        // @ts-ignore
        await google.script.host.close();
      }, 4000);
    });

    const interval = setInterval(async () => {
      const count = await serverFunctions.getCurrentPlayers();
      setPlayerCount(count);

      setMaxPlayers((prevMaxPlayers) => {
        if (prevMaxPlayers === -1 && count !== null) {
          return count;
        }
        return prevMaxPlayers;
      });

      if (count === null) {
        const result = await serverFunctions.getIdToDelete(false);
        if (result) {
          setIdsToDelete(result.split(','));
        }
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getStatusMessage = (playerCount: number | null) => {
    switch (playerCount) {
      case -1:
        return 'Проставление ссылок...';
      case -2:
        return 'Сортировка...';
      default:
        return 'Проверка профилей...';
    }
  };

  return (
    <>
      {playerCount !== null && (
        <>
          <h6>Пожалуйста, подождите...</h6>
          <p>{getStatusMessage(playerCount)}</p>
        </>
      )}

      {playerCount !== null && maxPlayers !== -1 && (
        <ProgressBar now={((maxPlayers - playerCount) * 100) / maxPlayers} />
      )}

      {playerCount === null && (
        <>
          <InputGroup size="sm" className="p-2">
            <InputGroup.Text>Игроки не в клане :</InputGroup.Text>
            <Form.Control
              as="textarea"
              rows={2}
              value={idsToDelete.join(' ')}
              readOnly
            />
            <CopyButton text={idsToDelete.join(' ')} />
          </InputGroup>
          <Container>
            <Row>
              <Col xs={6}>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={async () => {
                    await serverFunctions.openDeletePlayersSidebar();
                    // @ts-ignore
                    await google.script.host.close();
                  }}
                >
                  Удалить игроков
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  variant="danger"
                  className="w-100"
                  onClick={async () => {
                    // @ts-ignore
                    await google.script.host.close();
                  }}
                >
                  Закрыть окно
                </Button>
              </Col>
            </Row>
          </Container>
        </>
      )}

      {showError && <ErrorToast {...{ errorMessage, setShowError }} />}
    </>
  );
};

export default ProgressMenu;

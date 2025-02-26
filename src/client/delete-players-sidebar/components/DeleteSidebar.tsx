import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { serverFunctions } from '../../utils/serverFunctions.ts';
import PlayerList from './PlayerList.tsx';
import { ErrorToast } from '../../ErrorToast.tsx';

const DeleteSidebar = () => {
  const [ids, setIds] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [idList, setIdList] = useState<number[]>([]);

  useEffect(() => {
    serverFunctions
      .getIdToDelete(true)
      .then((idList: string) => {
        if (idList) setIds(idList.replace(/,/g, ' '));
      })
      .catch((error: any) => {
        console.error('Ошибка при получении ID:', error);
        setErrorMessage('Не удалось загрузить список ID');
        setShowError(true);
      });
  }, []);

  const handleIdsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setIds(value);
    setIsValid(/\d+(?:[ ,;]\d+)*/g.test(value));
  };

  const handleDeleting = async () => {
    if (!isValid) return;
    const matchedIds = ids.match(/\d+/g)?.map(Number) || [];

    if (matchedIds.length === 0) {
      setErrorMessage('Введите ID');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      setShowPlayerList(false); // Скрываем PlayerList перед обновлением данных
      setTimeout(() => {
        setIdList(matchedIds);
        setShowPlayerList(true); // Снова показываем после обновления idList
      }, 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form noValidate>
        <InputGroup hasValidation size="sm" className="p-2">
          <InputGroup.Text>ID:</InputGroup.Text>
          <Form.Control
            aria-label="ID"
            as="textarea"
            rows={2}
            value={ids}
            onChange={handleIdsChange}
            isInvalid={!isValid}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip>
            Введите корректные ID (через запятую, точку с запятой и/или пробел)
          </Form.Control.Feedback>
        </InputGroup>

        <Button
          type="submit"
          variant="secondary"
          size="sm"
          className="d-block mx-auto"
          disabled={loading}
          onClick={handleDeleting}
        >
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            'Удалить игроков'
          )}
        </Button>
      </Form>

      {showError && <ErrorToast {...{ errorMessage, setShowError }} />}

      {showPlayerList && <PlayerList idList={idList} key={idList.join(' ')} />}
    </>
  );
};

export default DeleteSidebar;

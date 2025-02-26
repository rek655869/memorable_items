import { Button, ListGroup, Spinner } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from 'react';
import { serverFunctions } from '../../utils/serverFunctions.ts';
import { ErrorToast } from '../../ErrorToast.tsx';

const PlayerList: React.FC<{ idList: number[] }> = ({ idList }) => {
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statuses, setStatuses] = useState<
    Record<number, 'default' | 'active' | 'disabled' | 'danger'>
  >({});

  const isDeletingRef = useRef(isDeleting);

  const startDeleting = async () => {
    if (idList.length === 0) return;
    setStatuses({});
    setShowError(false);
    setErrorMessage('');

    const uniqueIds = Array.from(new Set(idList));
    setStatuses(Object.fromEntries(uniqueIds.map((id) => [id, 'default'])));
    isDeletingRef.current = true;
    setIsDeleting(true);

    for (const id of idList) {
      if (!isDeletingRef.current) break;
      setStatuses((prev) => ({ ...prev, [id]: 'active' }));

      try {
        await serverFunctions.deletePlayer(id); // Ждём завершения удаления
        setStatuses((prev) => ({ ...prev, [id]: 'disabled' }));
      } catch (error: any) {
        setStatuses((prev) => ({ ...prev, [id]: 'danger' }));
        setErrorMessage(
          error.message.replace(/^Error:\s*/, '') ||
            'Не удалось удалить игрока с ID ' + id
        );
        setShowError(true);
      }
    }
    setIsDeleting(false);
    setLoading(false);
  };

  const stopDeleting = () => {
    setLoading(true);
    isDeletingRef.current = false;
    setIsDeleting(false);
  };

  useEffect(() => {
    startDeleting();
  }, [idList]);

  return (
    <>
      <hr className="my-2" />
      <h6 className="text-center">Удаляемые ID</h6>

      <ListGroup
        className="px-2 flex-grow-1"
        data-bs-spy="scroll"
        style={{
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        {idList.map((elem: number, index: number) => (
          <ListGroup.Item
            key={index}
            className="d-flex align-items-center"
            variant={
              statuses[elem] === 'active'
                ? 'primary'
                : statuses[elem] === 'disabled'
                ? 'secondary'
                : statuses[elem] === 'danger'
                ? 'danger'
                : ''
            }
          >
            <span style={{ fontSize: '0.9rem' }}>{elem}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Button
        variant="danger"
        className="d-block mx-auto mt-2"
        size="sm"
        disabled={loading || !isDeleting}
        onClick={stopDeleting}
      >
        {loading ? (
          <Spinner as="span" animation="border" size="sm" />
        ) : (
          'Остановить'
        )}
      </Button>

      {showError && <ErrorToast {...{ errorMessage, setShowError }} />}
    </>
  );
};

export default PlayerList;

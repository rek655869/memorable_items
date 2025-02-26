import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import React, { useState } from 'react';
import { serverFunctions } from '../../utils/serverFunctions.ts';
import ResultSearch from './ResultSearch.tsx';
import { ErrorToast } from '../../ErrorToast.tsx';

interface ResultSearch {
  player: string;
  code: string;
  items: string;
}

const Search = () => {
  const [id, setId] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resultSearch, setResultSearch] = useState<ResultSearch | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setId(value);
    setIsValid(/^\d*$/.test(value));
  };

  const handleSearch = async () => {
    if (!isValid) return;
    setResultSearch(null);
    setLoading(true);
    try {
      const result = await serverFunctions.search(parseInt(id));
      setResultSearch(result);
      if (result === null) {
        setErrorMessage('Не удалось найти игрока');
        setShowError(true);
      }
    } catch (error: any) {
      setErrorMessage(
        error.message.replace(/^Error:\s*/, '') || 'Не удалось выполнить поиск'
      );
      setShowError(true);
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
            value={id}
            onChange={handleIdChange}
            isInvalid={!isValid}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip>
            Введите корректный ID
          </Form.Control.Feedback>
        </InputGroup>

        <Button
          type="submit"
          variant="secondary"
          size="sm"
          className="d-block mx-auto"
          disabled={loading}
          onClick={handleSearch}
        >
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            'Найти игрока'
          )}
        </Button>
      </Form>

      {showError && <ErrorToast {...{ errorMessage, setShowError }} />}

      {resultSearch && (
        <ResultSearch {...{ resultSearch, setErrorMessage, setShowError }} />
      )}
    </>
  );
};

export default Search;
export type { ResultSearch as ResultSearchType };

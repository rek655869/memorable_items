import { Col, Row, Toast } from 'react-bootstrap';
import React from 'react';

export const ErrorToast = ({
  errorMessage,
  setShowError,
}: {
  errorMessage: string;
  setShowError: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Toast
      className="position-absolute top-50 start-50 translate-middle"
      onClose={() => setShowError(false)}
      bg="danger"
      show={true}
      delay={4000}
      autohide
    >
      <Toast.Body className="text-white">
        <Row className="align-items-center">
          <Col>{errorMessage}</Col>
          <Col xs="auto">
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Закрыть"
              onClick={() => setShowError(false)}
            />
          </Col>
        </Row>
      </Toast.Body>
    </Toast>
  );
};

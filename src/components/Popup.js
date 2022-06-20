import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

function Popup(props) {
  const [modalProps, setModalProps] = useState({});

  useEffect(() => {
    const obj = { ...props };
    const entries = Object.entries(obj);
    const filtered = entries.filter(
      ([key, value]) => key === "show" || key === "onHide"
    );

    setModalProps(Object.fromEntries(filtered));
  }, [props]);

  return (
    <>
      <Modal
        {...modalProps}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <h5 style={{ fontWeight: "700" }}>Delete Comment</h5>
          <p>
            Are you sure you want to delete this comment? This will remove the
            comment and can't be undone.
          </p>
          <div className="d-flex justify-content-between my-3">
            <Button
              variant="secondary btn-md rounded-3"
              style={{
                backgroundColor: "hsl(211, 10%, 45%)",
                boxShadow: "none",
              }}
              onClick={props.onHide}
            >
              NO, CANCEL
            </Button>
            <Button
              variant="primary btn-md rounded-3 border-0"
              style={{
                backgroundColor: "hsl(358, 79%, 66%)",
                boxShadow: "none",
              }}
              onClick={props.handleDelete}
            >
              YES, DELETE
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Popup;

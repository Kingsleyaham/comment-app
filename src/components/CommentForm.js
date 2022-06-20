import { Suspense } from "react";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
const CommentForm = (props) => {
  const [comment, setComment] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setReply(props.replyClicked ? `@${props.action.username} ` : "");
  }, [props.replyClicked, props.action.username]);

  useEffect(() => {
    setComment(props.editClicked ? `${props.action.comment} ` : "");
  }, [props.editClicked, props.action.comment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.disabled = true;
    if (!comment) {
      return setError(!error);
    }

    props.saveComment({
      id: props.currentUser._id,
      comment: comment,
    });

    setComment("");
    e.target.disabled = false;
  };

  const handleClick = (e, action) => {
    e.preventDefault();
    e.target.disabled = true;

    if (action.type === "reply") {
      if (!reply) return setError(!error);
      handleReply(action);
    }

    if (action.type === "edit") {
      if (!comment) return setError(!error);
      handleEdit(action);
    }
    e.target.disabled = false;
  };

  const handleEdit = (action) => {
    action.replyId
      ? props.updateComment({ id: action.id, comment, replyId: action.replyId })
      : props.updateComment({ id: action.id, comment });

    setComment("");
    props.setAction({});
    props.setEditClicked(false);
  };

  const handleReply = (action) => {
    props.saveReply({
      id: action.id,
      userId: props.currentUser._id,
      replyingTo: action.username,
      comment: reply.slice(action.username.length + 2, reply.length),
    });

    setReply("");
    props.setAction({});
    props.setReplyClicked(false);
  };

  const clearError = () => setError(false);

  return (
    <Card className="mt-4">
      <Card.Body>
        <Form>
          <Row className="comment">
            <Col
              lg={{ order: "first", span: 1 }}
              xs={{ order: "last", span: 6 }}
              className="currentImage"
            >
              <Suspense>
                <Image
                  src={`${props.imagePath}/${props.currentUser.image}`}
                  roundedCircle
                />
              </Suspense>
            </Col>
            <Col lg={9}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Control
                  as="textarea"
                  rows={3}
                  style={{
                    resize: "none",
                  }}
                  placeholder="Add a comment..."
                  value={!props.replyClicked ? comment : reply}
                  onChange={
                    !props.replyClicked
                      ? (e) => setComment(e.target.value)
                      : (e) => setReply(e.target.value)
                  }
                  onFocus={clearError}
                  className={error ? "error" : ""}
                />
              </Form.Group>
            </Col>
            <Col lg={2} xs={{ order: "last", span: 6 }} className="sendBtn">
              {props.action.type ? (
                <Button
                  variant="primary"
                  type="submit"
                  size="md"
                  className="send"
                  onClick={(e) => handleClick(e, props.action)}
                >
                  {props.action.type === "reply" ? "REPLY" : "UPDATE"}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  size="md"
                  onClick={(e) => handleSubmit(e)}
                  className="send"
                >
                  SEND
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CommentForm;

import moment from "moment";
import { Badge, Card, Col, Image, Row } from "react-bootstrap";
import iconPlus from "../img/icon-plus.svg";
import iconMinus from "../img/icon-minus.svg";
import iconReply from "../img/icon-reply.svg";
import iconDelete from "../img/icon-delete.svg";
import iconEdit from "../img/icon-edit.svg";
import CommentForm from "./CommentForm";
import { Suspense, useState, useEffect, useRef } from "react";
import axios from "axios";
import Popup from "./Popup";

const Comment = (props) => {
  const [currentUser, setCurrentUser] = useState({});
  const [action, setAction] = useState({});
  const [replyClicked, setReplyClicked] = useState(false);
  const [editClicked, setEditClicked] = useState(false);

  let imagePath = "./img/avatars";
  let comments = props.comments;
  let user = props.user ? props.user : "";

  const replyBox = useRef(null);

  useEffect(() => {
    const getUserRecords = async () => {
      try {
        const response = await axios.get(`/api/user/${user}`);
        setCurrentUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUserRecords();
  }, [user]);

  const handleCommentScore = (eventType, id, ...arg) => {
    arg.length === 2
      ? props.handleScore({
          id,
          replyId: arg[1],
          score: arg[0],
          type: eventType,
        })
      : props.handleScore({ id, score: arg[0], type: eventType });
  };

  const displayReplyBox = (id, username) => {
    replyBox.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    // document.sc;
    setReplyClicked(true);
    setEditClicked(false);
    setAction({ id, username, type: "reply" });

    replyBox.current.querySelector("textarea").focus(); //set focus on reply comment box
  };

  const displayEditBox = (id, comment, ...arg) => {
    replyBox.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    setEditClicked(true);
    setReplyClicked(false);

    // add reply id to set action object if reply is clicked
    arg[0]
      ? setAction({ id, comment, type: "edit", replyId: arg[0] })
      : setAction({ id, comment, type: "edit" });

    replyBox.current.querySelector("textarea").focus(); //set focus on reply comment box
  };

  return (
    <div>
      <Suspense fallback={<h1>Loading...</h1>}>
        {comments.map((comment) => (
          <div key={comment._id} id={comment._id}>
            <Row>
              <Card>
                <Card.Body>
                  <Row>
                    <Col
                      lg={{ order: "first", span: 1 }}
                      xs={{ order: "last", span: 6 }}
                      className="likeBtn"
                    >
                      <Row>
                        <Image
                          src={iconPlus}
                          roundedCircle
                          onClick={(e) =>
                            handleCommentScore(
                              "increment",
                              comment._id,
                              comment.score
                            )
                          }
                        />
                        <span>{comment.score}</span>
                        <Image
                          src={iconMinus}
                          roundedCircle
                          onClick={(e) =>
                            handleCommentScore(
                              "decrement",
                              comment._id,
                              comment.score
                            )
                          }
                        />
                      </Row>
                    </Col>
                    <Col
                      lg={{ order: "last", span: 11 }}
                      xs={{ order: "first", span: 12 }}
                    >
                      <Row>
                        <Col lg={9} sm={8} className="user">
                          <Image
                            src={`${imagePath}/${comment.user.image}`}
                            roundedCircle
                          />
                          <span className="username">
                            {comment.user.username}
                          </span>
                          {currentUser.username === comment.user.username && (
                            <Badge
                              bg="primary"
                              style={{ backgroundColor: "#5457b6" }}
                            >
                              You
                            </Badge>
                          )}
                          <span className="time_created">
                            {moment(comment.createdAt)
                              .startOf("second")
                              .fromNow()}
                          </span>
                        </Col>
                        <Col lg={3} sm={4} className="reply">
                          {currentUser.username === comment.user.username ? (
                            <p>
                              <span
                                onClick={(e) =>
                                  props.deleteComment({
                                    id: comment._id,
                                  })
                                }
                              >
                                <Image src={iconDelete} roundedCircle />
                                <span>
                                  <span className="delBtn"> Delete</span>
                                </span>
                              </span>
                              <span
                                onClick={(e) =>
                                  displayEditBox(comment._id, comment.content)
                                }
                              >
                                <Image src={iconEdit} roundedCircle />
                                <span className="editBtn"> Edit</span>
                              </span>
                            </p>
                          ) : (
                            <p
                              onClick={() =>
                                displayReplyBox(
                                  comment._id,
                                  comment.user.username
                                )
                              }
                            >
                              <span>
                                <Image src={iconReply} roundedCircle />
                                <span> Reply</span>
                              </span>
                            </p>
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <p>{comment.content}</p>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Suspense>
                {comment.replies.map((reply) => (
                  <div
                    className="commentReply"
                    key={reply._id}
                    id={reply._id}
                    ref={props.replyRef}
                  >
                    <div className="replyCard">
                      <Card>
                        <Card.Body>
                          <Row>
                            <Col
                              lg={{ order: "first", span: 1 }}
                              xs={{ order: "last", span: 6 }}
                              className="likeBtn"
                            >
                              <Row>
                                <Image
                                  src={iconPlus}
                                  roundedCircle
                                  onClick={(e) =>
                                    handleCommentScore(
                                      "increment",
                                      comment._id,
                                      reply.score,
                                      reply._id
                                    )
                                  }
                                />
                                <span>{reply.score}</span>
                                <Image
                                  src={iconMinus}
                                  roundedCircle
                                  onClick={(e) =>
                                    handleCommentScore(
                                      "decrement",
                                      comment._id,
                                      reply.score,
                                      reply._id
                                    )
                                  }
                                />
                              </Row>
                            </Col>
                            <Col
                              lg={{ order: "last", span: 11 }}
                              xs={{ order: "first", span: 12 }}
                            >
                              <Row>
                                <Col lg={9} sm={8} className="user">
                                  <Image
                                    src={`${imagePath}/${reply.user.image}`}
                                    roundedCircle
                                  />
                                  <span className="username">
                                    {reply.user.username}
                                  </span>
                                  {currentUser.username ===
                                    reply.user.username && (
                                    <Badge bg="primary">You</Badge>
                                  )}
                                  <span className="time_created">
                                    {moment(reply.createdAt)
                                      .startOf("second")
                                      .fromNow()}
                                  </span>
                                </Col>
                                <Col lg={3} sm={4} className="reply">
                                  {currentUser.username ===
                                  reply.user.username ? (
                                    <p>
                                      <span
                                        // id={reply._id}
                                        onClick={(e) =>
                                          props.deleteComment({
                                            id: comment._id,
                                            replyId: reply._id || "",
                                          })
                                        }
                                      >
                                        <Image src={iconDelete} roundedCircle />
                                        <span>
                                          <span className="delBtn">
                                            {" "}
                                            Delete
                                          </span>
                                        </span>
                                      </span>
                                      <span
                                        id={reply._id}
                                        onClick={(e) =>
                                          displayEditBox(
                                            comment._id,
                                            reply.content,
                                            reply._id
                                          )
                                        }
                                      >
                                        <Image src={iconEdit} roundedCircle />
                                        <span className="editBtn"> Edit</span>
                                      </span>
                                    </p>
                                  ) : (
                                    <p
                                      onClick={() =>
                                        displayReplyBox(
                                          comment._id,
                                          reply.user.username
                                        )
                                      }
                                    >
                                      <span>
                                        <Image src={iconReply} roundedCircle />
                                        <span> Reply</span>
                                      </span>
                                    </p>
                                  )}
                                </Col>
                              </Row>
                              <Row>
                                <p>
                                  <span className="userReply">
                                    @{reply.replyingTo}
                                  </span>{" "}
                                  {reply.content}
                                </p>
                              </Row>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                ))}
              </Suspense>
            </Row>
          </div>
        ))}
        <Row ref={replyBox}>
          <CommentForm
            currentUser={currentUser}
            imagePath={imagePath}
            saveComment={props.saveComment}
            displayReplyBox={displayReplyBox}
            displayEditBox={displayEditBox}
            action={action}
            setAction={setAction}
            saveReply={props.saveReply}
            updateComment={props.updateComment}
            editClicked={editClicked}
            replyClicked={replyClicked}
            setReplyClicked={setReplyClicked}
            setEditClicked={setEditClicked}
          />
        </Row>{" "}
      </Suspense>
      <Popup
        show={props.modalShow}
        onHide={() => props.setModalShow(false)}
        // setDeleteItem={props.setDeleteItem}
        handleDelete={props.handleDelete}
      />
    </div>
  );
};

export default Comment;

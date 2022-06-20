import { Container } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Login";
import { RequireAuth } from "./middleware/RequireAuth";
import { AuthProvider } from "./context/useAuth";
import Comment from "./components/Comment";

function App() {
  const [comments, setComments] = useState(null);
  const [user, setUser] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/comment");
        setComments(response.data);
        setUser(localStorage.getItem("user"));
      } catch (error) {
        console.log(error);
      }
    })();
  });

  const saveComment = async (message) => {
    try {
      const response = await axios.post("/api/comment", message);
      if (response.data) console.log(response.data.success);
    } catch (err) {
      console.log(err);
    }
  };

  const updateComment = async (comment) => {
    try {
      const response = await axios.put(`/api/comment/${comment.id}`, {
        comment,
      });
      if (response.data) {
        console.log(response.data.success);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = (comment) => {
    setModalShow(true);
    setDeleteItem(comment);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`api/comment/${deleteItem.id}`, {
        data: deleteItem,
      });
      setModalShow(false);
      if (response.data) {
        setDeleteItem({});
        console.log(response.data.success);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const saveReply = async (reply) => {
    try {
      const response = await axios.post("/api/comment/reply", reply);
      if (response.data) {
        console.log(response.data.success);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleScore = async (comment) => {
    try {
      const response = await axios.put(`api/comment/likes/${comment.id}`, {
        comment,
      });
      if (response.data.success) {
        console.log("success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container fluid className="app">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/comment"
              element={
                <RequireAuth>
                  <Comment
                    comments={comments}
                    user={user}
                    saveComment={saveComment}
                    saveReply={saveReply}
                    deleteComment={deleteComment}
                    handleScore={handleScore}
                    updateComment={updateComment}
                    modalShow={modalShow}
                    setModalShow={setModalShow}
                    handleDelete={handleDelete}
                  />
                </RequireAuth>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </Container>
  );
}

export default App;

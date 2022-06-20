import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { useRef, useState } from "react";
import { useAuth } from "../context/useAuth";
import axios from "axios";

const Home = () => {
  const auth = useAuth();
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const imgPreview = useRef(null);
  const avatar = useRef(null);
  const usernameField = useRef(null);

  // preview uploaded image
  const previewImage = (e) => {
    e.target.addEventListener("change", (e) => {
      const files = e.target.files[0];
      if (files) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener("load", function () {
          imgPreview.current.src = this.result;
        });
      }
    });
  };
  localStorage.setItem("user", username);

  const handleLogin = (e) => {
    e.preventDefault();
    e.target.disabled = true;

    loginUser(e);
  };

  const loginUser = async (e) => {
    let newAvatar = avatar.current.files[0];
    let data = new FormData();
    data.append("avatar", avatar.current.files[0]);

    try {
      // console.log(formData.get("avatar"));
      const response = await axios.post("/api/user", { username });
      const id = response.data.user._id;
      const uid = response.data.user.username;
      if (newAvatar) {
        const saveImage = await axios.put(`/api/user/image/upload/${id}`, data);
      }
      e.target.disabled = false;

      auth.login({ username: uid });
    } catch (err) {
      let error = err.response.data.error;
      if (error.name && error.name === "MulterError") {
        alert("image must be below 500kb");
        e.target.disabled = false;
        return;
      }
      if (error.storageErrors) {
        alert("Please select a valid image type");
        e.target.disabled = false;
        return;
      }
      e.target.disabled = false;
      err.response ? setError(true) : setError(false);
      setErrorMsg(err.response.data.error);
    }
  };

  const clearError = () => setError(false);

  return (
    <Row className="d-md-flex justify-content-around">
      <Col md={6}>
        <Card className="mx-md-auto p-4 rounded-3">
          <Form className="text-center">
            <Image
              src="img/avatars/placeholder.png"
              roundedCircle
              fluid
              width="45%"
              ref={imgPreview}
            />
            <div className="d-grid gap-2 my-3 mx-auto" style={{ width: "60%" }}>
              <Form.Group controlId="avatar">
                <Form.Label
                  className="btn btn-outline-primary btn-sm rounded-pill round-button fst-italic py-2 px-4"
                  style={{
                    color: "hsl(238, 40%, 52%)",
                    borderColor: "hsl(238, 40%, 52%)",
                  }}
                >
                  CHOOSE IMAGE
                </Form.Label>
                <Form.Control
                  type="file"
                  className="d-none"
                  name="avatar"
                  accept="image/jpeg, image/png, image/jpg"
                  onClick={(e) => previewImage(e)}
                  ref={avatar}
                />
              </Form.Group>
            </div>
            {error && (
              <div className="text-danger text-start pb-2 fst-italic">
                {errorMsg}
              </div>
            )}
            <Form.Group className="mb-4 m-auto">
              {/* <Form.Label>Enter a username</Form.Label> */}
              <Form.Control
                type="text"
                name="username"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onInput={clearError}
                ref={usernameField}
                style={{ borderColor: error ? "#c00" : "" }}
              />
            </Form.Group>
            <div className="d-grid gap-2 pb-2">
              <Button
                variant="primary"
                size="md"
                type="submit"
                onClick={(e) => handleLogin(e)}
              >
                Join Chat
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Home;

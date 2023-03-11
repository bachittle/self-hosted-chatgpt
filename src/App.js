import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';


function App() {
  let [msgs, setMsgs] = useState([]);

  const handleChat = (event) => {
    event.preventDefault();

    if (event.target.elements[0].value === "") {
      return;
    }
    const message = event.target.elements[0].value;
    event.target.elements[0].value = "";
    setMsgs([...msgs, {role: "user", msg: message}])

    axios.post('http://localhost:8080/api/chat', {
      message: message
    })
    .then((response) => {
      console.log(response.data);
      setMsgs([...msgs, {role: "user", msg: message}, {role: "assistant", msg: response.data}])
    })
    .catch((error) => {
      console.log(error);
    });
  }
  return (
    <div className="App">
      <h1>Self-hosted Chat GPT</h1>
      <div>
        {msgs.map((msg, index) => {
          if (msg.role === "user") {
            return (
              <div key={index} style={{backgroundColor: "#FEE"}}>{msg.msg}</div>
            )
          } else {
            return (
              <div key={index} style={{backgroundColor: "#EEF"}}>
                <ReactMarkdown>{msg.msg}</ReactMarkdown>
              </div>
            )
          }
        })}
      </div>
      <Form onSubmit={handleChat}>
        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={3} />
          <Button variant="primary" type="submit">submit</Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default App;

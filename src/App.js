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
    const role = event.target.elements[0].value;
    const message = event.target.elements[1].value;
    event.target.elements[1].value = "";
    const newMsgs = [...msgs, {role: role, content: message}]; 
    setMsgs(newMsgs)

    console.log(newMsgs)

    axios.post('http://localhost:8080/api/chat', JSON.stringify(newMsgs))
    .then((response) => {
      console.log(response.data);
      setMsgs([...msgs, {role: role, content: message}, {role: "assistant", content: response.data}])
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
              <div key={index} style={{backgroundColor: "#FEE"}}>{msg.content}</div>
            )
          } else {
            return (
              <div key={index} style={{backgroundColor: "#EEF"}}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            )
          }
        })}
      </div>
      <Form onSubmit={handleChat}>
        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Select>
            <option>user</option>
            <option>system</option>
          </Form.Select>
          <Form.Control placeholder='content'/>
          <Button variant="primary" type="submit">submit</Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default App;

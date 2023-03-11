import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

function handleChat(event) {
  event.preventDefault();
  const message = event.target.elements[0].value;

  axios.post('http://localhost:8080/api/chat', {
    message: message
  })
  .then((response) => {
    console.log(response.data.message);
  })
  .catch((error) => {
    console.log(error);
  });
}

function App() {
  return (
    <div className="App">
      <h1>Self-hosted Chat GPT</h1>
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

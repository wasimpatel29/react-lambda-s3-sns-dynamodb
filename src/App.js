import React, { Component } from 'react';
import './App.css';
import conifg from './conifg-dev';
function App() {
  return (
    <div className="App">
    <ContactForm />
    </div>
  );
}

class ContactForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ""    
    };
  }
  sendContactForm = (evt) => { 
    evt.preventDefault();
    console.log('clicked in the form');
    const messageData = {
      name: this.refs.name.value,
      email: this.refs.email.value,
      message: this.refs.message.value
    };
    console.log("DATA => " + messageData);

  fetch(conifg.submitContactFormURL, {
    method: "POST",
    mode: "cors",
    headers: {"Content-Type": "application/json"},  
    body: JSON.stringify(messageData)
  })
  .then(response => response.json())
  .then(response => {
    console.log("Success: " + response);
    this.setState({message: response.message})
  })
  .catch(error => console.log("Error:" + error))

    this.refs.contactForm.reset();
  }
  render() {
    return (
      <form ref="contactForm">
        <h1>Contact Us</h1>
        <label htmlFor="name">Enter your name:</label>
        <input ref="name" type="text" required/>
        <br/>
        <label htmlFor="email">Enter your email address:</label>
        <input ref="email" type="email" required/>
        <br/>
        <label htmlFor="message">Enter your message:</label>
        <textarea ref="message" rows="6" cols="40"> 
        </textarea>
        <br/>
        <hr/>
        <button onClick={this.sendContactForm}>Send Message</button>
        <div>{this.state.message}</div>
      </form>
    )
  }
}
export default App;

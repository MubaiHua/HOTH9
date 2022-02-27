import axios from "axios";
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css"

import Notification from "../components/Notification";
import NavigationBar from "../components/NavigationBar";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

class Selling_form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seller: sessionStorage.getItem("username"),
      summary: null, 
      description: null, 
      price: null,
      alert : false,
      alertMessage : null,
      alertType : null,
    };
    this.handleSummaryChange = this.handleSummaryChange.bind(this); 
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this); 
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }

  redirect() {
    if (sessionStorage.getItem("username") === null) {
      window.location.href = "/";
    }
  }

  onClick() {
    window.location.href = "home"
  }

  handleSummaryChange(event) {
    this.setState({ summary: event.target.value })
  }

  handleDescriptionChange(event) {
    this.setState({ description: event.target.value });
  }

  handlePriceChange(event) {
    this.setState({ price: event.target.value });
  }

  handleSubmit(event) {
    if (this.state.summary === null) {
      this.setState({ alert : true });
      this.setState({ alertMessage : "Please enter a summary." });
      this.setState({ alertType : "error" });
      event.preventDefault();
    } else if (this.state.description === null) {
      this.setState({ alert : true });
      this.setState({ alertMessage : "Please enter a description." });
      this.setState({ alertType : "error" });
      event.preventDefault();
    } else if (this.state.price === null || isNaN(this.state.price)) {
      this.setState({ alert : true });
      this.setState({ alertMessage : "Please enter a valid price." });
      this.setState({ alertType : "error" });
      event.preventDefault();
    } else {
      this.setState({ alert : true });
      this.setState({ alertMessage : "You have successfully posted a request to sell your" + this.state.summary + " for " + this.state.price + " dollars."});
      this.setState({ alertType : "success" });
      const orderInfo = {
        seller: this.state.seller,
        summary: this.state.summary,
        description: this.state.description, 
        price: this.state.price,
      }
      axios.post("http://localhost:4000/app/order", orderInfo)
        .then(response => {
          console.log(response.data)
          window.location.href = "home"
        })
    }
  }

  closeAlert() {
    this.setState({ alert : false });
  }

  render() {
    this.redirect();
    return (
      <>
        <Notification alert={this.state.alert} 
          alertMessage={this.state.alertMessage} 
          alertType={this.state.alertType} 
          closeAlert={this.closeAlert} />
        <NavigationBar />
        <div className="container">
          <form>
          <p />
            <p />
            <label> Please provide a brief summary of the item: </label>
            <p />
            <TextField label="Enter a summary" variant="outlined" value={this.state.summary} onChange={this.handleSummaryChange} />

            <p />
            <label> Please describe the item：</label>
            <p />
            <TextField label="Enter a description" multiline rows={4} value={this.state.description} onChange={this.handleDescriptionChange} />

            <p />
            <label> Please enter a price：</label>
            <p />
            <TextField label="Enter a price" variant="outlined" value={this.state.price} onChange={this.handlePriceChange} />

            <p />
            
          </form>
          <Button type="submit" onClick={this.handleSubmit} sx={{ marginTop: 1, height: 40 }} variant="contained">Submit</Button>
        </div>
      </>
    );
  }
}

export default Selling_form;
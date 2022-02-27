import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"
import Rating from "@mui/material/Rating";
import { DataGrid } from '@mui/x-data-grid';
import NavigationBar from "../components/NavigationBar"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Notification from "../components/Notification";

const columns = [
  { field: 'id', headerName: "No.", width: 60, hide: true, disableColumnMenu: true },
  {
    field: 'seller',
    headerName: 'Seller',
    width: 120,
    disableColumnMenu: true,
    renderCell(params) {
      const findSeller = () => {
        sessionStorage.setItem("userDisplayed", params.getValue(params.id, "seller"));
      }
      return (
        <Link to="/user_info" onClick={findSeller} style={{ textDecoration: 'none' }}>
          {params.getValue(params.id, "seller")}
        </Link>
      )
    }
  },
  {
     field: 'rating', headerName: 'Rating', width: 100, disableColumnMenu: true, 
      renderCell(params){
        const rating = params.getValue(params.id, "rating");
        return (
          <Rating
          sx={{ marginTop: 0, marginLeft: -0.3 }}
          size="small"
          value={rating}
          precision = {0.5}
          readOnly
        />
        )
      }
  },
  { field: 'summary', headerName: 'Item Summary', width: 190, disableColumnMenu: true },
  { field: 'price', headerName: 'Price', width: 80, disableColumnMenu: true },
  { field: 'details', 
    headerName: 'Details', 
    width: 80, 
    disableColumnMenu: true,
    renderCell(params) {
      const handleDetails = () => {
        alert(params.getValue(params.id, "description"));
      }

      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginRight: 32, width: 100, height: 40, borderRadius: 5 }}
          onClick={handleDetails}
        >
          Details
        </Button>
      );
    },
  },
  {
    field: 'buy',
    headerName: 'Buy it!',
    sortable: false,
    disableColumnMenu: true,
    width: 120,
    renderCell(params) {
      const handleBuy = () => {
        const obj_id = params.getValue(params.id, "obj_id");

        const updateInfo = {
          _id: obj_id,
          inProgress: true,
          code: Math.floor(100000 + Math.random() * 900000),
          buyer: sessionStorage.getItem("username"),
        };
        axios.post("http://localhost:4000/app/update", updateInfo)
          .then(response => console.log(response.data))
        window.location.href = "home"
      }

      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginRight: 32, width: 100, height: 40, borderRadius: 5 }}
          onClick={handleBuy}
        >
          Buy
        </Button>
      );
    },
  },
  { field: 'obj_id', hide: true }
]

class BuyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buyer: sessionStorage.getItem("username"),
      keywords: null, 
      start_price: null,
      end_price: null,
      rows: [],
      alert: false,
      alertMessage: null,
      alertType: null,
    };
    this.handleKeywordsChange = this.handleKeywordsChange.bind(this); 
    this.handleStartPriceChange = this.handleStartPriceChange.bind(this);
    this.handleEndPriceChange = this.handleEndPriceChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }

  generateRows = function (data) {
    var temp = this.state.rows;
    temp = Object.assign([], temp);
    temp = [];
    if (data.length === 0) {
      temp = [];
      this.setState({ rows: temp });
      this.setState({ 
        alert : true,
        alertMessage : "No match found.",
        alertType : "warning"
      });

    } else {
      for (let i = 0; i < data.length; i++) {
        const getRating = { userName: data[i].seller };
        axios
          .post("http://localhost:4000/app/getRating", getRating)
          // eslint-disable-next-line
          .then((response) => {
            let rating = response.data.rating;
            temp = Object.assign([], temp);

            temp.push({
              id: i + 1,
              seller: data[i].seller,
              rating: rating.toFixed(1),
              price: data[i].price,
              summary: data[i].summary,
              description: data[i].description,
              obj_id: data[i]._id,
            });
            this.setState({ rows: temp });
          });
      }
    }
  };

  redirect() {
    if (sessionStorage.getItem("username") === null) {
      window.location.href = "/";
    }
  }

  handleKeywordsChange(event) {
    this.setState({ keywords: event.target.value });
  }

  handleStartPriceChange(event) {
    this.setState({ start_price: event.target.value });
  }

  handleEndPriceChange(event) {
    this.setState({ end_price: event.target.value });
  }

  handleSearch(event) {
    var search_start_price;
    var search_end_price;
    if (this.state.start_price === null || this.state.start_price ===''){
      search_start_price = -Number.MAX_VALUE
    }
    else 
    {
      if (isNaN(this.state.start_price)) {
        this.setState({ alert: true });
        this.setState({ alertMessage: "Please enter a valid start price." });
        this.setState({ alertType: "error" });
        event.preventDefault();
        return;
      } 
      search_start_price = Number(this.state.start_price)
    }
    if (this.state.end_price === null || this.state.end_price === ''){
      search_end_price = Number.MAX_VALUE
    }
    else {
      if (isNaN(this.state.end_price)) {
        this.setState({ alert: true });
        this.setState({ alertMessage: "Please enter a valid end price." });
        this.setState({ alertType: "error" });
        event.preventDefault();
        return;
      }
      search_end_price = Number(this.state.end_price)

    }
  
    if (search_start_price > search_end_price) {
      this.setState({ alert: true });
      this.setState({ alertMessage: "Please enter a valid price interval." });
      this.setState({ alertType: "error" });
      event.preventDefault();
    } else {
      event.preventDefault();
      const interval = {
        seller: this.state.buyer,
        startPrice: search_start_price,
        endPrice: search_end_price,
        keywords: this.state.keywords
      };
      axios
        .post("http://localhost:4000/app/searchOrder", interval)
        .then((response) => this.generateRows(response.data));
    }
  }

  closeAlert() {
    this.setState({ alert: false });
  }

  render() {
    this.redirect();

    return (
      <div>
        <Notification alert={this.state.alert}
          alertMessage={this.state.alertMessage}
          alertType={this.state.alertType}
          closeAlert={this.closeAlert} />
        <NavigationBar />

        <div className="buyPageSearchContainer">
          <form className="marginForm" onSubmit={this.handleSearch}>
            <p />
            <label> Please enter some keywords for the item you're looking for: </label>
            <p />
            <TextField label="Enter keywords" fullWidth variant="outlined" value={this.state.keywords} onChange={this.handleKeywordsChange} />
            
            <p />
            <label> Please enter a price range：</label>
            <p />
            <TextField label="Enter a start price" variant="outlined" value={this.state.start_price} onChange={this.handleStartPriceChange} />
            <label class="buyTimeRangeLabel">&nbsp;&nbsp;to&nbsp;&nbsp;</label>
            <TextField label="Enter a end price" variant="outlined" value={this.state.end_price} onChange={this.handleEndPriceChange} />

            <p />
            <Button type="submit" sx={{ marginTop: 1, height: 40 }} variant="contained">Search</Button>
          </form>
        </div>

        <div className="buyPageOrdersContainer">
          <div style={{ height: 425 }}>
            <DataGrid
              rows={this.state.rows}
              columns={columns}
              pageSize={6}
              rowsPerPageOptions={[6]}
            />
          </div>
        </div>
      </div>

    );
  }
}

export default BuyPage;

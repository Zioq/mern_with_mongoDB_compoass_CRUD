import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default class ExerciseList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [],
      searchTerm: "",
      apidata: [],
      userInput: "",
      userNumber: "",
    };

    this.myChangeHandler = this.myChangeHandler.bind(this);
    this.myAPIHandler = this.myAPIHandler.bind(this);
    this.userInputHandler = this.userInputHandler.bind(this);
    this.userNumberHandler = this.userNumberHandler.bind(this);
  }
  componentDidMount() {
    axios
      .get("/api/exercises")
      .then((response) => {
        this.setState({
          exercises: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //DeleteHandler
  DeleteHandeler(id) {
    axios
      .delete("/api/exercise/delete/" + id)
      .then((res) => console.log(res.data));

    this.setState({
      exercises: this.state.exercises.filter((el) => el._id !== id),
    });
  }

  myChangeHandler = (e) => {
    this.setState({
      searchTerm: e.target.value,
    });
  };

  userInputHandler = (e) => {
    this.setState({
      userInput: e.target.value,
    });
  };
  userNumberHandler = (e) => {
    this.setState({
      userNumber: e.target.value,
    });
  };

  mySubmitHandler = (e) => {
    e.preventDefault();
    console.log("Search Term", this.state.searchTerm);

    let body = {
      searchTerm: this.state.searchTerm,
    };

    axios.post("/api/search", body).then((response) => {
      if (response.data) {
        console.log(response.data);
        this.setState({
          exercises: response.data,
        });
      } else {
        console.log("failed to get the data");
      }
    });
  };

  myAPIHandler = async (e) => {
    e.preventDefault();

    var userinput = this.state.userInput;
    var num = this.state.userNumber;

    console.log(userinput);
    console.log(num);
    var API_KEY = "19127780-f88c11b491a3957557c0be727";
    var URL = `https://pixabay.com/api/?key=${API_KEY}&q=${userinput}&image_type=photo&per_page=${num}`;

    fetch(URL)
      .then((response) => response.json())
      .then((imageData) => {
        //console.log(imageData);
        let imgData = imageData.hits;
        console.log(imgData);
        axios.post("/api/imgdata", imgData).then((response) => {
          if (response.data) {
            console.log(response.data);
            console.log("Success to save 3rd party data");
          } else {
            console.log("failed to savethe data");
          }
        });
      });
  };

  //Edit Handeler

  render() {
    return (
      <React.Fragment>
        <div>
          <h3>Logged Exercises</h3>
          <br />
          <h3>Find what you want</h3>
          <form onSubmit={this.mySubmitHandler}>
            <input
              type="text"
              placeholder="Enter user's name"
              onChange={this.myChangeHandler}
            />
            <input type="submit" />
          </form>

          <br />
          <h3>Get the API data</h3>
          <form onSubmit={this.myAPIHandler}>
            <input
              type="text"
              placeholder="Enter Image"
              onChange={this.userInputHandler}
            />

            <input
              type="text"
              placeholder="Enter number"
              onChange={this.userNumberHandler}
            />

            <input type="submit" />
          </form>

          <br />

          <table className="table">
            <thead className="thead-light">
              <tr>
                <th>Username</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.exercises.map((exercise) => (
                <tr key={exercise._id}>
                  <td>{exercise.username}</td>
                  <td>{exercise.description}</td>
                  <td>{exercise.duration}</td>
                  <td>{exercise.date}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => this.DeleteHandeler(exercise._id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <Link to={"/edit/" + exercise._id}>
                      <button className="btn btn-info btn-sm">Edit</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

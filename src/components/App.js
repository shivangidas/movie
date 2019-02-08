import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "../styles/App.css";
import matchSorter from "match-sorter";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      list: [],
      lightTheme: true
    };
    this.handleThemeChange = this.handleThemeChange.bind(this);
  }

  componentDidMount() {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const url = "http://starlord.hackerearth.com/movies";
    let thisOne = this;
    fetch(proxyUrl + url)
      .then(function(response) {
        return response.json();
      })
      .then(function(listOfMovies) {
        //console.log(JSON.stringify(listOfMovies[0]));
        thisOne.setState({
          loading: false,
          list: listOfMovies
        });
      })
      .catch(error => {
        console.log(error);
        thisOne.setState({
          loading: false,
          list: []
        });
      });
  }
  handleThemeChange() {
    if (this.state.lightTheme) {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      this.setState({
        lightTheme: false
      });
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      this.setState({
        lightTheme: true
      });
    }
  }
  render() {
    const columns = [
      {
        Header: "Name",
        accessor: "movie_title"
      },
      {
        Header: "Director",
        accessor: "director_name"
      },
      {
        Header: "Actors",
        accessor: "actor_1_name",
        Cell: props => (
          <div>
            <span className="actor_1_name">{props.original.actor_1_name}</span>,
            &nbsp;
            <span className="actor_2_name">{props.original.actor_2_name}</span>
          </div>
        )
      },
      {
        Header: "Genres",
        id: "genres",
        accessor: d => d.genres,
        Cell: props => props.original.genres.split("|").join(" | "),
        filterable: true,
        sortable: true,
        filterAll: true
      },
      {
        Header: "Language",
        accessor: "language",
        filterable: true,
        sortable: true,
        filterAll: true
      },
      {
        Header: "Country",
        accessor: "country",
        filterable: true,
        sortable: true,
        filterAll: true
      },
      {
        Header: "Content Rating",
        accessor: "content_rating"
      },
      {
        Header: "Budget",
        accessor: "budget",
        filterable: true,
        sortable: true,
        filterMethod: (filter, row) => {
          return parseInt(row[filter.id]) >= parseInt(filter.value);
        }
      },
      {
        Header: "Title Year",
        accessor: "title_year",
        filterable: true,
        sortable: true,
        filterAll: true
      },
      {
        Header: "Plot Keywords",
        accessor: "plot_keywords",
        Cell: props => props.original.genres.split("|").join(" | ")
      },
      {
        Header: "IMBD link",
        accessor: "movie_imdb_link",
        Cell: props => (
          <a
            href={props.original.movie_imdb_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {props.original.movie_title}
          </a>
        )
      }
    ];
    const filterMethod = (filter, rows) =>
      matchSorter(rows, filter.value, { keys: [filter.id] });
    return (
      <div className="App">
        <header className="App-header">
          <h2>
            Movie Explorer{" "}
            <Toggle
              defaultChecked={this.state.lightTheme}
              icons={false}
              className="toggleButton"
              onChange={this.handleThemeChange}
            />
          </h2>
        </header>
        <section>
          {this.state.loading ? (
            <h2>Loading data...</h2>
          ) : (
            <ReactTable
              className="-striped -highlight"
              data={this.state.list}
              columns={columns}
              defaultPageSize={10}
              filterable={false}
              sortable={false}
              defaultFilterMethod={filterMethod}
            />
          )}
        </section>
      </div>
    );
  }
}

export default App;

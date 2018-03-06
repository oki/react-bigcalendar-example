import React from 'react'
import ReactDOM from 'react-dom'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import moment_timezone from 'moment-timezone';

import request from 'superagent'
import css from 'react-big-calendar/lib/css/react-big-calendar.css'

import AbsenceCalendar from './calendar/absence_calendar'

moment.tz.setDefault("Europe/Warsaw");
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

class Spinner extends React.Component {
  render() {
    return(
      this.props.loading ? <div style={{top: "-50%" }} align="center" className="cssload-fond">
        <div className="cssload-container-general">
          <div className="cssload-internal">
            <div className="cssload-ballcolor cssload-ball_1">
            </div>
          </div>
          <div className="cssload-internal">
            <div className="cssload-ballcolor cssload-ball_2"></div>
          </div>
          <div className="cssload-internal">
            <div className="cssload-ballcolor cssload-ball_3"></div>
          </div>
          <div className="cssload-internal">
            <div className="cssload-ballcolor cssload-ball_4"></div>
          </div>
        </div>
      </div>
    : null
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    let date = new Date();

    this.localStoragePrefix = "react_absences";

    this.state = {
      events: [],
      driver_ids: this.restoreField("driver_ids", ""),
      month: this.restoreField("month", () => moment(date).format("M")),
      year: this.restoreField("year", () => moment(date).format("YYYY")),
      loading: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.loadEvents = this.loadEvents.bind(this)
    this.reloadApp = this.reloadApp.bind(this)

    this.selectedDate = this.selectedDate.bind(this)
  }

  componentDidMount() {
    this.setState({loading: true }, () => {
      this.loadEvents(this.selectedDate().format("YYYY-MM-01"), this.state.driver_ids);
    });
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value, loading: true }, () => {
      this.reloadApp()
    });

    this.storeField(event.target.name, event.target.value);
  }

  reloadApp() {
    this.loadEvents(this.selectedDate().format("YYYY-MM-01"), this.state.driver_ids);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.loading || nextState.events != this.state.events;
  }

  loadEvents(date, driver_ids) {
    request
      .get('/user/web_api/absences.json')
      .query({ date: date })
      .query({ "driver_ids[]": driver_ids })
      .then(response => {
        let data = JSON.parse(response.text)

        this.setState({
          loading: false,
          events: data.absences.map( (event) => {
            event.start = moment(event.start).tz("Europe/Warsaw").format('YYYY-MM-DD')
            event.end = moment(event.end).tz("Europe/Warsaw").format('YYYY-MM-DD')
            return event;
          })
        });
    });
  }

  setEvents(events) {
    this.setState({ events })
  }

  selectedDate() {
    return moment(`${this.state.year}-${this.state.month}`);
  }

  storeField(name, value) {
    let prefixedName = [this.localStoragePrefix, name].join("_")
    localStorage.setItem(prefixedName, value);
  }

  restoreField(name, callback) {
    let prefixedName = [this.localStoragePrefix, name].join("_")

    let value = localStorage.getItem(prefixedName);

    if (value) {
      return value;
    } else if (_.isFunction(callback)) {
      return callback.call();
    } else {
      return callback;
    }
  }

  render() {
    return ([
      <AbsenceCalendar
        events={this.state.events}

        handleChange={this.handleChange}
        handleUpdate={this.reloadApp}

        drivers={JSON.parse(this.props.drivers)}
        months={JSON.parse(this.props.months)}
        years={JSON.parse(this.props.years)}

        selected_driver_ids={this.state.driver_ids}
        selected_month={this.state.month}
        selected_year={this.state.year}

        selected_date={this.selectedDate().toDate()}
      />,
      <Spinner loading={this.state.loading} />
    ])
  }
}


let rootElement = document.getElementById('root')

ReactDOM.render(
  <App drivers={rootElement.getAttribute('data-drivers')} months={rootElement.getAttribute('data-months')} years={rootElement.getAttribute('data-years')}/>,
    rootElement
);

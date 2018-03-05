import React from 'react'
import Modal from 'react-responsive-modal';
import request from 'superagent'

import SelectFilter from './select_filter'

class CustomModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      onClose: this.props.onClose,
      errors: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.handleError = this.handleError.bind(this);

    this.cleanAndClose = this.cleanAndClose.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { driver_id, start, end, type, absence_id } = this.state;

    const authenticity_token = $('meta[name="csrf-token"]').attr('content');

    if (this.state.absence_id) {
      request
        .put(`/user/web_api/absences/${this.state.absence_id}`)
        .query({ authenticity_token, absence: { driver_id, start, end, type } })
        .on('error', (error) => {
          error.response.body.errors.map( (error) => {
            this.handleError(error);
          })
        })
        .then(response => {
          let data = JSON.parse(response.text)
          console.log("After post");
          console.log(data);
          this.cleanAndClose();
      });
    } else {
      request
        .post('/user/web_api/absences.json')
        .query({ authenticity_token, absence: { driver_id, start, end, type } })
        .on('error', (error) => {
          error.response.body.errors.map( (error) => {
            this.handleError(error);
          })
        })
        .then(response => {
          let data = JSON.parse(response.text)
          console.log("After post");
          console.log(data);
          this.cleanAndClose();
      });
    }
  }

  handleDelete(event) {
    event.preventDefault();
    const authenticity_token = $('meta[name="csrf-token"]').attr('content');

    request
      .delete(`/user/web_api/absences/${this.state.absence_id}`)
      .query({ authenticity_token })
      .then(response => {
        let data = JSON.parse(response.text)
        console.log("After post");
        console.log(data);
        this.cleanAndClose();
    });

    this.cleanAndClose();
  }

  handleError(error) {
    console.log(error);

    this.setState({
      errors: {
        [error.field]: error.code
      }
    });

  }

  cleanAndClose() {

    this.setState({
      errors: []
    });

    this.state.onClose();
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps");
    console.log(nextProps);

    this.setState({
      start: moment(nextProps.modal.start).format("YYYY-MM-DD"),
      end: moment(nextProps.modal.end).format("YYYY-MM-DD"),
      driver_id: nextProps.modal && nextProps.modal.driver_id,
      type: nextProps.modal && nextProps.modal.type,
      absence_id: nextProps.modal && nextProps.modal.absence_id,
    });
  }

  componentWillUnmount() {
    console.log("Component will unmount!")
  }

  render() {
    console.log("Rendering CustomModal...")
    const { modal, onClose, drivers } = this.props;

    console.log(this.state);

    return([
      <Modal open={modal.open} onClose={this.cleanAndClose} little>
        <div className="modalWrapper">
        <br />
        <h2>{modal.absence_id ? "Edycja absencji" : "Nowa absencja"}</h2>

        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <SelectFilter
              label="Kierowca"
              name="driver_id"
              selected={this.state.driver_id}
              onChange={this.handleChange}
              collecion={drivers}
              includeBlank={false}
            />



            <span style={{"paddingLeft": "10px"}}>
              <SelectFilter
                label="Typ"
                name="type"
                selected={this.state.type}
                onChange={this.handleChange}
                collecion={[{id: "holiday", name: "Urlop"}, { id: "l4", name: "L4"}]}
                includeBlank={false}
              />
            </span>

          </div>

          <div className="form-group">
            <label>Od
              <br />
              <input name="start" type="text" value={this.state.start} onChange={this.handleChange} autoComplete="off" />
            </label>

            {this.state.errors.start && <small className="text-danger">
              <br />
              {this.state.errors.start}
              </small>
            }
          </div>

          <div className="form-group">
            <label>Do
              <br />
              <input name="end" type="text" value={this.state.end} onChange={this.handleChange} autoComplete="off" />
            </label>
          </div>

          <div className="form-group">
            <div style={{float: "right"}}>
              <input type="submit" value="Zapisz" className="btn btn-primary"/>
            </div>

            {modal.absence_id &&
              <div style={{float: "left"}}>
                <a href="#" onClick={this.handleDelete}>
                  <i className="fa fa-trash" aria-hidden="true"></i>&nbsp; Usuń
                </a>
              </div>
            }
          </div>
        </form>
        </div>
      </Modal>
    ])
  }
}
export default CustomModal;

import React from 'react'
import ReactDOM from 'react-dom'
import AlertContainer from 'react-alert'
import Backend from '../../adapter/Backend.js'

export default class extends React.Component{

  constructor(props) {
      super(props);
      this.state = {
        projectName: '',
        projectDescription: '',
        style: 'CRUD',
        errorMessages: {},
        formStarted: false
      };

      // Keep the labels out of the state parameter becuase they aren't changed after being rendered.
      this.labels = {
        name: 'User ID',
        description: 'Password',
      }

      this.alertOptions = {
        offset: 14,
        position: 'top right',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.projectNameInput.focus();
  }

  /* Method to show alert message */
  showAlert(message){
    this.props.alertMsg.error(message, {
      time: 5000,
      type: 'error',
      icon: <span className=""></span>
    });
  }

  /* Method to handle input change */
  handleChange(e) {
    this.setState({formStarted: 'true'});

    this.setState({
      [e.target.name]: e.target.value
    });

    this.showInputError(e.target);
  }

  /* Method to handle form submission */
  handleSubmit(e) {
    e.preventDefault();
    Backend.createProject(this.props.userObject.token,
    {
      name: this.state.projectName,
      description: this.state.projectDescription,
      style: this.state.style
    }).then( (result) => {
      this.props.projectCreated(result.id)
    })
  }

  showInputError(input) {
  }

  /* Render Method */
  render() {

    return(
      <div>
        <form id="project-form" className="project-form" noValidate onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="InputProjectName" id="projectNameLabel">Project Name:</label>
            <input
              type="text"
              value={this.state.projectName}
              onChange={this.handleChange}
              className="form-control"
              id="InputProjectName"
              name="projectName"
              ref={(input)=>{ this.projectNameInput = input}}
              placeholder="Project Name"
              required />
            <div className="error" id="nameError">{this.state.errorMessages.name}</div>
          </div>

          <div className="form-group">
            <label htmlFor="InputProjectDescription" id="projectDescriptionLabel">Project Description:</label>
            <textarea
              className="form-control"
              id="InputProjectDescription"
              name="projectDescription"
              placeholder="An Optional Project Description"
              value={this.state.projectDescription}
              onChange={this.handleChange}
              rows="3"></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="InputProjectStyle">Project Style:</label>
            <select className="form-control" name="style" readOnly>
              <option>CRUD</option>
            </select>
          </div>

          <div className="form-group">
              <button type="submit" id="create-project-button" className="btn btn-default pull-left">Create</button>
          </div>
        </form>
      </div>
    )
  }
}

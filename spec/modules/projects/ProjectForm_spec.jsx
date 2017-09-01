import React from 'react';
import ProjectForm from '../../../src/js/modules/projects/ProjectForm.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';
import Backend from '../../../src/js/adapter/Backend.js';
var Promise = require("bluebird");
import TypeAheadTextInput from '../../../src/js/modules/form/TypeAheadTextInput.jsx';

function createSimulatedElement(name, value, validState) {

  return {
    target: {
      name: name,
      value: value,
      classList: { add: function(className) {} },
      validity: validState
    },
    setCustomValidity: function(customState) { this.target.validity.customError = true; }
  };

}

describe('ProjectForm Component', function() {

  // A mock alert box
  const reactAlertMsg = {
    error: function(message, callback) {}
  }

  beforeEach(function() {
  });

  it('should render a project form', function() {
    const wrapper = shallow(<ProjectForm/>);
    expect(wrapper.find('form #project-form').length).toBe(1);
  })

  it('should render a typeahead project name field in the form', function() {
    const wrapper = shallow(<ProjectForm/>);
    expect(wrapper.find('input[name="projectName"]').length).toBe(1)
  })

  it('should render a description textarea in the form', function() {
    const wrapper = shallow(<ProjectForm/>);
    expect(wrapper.find('textarea[name="projectDescription"]').length).toBe(1);
  })

  // Removed the select box
  // it( 'should render a select box for the style', function() {
  //   const wrapper = shallow(<ProjectForm/>);
  //   expect(wrapper.find('select[name="style"]').length).toBe(1);
  // })

  it('should render a submit button', function() {
    const wrapper = mount(<ProjectForm/>);
    expect(wrapper.find('button #create-project-button').length).toBe(1);
  })

  it('should reject an attempt to create a project without a name', function() {

    //spyOn(ProjectForm.prototype, "showAlert").and.callThrough()
    let projectCreated = jasmine.createSpy('projectCreated');

    const wrapper = mount(<ProjectForm alertMsg={reactAlertMsg} projectCreated={projectCreated}/>);

    // Try resetting the state of LoginForm
    wrapper.setState({formStarted: true});

    const projectNameField = wrapper.find('input[name="projectName"]');
    let simulatedProjectNameElement = createSimulatedElement('projectName', '', { valueMissing: true});
    projectNameField.simulate('change',  simulatedProjectNameElement);

    //wrapper.find('button#create-project-button').get(0).click();

    expect(wrapper.find('div#projectNameError').text()).toBe('Project Name is a required field')
    expect(projectCreated).not.toHaveBeenCalled();
  })

  //TODO: For some reason enabling this test case causes subsequent ones to fail.
  // Need to look into this when I have time.
  xit('should call the alert function when attempting to submit an invalid project', function(done) {
    //spyOn(ProjectForm.prototype, "showAlert").and.callThrough()
    let errorMessageHandler = {
      error: function(message, time, type, icon) {
        console.log('error: ', message);
        done();
      }
    }
    let projectCreated = jasmine.createSpy('projectCreated');

    const wrapper = mount(<ProjectForm alertMsg={errorMessageHandler} projectCreated={projectCreated}/>);

    // Try resetting the state of LoginForm
    //wrapper.setState({formStarted: true});

    const projectNameField = wrapper.find('input[name="projectName"]');
    let simulatedProjectNameElement = createSimulatedElement('projectName', '', { valueMissing: true});
    projectNameField.simulate('change',  simulatedProjectNameElement);
    expect(wrapper.find('div#projectNameError').text()).toBe('Project Name is a required field')

    //wrapper.find('button#create-project-button').get(0).click();
    wrapper.find('button #create-project-button').simulate('submit');

    expect(projectCreated).not.toHaveBeenCalled();
  })

  it('should reject an attempt to submit a pristine form', function() {
    let projectCreated = jasmine.createSpy('projectCreated');

    const wrapper = mount(<ProjectForm alertMsg={reactAlertMsg} projectCreated={projectCreated}/>);
    wrapper.setState({formStarted: false});
    console.log('projectName: ' + wrapper.state('projectName'));
    console.log('errorMessages: ', wrapper.state('errorMessages'));

    //wrapper.find('button#create-project-button').get(0).click();
    wrapper.find('button #create-project-button').simulate('submit');
    console.log('errorMessages: ', wrapper.state('errorMessages'));

    expect(wrapper.find('div#projectNameError').text()).toBe('Please provide a name for the new project.');
    expect(projectCreated).not.toHaveBeenCalled();
  })

  it('should create a project on successful entry of the form', function(done) {

    const project = {
      name: 'project name',
      description: 'description'
    }

    const userObject = {
      token: 'blah'
    }

    let projectId = 141;
    let projectCreated = function(id) {
      expect(id).toBe(10);
      done();
    }

    spyOn(ProjectForm.prototype, "showAlert").and.callThrough();

    spyOn(Backend, 'createProject').and.callFake((token, project) => {
      expect(project.name).toBe('project name');
      expect(project.description).toBe('description');
      expect(token).toBe('blah');
      return new Promise( (resolve,reject) => {
        resolve({id: 10});
      })
    })

    const wrapper = mount(<ProjectForm userObject={userObject} projectCreated={projectCreated}/>);

    // Set the component state so that a form can be submitted
    const projectNameField = wrapper.find('input[name="projectName"]');
    let simulatedProjectNameElement = createSimulatedElement('projectName', project.name, {valid: true});
    projectNameField.simulate('change',  simulatedProjectNameElement);

    const projectDescriptionField = wrapper.find('input[name="projectName"]');
    let simulatedProjectDescriptionElement = createSimulatedElement('projectDescription', project.description, {valid: true});
    projectDescriptionField.simulate('change',  simulatedProjectDescriptionElement);

    // Click create
    wrapper.find('button #create-project-button').simulate('submit');

    expect(ProjectForm.prototype.showAlert).not.toHaveBeenCalled();

  })

  //TODO: update the project form to parse a Rapido error properly
  it('should alert the user if the API call fails', function(done) {

    const project = {
      name: 'project name',
      description: 'description'
    }

    const userObject = {
      token: 'blah'
    }

    spyOn(Backend, 'createProject').and.callFake((token, project) => {
      expect(project.name).toBe('project name');
      expect(project.description).toBe('description');
      expect(token).toBe('blah');
      return new Promise( (resolve,reject) => {
        reject({
          code: 'error'
        });
      })
    })

    spyOn(ProjectForm.prototype, 'showAlert').and.callFake(function (error) {
      //console.log(error);
      done();
    });

    const wrapper = mount(<ProjectForm userObject={userObject}/>);

    // Set the component state so that a form can be submitted
    wrapper.setState({projectName: project.name});
    wrapper.setState({projectDescription: project.description});
    wrapper.setState({formStarted: true});
    wrapper.setState({style: 'CRUD'});

    // Click submit
    //wrapper.find('button #create-project-button').get(0).click();
    wrapper.find('button #create-project-button').simulate('submit');


  });

});

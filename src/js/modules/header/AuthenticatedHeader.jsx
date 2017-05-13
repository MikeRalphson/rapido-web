import React from 'react'
import { Link } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

import '../../../css/header.scss'
import 'bootstrap/dist/js/bootstrap';

export default class extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    console.log('project:', this.props.project);

    let userName = this.props.userInfo.fullName;
    if( this.props.userInfo.nickName && this.props.userInfo.nickName.length > 0 ) {
      userName = this.props.userInfo.nickName;
    }

    return (
      <div className="navbar navbar-default navbar-static-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link className="navbar-left navbar-brand app-title" to="/home" id="logo" >Rápido</Link>
            <p className="navbar-text">{this.props.project.title}</p>
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
            <a id="userProfileMenu"
              className="navbar-link userProfile"
              data-target="#"
              data-toggle="dropdown"
              role="button" aria-haspopup="true" aria-expanded="false">{userName} <span className="caret"></span></a>
              <ul className="dropdown-menu" aria-labelledby="userProfileMenu">
                <li id="signout"><a href="#">Sign Out</a></li>
              </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

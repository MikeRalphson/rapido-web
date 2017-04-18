import React from 'react'
import { render } from 'react-dom'
import App from './js/modules/App'
import CRUDSketch from './js/CRUDSketch'
import Edit from './js/Edit'
import VocabEditor from './js/VocabEditor'
import Export from './js/Export'
import { Router, Route, browserHistory } from 'react-router'

import Login from './js/modules/login/LoginForm.jsx'

// Is this showing up in the container?
render(<Router history={browserHistory}>
	<Route path="/" component={App}>
		<Route path="/login" component={Login} />
	</Route>
</Router>, document.getElementById('App'))

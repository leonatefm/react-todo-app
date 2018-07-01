import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './redux_app/App';
import store from './redux_app/store';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();

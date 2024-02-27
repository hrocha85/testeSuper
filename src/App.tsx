import {
  setupIonicReact
} from '@ionic/react';
import ChatApp from './pages/chatApp.js'
import './theme/variables.css'
import { appI, db } from './services/FireBase.ts';


appI()
db()
setupIonicReact();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const App: React.FC = () => (
  <div>
    <ChatApp />
  </div>
);

export default App;

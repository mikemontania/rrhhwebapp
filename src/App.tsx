
import './App.css'
import { AuthProvider } from './Context/AuthContext';
import { AppRouter } from './MyRoutes/AppRoutes';

const App = () => {

  return (
    < AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App

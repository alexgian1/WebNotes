import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './App.css';
import {EditNote} from './pages/EditNote';
import { LandingMenu } from './pages/LandingMenu';
import {
  BrowserRouter,
  Routes,
  Route,
 } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingMenu />}/>
          <Route path="/editNote" element={
            <EditNote intialValue="WebNotes is currently using localstorage to save and load notes. Enter text..."/>
          }/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

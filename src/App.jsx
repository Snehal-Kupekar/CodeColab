
import EditorPage from "./pages/EditorPage"
import Home from "./pages/Home"

import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Toaster} from 'react-hot-toast';

function App() {
  

  return (
    <>
      <div>
      <Toaster
        position="top-right"
        
      />
      </div>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/editor/:roomId" element={<EditorPage/>}/>  
            <Route/>

            
          </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App

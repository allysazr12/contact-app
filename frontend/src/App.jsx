import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Contacts from "./pages/Contacts";
import ContactForm from "./pages/ContactForm";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <Contacts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts/new"
          element={
            <ProtectedRoute>
              <ContactForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts/edit/:id"
          element={
            <ProtectedRoute>
              <ContactForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
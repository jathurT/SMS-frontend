import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Layout from "./Layout";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"
          element={
            <Layout />
          }>
          <Route index element={<Dashboard />} />

        </Route>


      </Routes>
    </Router>
  )
}
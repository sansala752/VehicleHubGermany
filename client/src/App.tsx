import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddVehicle from "./pages/AddVehicle";

export default function App() {
  return (
    <BrowserRouter>
       <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/vehicles/add" element={<AddVehicle />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
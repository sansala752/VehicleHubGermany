import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddVehicle from "./pages/AddVehicle";
import VehicleDetail from "./pages/VehicleDetail";
import EditVehicle from "./pages/EditVehicle"; 
import VehicleTypes from "./pages/VehicleTypes";

export default function App() {
  return (
    <BrowserRouter>
       <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/vehicles/add" element={<AddVehicle />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />       
          <Route path="/vehicles/:id/edit" element={<EditVehicle />} />
          <Route path="/vehicle-types" element={<VehicleTypes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
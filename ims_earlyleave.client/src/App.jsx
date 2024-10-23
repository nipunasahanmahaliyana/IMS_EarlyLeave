import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import Requests from "./Pages/Requests";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AddRequest from "./Pages/AddRequest";
import SupervisorApprove from "./Pages/SupervisorAprrove";
import DownloadRequest from "./Pages/DownloadRequest";
import Notifications from "./Pages/Notifications"
import AdminDashboard from "./Pages/Admin/Dashboard";
import ManageUsers from './Pages/Admin/ManageUsers';
import History from './Pages/Admin/History';
import Report from './Pages/Admin/Report';

function App() {
    return (
        <>
            
                <Router>
                    <Routes>
                        <Route>
                        <Route path="/" element={<Login />} />
                        <Route path="/Home" element={<Home /> } />
                        <Route path="/Dashboard" element={<Dashboard></Dashboard>} />
                        <Route path="/AddRequest" element={<AddRequest></AddRequest>} />
                        <Route path="/Requests" element={<Requests></Requests>} />
                        <Route path="/Profile" element={<Profile></Profile>} />
                        <Route path="/Approve" element={<SupervisorApprove></SupervisorApprove>} />
                        <Route path="/Download" element={<DownloadRequest></DownloadRequest>} />
                        <Route path="/Notification" element={<Notifications></Notifications>} />
                        <Route path="/Register" element={<Register></Register>} />
                        <Route path="/AdminDashboard" element={<AdminDashboard></AdminDashboard>} />
                        <Route path="/ManageUsers" element={<ManageUsers></ManageUsers>} />
                        <Route path="/History" element={<History></History>} />
                        <Route path="/Report" element={<Report></Report>} />
                        </Route>
                    </Routes>
                </Router>
  
       </>
   )
}

export default App;
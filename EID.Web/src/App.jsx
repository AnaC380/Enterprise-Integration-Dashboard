import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Suppliers from './pages/Suppliers/Suppliers';
import Contracts from './pages/Contracts/Contracts';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/suppliers" element={<PrivateRoute><Suppliers /></PrivateRoute>} />
                    <Route path="/contracts" element={<PrivateRoute><Contracts /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;

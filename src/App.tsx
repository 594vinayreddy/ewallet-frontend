import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';
import AddMoney     from './pages/AddMoney';
import Pay          from './pages/Pay';
import Transfer     from './pages/Transfer';
import Balance      from './pages/Balance';
import History      from './pages/History';
import WalletPage   from './pages/Wallet';
import SetPin        from './pages/SetPin';
import ChangePin     from './pages/ChangePin';
import VerifyPin      from './pages/VerifyPin';
import Success        from './pages/Success';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add-money"  element={<ProtectedRoute><AddMoney /></ProtectedRoute>} />
        <Route path="/pay"        element={<ProtectedRoute><Pay /></ProtectedRoute>} />
        <Route path="/transfer"   element= {<ProtectedRoute><Transfer /></ProtectedRoute>}/>
        <Route path="/balance"    element={<ProtectedRoute><Balance /></ProtectedRoute>} />
        <Route path="/history"    element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/wallet"     element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
        <Route path="/set-pin"    element={<ProtectedRoute><SetPin /></ProtectedRoute>} />
        <Route path="/change-pin" element={<ProtectedRoute><ChangePin /></ProtectedRoute>} />
        <Route path="/verify-pin" element={<ProtectedRoute><VerifyPin /></ProtectedRoute>} />
        <Route path="/success"    element={<ProtectedRoute><Success /></ProtectedRoute>} />

        {/* Fallback — unknown routes go to dashboard if logged in */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
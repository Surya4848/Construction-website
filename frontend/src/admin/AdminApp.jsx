import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, Protected } from './auth'
import Layout from './Layout'
import Crud, { cfgs } from './Crud'
import { Login, Dashboard, Enquiries, SettingsPage, Profile } from './pages'

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Protected><Layout /></Protected>}>
          <Route index element={<Dashboard />} />
          {Object.values(cfgs).map(c => <Route key={c.endpoint} path={c.endpoint} element={<Crud cfg={c} />} />)}
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>)
}

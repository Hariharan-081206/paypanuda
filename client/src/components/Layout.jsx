import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUnread } from '../services/notificationService';
export default function Layout({ children }) {
  const { currentUser, logout } = useAuth(); const nav = useNavigate(); const [unread, setUnread] = useState(0);
  useEffect(() => { const refresh = () => getUnread().then((r) => setUnread(r.count)).catch(() => {}); refresh(); const id = setInterval(refresh, 45000); return () => clearInterval(id); }, []);
  const leave = () => { logout(); nav('/login'); };
  return <div className="app-shell"><header><NavLink to="/dashboard" className="brand">Pay<span>Panuda</span></NavLink><nav><NavLink to="/dashboard">Dashboard</NavLink><NavLink to="/groups">Groups</NavLink><NavLink to="/notifications">Notifications {unread > 0 && <b>{unread}</b>}</NavLink></nav><div className="profile"><span>{currentUser?.name}</span><button className="link" onClick={leave}>Log out</button></div></header><main className="page">{children}</main><nav className="mobile-nav"><NavLink to="/dashboard">Home</NavLink><NavLink to="/groups">Groups</NavLink><NavLink to="/notifications">Alerts {unread > 0 && `(${unread})`}</NavLink></nav></div>;
}

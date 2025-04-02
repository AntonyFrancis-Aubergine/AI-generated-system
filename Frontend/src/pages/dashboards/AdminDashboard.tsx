import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import "../../styles/dashboard.css";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <div className="user-info">
            <span className="user-name">Welcome, {user?.name}</span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3 className="card-title">Manage Classes</h3>
            <p className="card-description">
              Create, edit, and delete fitness classes.
            </p>
            <Button className="card-button">Manage Classes</Button>
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Manage Instructors</h3>
            <p className="card-description">
              Add, edit, and remove instructors.
            </p>
            <Button className="card-button">Manage Instructors</Button>
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">User Management</h3>
            <p className="card-description">View and manage user accounts.</p>
            <Button className="card-button">Manage Users</Button>
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Reports</h3>
            <p className="card-description">
              View booking statistics and reports.
            </p>
            <Button className="card-button">View Reports</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useCallback, useEffect, useState } from 'react';
import { Button, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Layout from '../../components/Navbar/Layout';
import Meta from '../../components/Meta';
import { useAuth } from '../../services/AuthContext';
import { UserResponse, userTypeLabel } from '../../services/auth';
import { approveUser, ApprovalStatus, deleteUser, getUsersByStatus, rejectUser } from '../../services/adminService';
import './adminSignupsPage.css';

const fullName = (user: UserResponse) => [user.firstName, user.lastName].filter(Boolean).join(' ');

const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleString() : '–');

// Lets the admin approve or reject new sign-ups. Pending accounts cannot log in until approved.
const AdminSignupsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<ApprovalStatus>('PENDING');
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setUsers(await getUsersByStatus(status));
    } catch (e: any) {
      setError(e.message || 'Could not load sign-ups');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (user?.isAdmin) {
      loadUsers();
    }
  }, [user, loadUsers]);

  const handleApprove = async (target: UserResponse) => {
    setBusyId(target.id);
    try {
      await approveUser(target.id);
      setUsers((current) => current.filter((u) => u.id !== target.id));
    } catch (e: any) {
      alert(e.message || 'Could not approve the sign-up');
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (target: UserResponse) => {
    if (!window.confirm(`Reject and delete the sign-up from ${target.username} (${target.email})?`)) {
      return;
    }
    setBusyId(target.id);
    try {
      await rejectUser(target.id);
      setUsers((current) => current.filter((u) => u.id !== target.id));
    } catch (e: any) {
      alert(e.message || 'Could not reject the sign-up');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (target: UserResponse) => {
    if (
      !window.confirm(
        `Delete the account of ${target.username} (${target.email})? Their master projects and reports are deleted too. This cannot be undone.`
      )
    ) {
      return;
    }
    setBusyId(target.id);
    try {
      await deleteUser(target.id);
      setUsers((current) => current.filter((u) => u.id !== target.id));
    } catch (e: any) {
      alert(e.message || 'Could not delete the user');
    } finally {
      setBusyId(null);
    }
  };

  let content: React.ReactNode;
  if (authLoading) {
    content = <CircularProgress />;
  } else if (!user?.isAdmin) {
    content = <p>Only the administrator can see this page.</p>;
  } else {
    content = (
      <>
        <ToggleButtonGroup
          value={status}
          exclusive
          size="small"
          onChange={(_, value: ApprovalStatus | null) => value && setStatus(value)}
          className="adminStatusToggle"
        >
          <ToggleButton value="PENDING">Waiting for approval</ToggleButton>
          <ToggleButton value="APPROVED">Approved</ToggleButton>
        </ToggleButtonGroup>

        {error && <p className="adminError">{error}</p>}

        {loading ? (
          <CircularProgress />
        ) : users.length === 0 ? (
          <p>{status === 'PENDING' ? 'No sign-ups are waiting for approval.' : 'No approved users yet.'}</p>
        ) : (
          <div className="adminUserList">
            {users.map((u) => (
              <div key={u.id} className="adminUserCard">
                <div className="adminUserInfo">
                  <div className="adminUserName">
                    {u.username}
                    {fullName(u) && <span className="adminUserFullName"> · {fullName(u)}</span>}
                  </div>
                  <div>
                    <a href={`mailto:${u.email}`}>{u.email}</a>
                    {u.phoneNumber && <span> · {u.phoneNumber}</span>}
                  </div>
                  <div className="adminUserMeta">
                    {userTypeLabel(u)} · Signed up {formatDate(u.createdAt)}
                  </div>
                </div>
                {status === 'APPROVED' && !u.isAdmin && (
                  <div className="adminUserActions">
                    <Button variant="outlined" color="error" disabled={busyId === u.id} onClick={() => handleDelete(u)}>
                      Delete
                    </Button>
                  </div>
                )}
                {status === 'PENDING' && (
                  <div className="adminUserActions">
                    <Button
                      variant="contained"
                      disabled={busyId === u.id}
                      onClick={() => handleApprove(u)}
                      sx={{ backgroundColor: '#3D7844', '&:hover': { backgroundColor: '#2e5c34' } }}
                    >
                      Approve
                    </Button>
                    <Button variant="outlined" color="error" disabled={busyId === u.id} onClick={() => handleReject(u)}>
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Meta title="Approve sign-ups" />
      <Layout>
        <div className="adminPage">
          <h1 className="adminTitle">Approve sign-ups</h1>
          <p className="adminIntro">
            New accounts can log in only after you approve them. Rejecting deletes the sign-up; approved users can be
            deleted from the Approved tab.
          </p>
          {content}
        </div>
      </Layout>
    </>
  );
};

export default AdminSignupsPage;

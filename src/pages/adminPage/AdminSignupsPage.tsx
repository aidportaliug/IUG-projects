import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Layout from '../../components/Navbar/Layout';
import Meta from '../../components/Meta';
import { useAuth } from '../../services/AuthContext';
import { UserResponse, userTypeKey } from '../../services/auth';
import {
  approveUser,
  ApprovalStatus,
  changeUserType,
  ChangeableUserType,
  deleteUser,
  getUsersByStatus,
  rejectUser,
} from '../../services/adminService';
import './adminSignupsPage.css';
import { useI18n } from '../../i18n/I18nContext';

const fullName = (user: UserResponse) => [user.firstName, user.lastName].filter(Boolean).join(' ');

// Lets the admin approve or reject new sign-ups. Pending accounts cannot log in until approved.
const AdminSignupsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<ApprovalStatus>('PENDING');
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t, lang } = useI18n();
  const formatDate = (value?: string | null) =>
    value ? new Date(value).toLocaleString(lang === 'nb' ? 'nb-NO' : 'en-GB') : '–';

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await getUsersByStatus(status));
    } catch (e: any) {
      setError(e.message || '');
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
    setError(null);
    setBusyId(target.id);
    try {
      await approveUser(target.id);
      setUsers((current) => current.filter((u) => u.id !== target.id));
    } catch (e: any) {
      setError(e.message || t.admin.approveFailed);
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (target: UserResponse) => {
    if (!window.confirm(t.admin.confirmReject(target.username, target.email))) {
      return;
    }
    setError(null);
    setBusyId(target.id);
    try {
      await rejectUser(target.id);
      setUsers((current) => current.filter((u) => u.id !== target.id));
    } catch (e: any) {
      setError(e.message || t.admin.rejectFailed);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (target: UserResponse) => {
    if (!window.confirm(t.admin.confirmDelete(target.username, target.email))) {
      return;
    }
    setError(null);
    setBusyId(target.id);
    try {
      await deleteUser(target.id);
      setUsers((current) => current.filter((u) => u.id !== target.id));
    } catch (e: any) {
      setError(e.message || t.admin.deleteFailed);
    } finally {
      setBusyId(null);
    }
  };

  const handleTypeChange = async (target: UserResponse, userType: ChangeableUserType) => {
    setError(null);
    setBusyId(target.id);
    try {
      const updated = await changeUserType(target.id, userType);
      setUsers((current) => current.map((u) => (u.id === updated.id ? updated : u)));
    } catch (e: any) {
      setError(e.message || t.admin.typeFailed);
    } finally {
      setBusyId(null);
    }
  };

  let content: React.ReactNode;
  if (authLoading) {
    content = <CircularProgress />;
  } else if (!user?.isAdmin) {
    content = <p>{t.admin.onlyAdmin}</p>;
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
          <ToggleButton value="PENDING">{t.admin.pending}</ToggleButton>
          <ToggleButton value="APPROVED">{t.admin.approved}</ToggleButton>
        </ToggleButtonGroup>

        {error !== null && <p className="adminError">{error || t.admin.loadFailed}</p>}

        {loading ? (
          <CircularProgress />
        ) : users.length === 0 ? (
          <p>{status === 'PENDING' ? t.admin.noPending : t.admin.noApproved}</p>
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
                    {u.isAdmin ? `${t.userType[userTypeKey(u)]} · ` : ''}
                    {t.admin.signedUp(formatDate(u.createdAt))}
                  </div>
                </div>
                {!u.isAdmin && (
                  <FormControl size="small" className="adminUserType">
                    <InputLabel id={`type-label-${u.id}`}>{t.admin.type}</InputLabel>
                    <Select
                      labelId={`type-label-${u.id}`}
                      label={t.admin.type}
                      value={(u.userType === 'admin' ? 'member' : u.userType) ?? 'member'}
                      disabled={busyId === u.id}
                      onChange={(e) => handleTypeChange(u, e.target.value as ChangeableUserType)}
                    >
                      <MenuItem value="member">{t.userType.member}</MenuItem>
                      <MenuItem value="student">{t.userType.student}</MenuItem>
                      <MenuItem value="professor">{t.userType.professor}</MenuItem>
                    </Select>
                  </FormControl>
                )}
                {status === 'APPROVED' && !u.isAdmin && (
                  <div className="adminUserActions">
                    <Button variant="outlined" color="error" disabled={busyId === u.id} onClick={() => handleDelete(u)}>
                      {t.admin.delete}
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
                      {t.admin.approve}
                    </Button>
                    <Button variant="outlined" color="error" disabled={busyId === u.id} onClick={() => handleReject(u)}>
                      {t.admin.reject}
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
      <Meta title={t.admin.title} />
      <Layout>
        <div className="adminPage">
          <h1 className="adminTitle">{t.admin.title}</h1>
          <p className="adminIntro">{t.admin.intro}</p>
          {content}
        </div>
      </Layout>
    </>
  );
};

export default AdminSignupsPage;

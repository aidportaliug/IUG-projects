import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import MenuItemIUG from './MenuItemIUG';
import ButtonForNavbar from './ButtonForNavbar';
import NavLogo from './Navlogo';
import { useFirebaseAuth } from '../../services/AuthContext';
import './navbar.css';

// Master projects and experience reports are no longer shown; the plastic platform is the site's main page.
const pages = ['Plastic Project'];
const settings = ['Profile', 'Logout'];

const Navbar: React.FC = () => {
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const location = window.location.pathname;

  return (
    <AppBar position="fixed" elevation={0} className="app-bar">
      <Container maxWidth="xl">
        <Toolbar disableGutters style={{ width: '100%' }}>
          <NavLogo /> {/* This is the EWB logo */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: '#3D7844' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItemIUG setting={page} key={page} />
              ))}
            </Menu>
          </Box>
          {/* Her skal det være en annen logo for når nettsiden endrer størrelse (Kanskje ikke) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <ButtonForNavbar page={page} location={location} key={page} />
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open profile menu">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} aria-label="open profile menu">
                    <Avatar alt={user.username} sx={{ bgcolor: '#3D7844' }}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItemIUG setting={setting} key={setting} />
                  ))}
                </Menu>
              </>
            ) : (
              // Logged out: a plain Login button (the login page links to sign-up).
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{ color: '#3D7844', borderColor: '#3D7844', textTransform: 'none', fontWeight: 600 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

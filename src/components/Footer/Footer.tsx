import { Box, Container } from '@mui/material';
import NavLogo from '../Navbar/Navlogo';
import './footer.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { IconButton } from '@mui/material';

/**
 *
 */

interface footerProp {
  nameLink1: string;
  nameLink1URL: string;
  nameLink2: string;
  nameLink2URL: string;
  nameLink3: string;
  nameLink3URL: string;
  nameLink4: string;
  nameLink4URL: string;
  category1: string;
  category2: string;
}

/**
 * This function returns a Footer with a buch of links. The parameters are the name
 * the names and targets of the link in the footer. The tow last parameters are the
 * headings of the Column, which dose not contian a link.
 * @param nameLink1
 * @param nameLink1URL
 * @param nameLink2
 * @param nameLink2URL
 * @param nameLink3
 * @param nameLink3URL
 * @param nameLink4
 * @param nameLink4URL
 * @param category1
 * @param category2
 * @constructor
 */
export const Footer = ({
  nameLink1,
  nameLink1URL,
  nameLink2,
  nameLink2URL,
  nameLink3,
  nameLink3URL,
  nameLink4,
  nameLink4URL,
  category1,
  category2,
}: footerProp) => {
  return (
    <Box
      className="Footer"
      sx={{
        width: '100%',
        height: '148px',
        backgroundColor: '#dfe9de',
        paddingTop: '1rem',
        paddingBottom: '1rem',
      }}
    >
      <Container maxWidth="lg">
        <NavLogo />
      </Container>
      <Container>
        <h4>{category1}</h4>
        <a href={nameLink1URL}>{nameLink1}</a>
        <div>
          <a href={nameLink2URL}>{nameLink2}</a>{' '}
        </div>
      </Container>

      <Container>
        <h4>{category2}</h4>
        <div>
          <a href={nameLink3URL}>{nameLink3}</a>{' '}
        </div>
        <div>
          <a href={nameLink4URL}>{nameLink4}</a>{' '}
        </div>
      </Container>

      <Container />

      <Container>
        <IconButton href="https://www.facebook.com/iugntnu/?locale=nb_NO" style={{ color: '#3D7844' }}>
          <FacebookIcon fontSize="large"></FacebookIcon>
        </IconButton>
        <IconButton href="https://www.instagram.com/iugntnu/" style={{ color: '#3D7844' }}>
          <InstagramIcon fontSize="large" />
        </IconButton>
        <IconButton href="https://no.linkedin.com/company/ingeni%C3%B8rerutengrenserntnu">
          <LinkedInIcon fontSize="large" style={{ color: '#3D7844' }} />
        </IconButton>
      </Container>
    </Box>
  );
};

export default Footer;

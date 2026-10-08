import { Box, Container, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import React from 'react';
import NavLogo from '../Navbar/Navlogo';
import './footer.css';

// Plastplattformen is run by Ingeniører Uten Grenser (Engineers Without Borders Norway).
// All links point to the organisation's own website and social media accounts.
const ewbLinks = [
  { label: 'About EWB Norway', href: 'https://iug.no/english' },
  { label: 'Our projects', href: 'https://iug.no/vaart-arbeid/prosjekter' },
  { label: 'Completed assignments', href: 'https://iug.no/vaart-arbeid/oppdrag' },
  { label: 'Become a member', href: 'https://iug.no/stott-oss/bli-medlem' },
  { label: 'Donate', href: 'https://iug.no/stott-oss/gi-en-gave' },
];

const socialLinks = [
  { label: 'EWB Norway on Facebook', href: 'https://www.facebook.com/iugnorge', Icon: FacebookIcon },
  { label: 'EWB Norway on Instagram', href: 'https://www.instagram.com/iugnorge/', Icon: InstagramIcon },
  { label: 'EWB Norway on LinkedIn', href: 'https://www.linkedin.com/company/iugnorge', Icon: LinkedInIcon },
];

const external = { target: '_blank', rel: 'noopener noreferrer' };

export const Footer: React.FC = () => {
  return (
    <Box component="footer" className="Footer">
      <Container maxWidth="lg" className="footerColumns">
        <div className="footerColumn footerAbout">
          <NavLogo />
          <p>
            Plastplattformen is run by Ingeniører Uten Grenser (Engineers Without Borders Norway) to share knowledge
            from plastic and waste projects.
          </p>
          <div className="footerSocial">
            {socialLinks.map(({ label, href, Icon }) => (
              <IconButton key={href} href={href} {...external} aria-label={label} title={label}>
                <Icon fontSize="large" />
              </IconButton>
            ))}
          </div>
        </div>

        <div className="footerColumn">
          <h4>EWB Norway</h4>
          {ewbLinks.map(({ label, href }) => (
            <a key={href} href={href} {...external}>
              {label}
            </a>
          ))}
        </div>

        <div className="footerColumn">
          <h4>Contact</h4>
          <a href="mailto:info@iug.no">info@iug.no</a>
          <span>Mesh Youngstorget (Møllergata 6)</span>
          <span>0179 Oslo, Norway</span>
          <a href="https://iug.no/kontakt-oss" {...external}>
            Contact us
          </a>
        </div>

        <div className="footerColumn">
          <h4>Legal</h4>
          <a href="https://iug.no/personvernerklaering" {...external}>
            Privacy policy
          </a>
          <span>Cookies: only a login token is stored in your browser. No tracking or advertising cookies.</span>
          <span>Org. no. 996 548 651</span>
        </div>
      </Container>

      <Container maxWidth="lg" className="footerBottom">
        <span>© {new Date().getFullYear()} Ingeniører Uten Grenser (Engineers Without Borders Norway)</span>
        <span>
          Created by{' '}
          <a href="https://iug.no/om-oss/lokalavdelinger/iug-ntnu" {...external}>
            EWB NTNU
          </a>{' '}
          ·{' '}
          <a href="https://github.com/aidportaliug/IUG-projects" {...external}>
            Source code on GitHub
          </a>
        </span>
      </Container>
    </Box>
  );
};

export default Footer;

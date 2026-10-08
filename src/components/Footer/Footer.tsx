import { Box, Container, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import React from 'react';
import NavLogo from '../Navbar/Navlogo';
import './footer.css';
import { useI18n } from '../../i18n/I18nContext';

// Plastplattformen is run by Ingeniører Uten Grenser (Engineers Without Borders Norway).
// All links point to the organisation's own website and social media accounts.
// Labels are keys into the footer texts of the active language.
const ewbLinks = [
  { key: 'aboutEwb', href: 'https://iug.no/english', hrefNb: 'https://iug.no/om-oss' },
  { key: 'ourProjects', href: 'https://iug.no/vaart-arbeid/prosjekter' },
  { key: 'completedAssignments', href: 'https://iug.no/vaart-arbeid/oppdrag' },
  { key: 'becomeMember', href: 'https://iug.no/stott-oss/bli-medlem' },
  { key: 'donate', href: 'https://iug.no/stott-oss/gi-en-gave' },
] as const;

const socialLinks = [
  { key: 'facebook', href: 'https://www.facebook.com/iugnorge', Icon: FacebookIcon },
  { key: 'instagram', href: 'https://www.instagram.com/iugnorge/', Icon: InstagramIcon },
  { key: 'linkedin', href: 'https://www.linkedin.com/company/iugnorge', Icon: LinkedInIcon },
] as const;

const external = { target: '_blank', rel: 'noopener noreferrer' };

export const Footer: React.FC = () => {
  const { t, lang } = useI18n();
  return (
    <Box component="footer" className="Footer">
      <Container maxWidth="lg" className="footerColumns">
        <div className="footerColumn footerAbout">
          <NavLogo />
          <p>{t.footer.about}</p>
          <div className="footerSocial">
            {socialLinks.map(({ key, href, Icon }) => (
              <IconButton key={href} href={href} {...external} aria-label={t.footer[key]} title={t.footer[key]}>
                <Icon fontSize="large" />
              </IconButton>
            ))}
          </div>
        </div>

        <div className="footerColumn">
          <h4>{t.footer.ewbHeading}</h4>
          {ewbLinks.map((link) => (
            <a key={link.key} href={lang === 'nb' && 'hrefNb' in link ? link.hrefNb : link.href} {...external}>
              {t.footer[link.key]}
            </a>
          ))}
        </div>

        <div className="footerColumn">
          <h4>{t.footer.contactHeading}</h4>
          <a href="mailto:info@iug.no">info@iug.no</a>
          <span>Mesh Youngstorget (Møllergata 6)</span>
          <span>0179 Oslo, {t.footer.country}</span>
          <a href="https://iug.no/kontakt-oss" {...external}>
            {t.footer.contactUs}
          </a>
        </div>

        <div className="footerColumn">
          <h4>{t.footer.legalHeading}</h4>
          <a href="https://iug.no/personvernerklaering" {...external}>
            {t.footer.privacyPolicy}
          </a>
          <span>{t.footer.cookies}</span>
          <span>{t.footer.orgNumber} 996 548 651</span>
        </div>
      </Container>

      <Container maxWidth="lg" className="footerBottom">
        <span>
          © {new Date().getFullYear()} {t.footer.organisation}
        </span>
        <span>
          {t.footer.createdBy}{' '}
          <a href="https://iug.no/om-oss/lokalavdelinger/iug-ntnu" {...external}>
            EWB NTNU
          </a>{' '}
          ·{' '}
          <a href="https://github.com/aidportaliug/IUG-projects" {...external}>
            {t.footer.sourceCode}
          </a>
        </span>
      </Container>
    </Box>
  );
};

export default Footer;

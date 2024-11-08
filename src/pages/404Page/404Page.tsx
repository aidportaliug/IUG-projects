import React from 'react';
import './404Page.css';
import Layout from '../../components/Navbar/Layout';
import { Button } from '@mui/material';
import Meta from '../../components/Meta';

const errorMessages: string[] = [
  'Oops! Looks like this page is as broken as a shattered light bulb.',
  "This page's brightness went out, just like a broken light bulb.",
  "Sorry, we couldn't light up this page - it's a bit like a busted bulb.",
  'Our apologies, this page is dimmer than a faulty light bulb.',
  "Oh no, you've stumbled upon a page as broken as a cracked light bulb.",
  'It appears that the light bulb of this page needs some fixing.',
  'This page is darker than a room with a blown light bulb.',
  'Whoops! The page is in the dark, just like a broken light bulb.',
  'The page is as useful as a shattered light bulb at the moment.',
  "We'd change this page's status, but it's as broken as a light bulb.",
  'Sorry, the page seems to be experiencing a blackout like a faulty light bulb.',
  'Looks like we need to replace the content on this page, like a broken light bulb.',
  "This page's idea burnt out faster than a fragile light bulb.",
  "It's a bit dim here; this page is as broken as a blown light bulb.",
  "Sorry, you've hit a roadblock as bright as a broken light bulb.",
  'The page is in the dark about where it should be, just like a busted bulb.',
  'Apologies, the content is missing, much like a vanished light bulb.',
  "This page is feeling a little dim - it's as broken as a light bulb.",
  'Oops! The content on this page is shattered, just like a broken light bulb.',
  "It seems we've hit a bump in the road, as bumpy as a cracked light bulb.",
  'Unfortunately, this page is out of order, much like a broken light bulb.',
  "You've reached a dead end as dark as a blown light bulb.",
  'Our apologies, the page is as shattered as a broken light bulb.',
  "Looks like we're in the dark here; this page is as broken as a light bulb.",
  "Sorry, the content couldn't shine through, just like a faulty light bulb.",
  'This page needs a little illumination, much like a broken light bulb.',
  "Oops! The page's purpose is as shattered as a broken light bulb.",
  "It seems we've hit a snag, much like a cracked light bulb.",
  'This page is on the fritz, just like a busted bulb.',
  'Apologies, but this page is dimmer than a room with a blown light bulb.',
  "Sorry, you've reached a page as broken as a shattered light bulb.",
  "This page's brilliance has faded, like a faulty light bulb.",
  'Oh no, this page is in the dark, much like a broken light bulb.',
  'Looks like we need a replacement for this page, just like a broken light bulb.',
  'The page is as useful as a shattered light bulb at the moment.',
  'Sorry, but the content here is as broken as a cracked light bulb.',
  'It appears that the light bulb of this page needs some fixing.',
  'This page is darker than a room with a blown light bulb.',
  'Whoops! The page is as broken as a shattered light bulb.',
  'Our apologies, this page is dimmer than a faulty light bulb.',
];

const ErrorPage: React.FC = () => {
  return (
    <>
      <Meta title="404" />
      <div className="homeBackground" id="error">
        <Layout>
          <div className="homeOutline">
            <div className="homeTitle">404</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4>{errorMessages[Math.floor(Math.random() * errorMessages.length)]}</h4>
            <Button href="./" style={{ backgroundColor: '#3d7844', color: '#FFFFFF' }}>
              Homepage
            </Button>
          </div>
        </Layout>
      </div>
    </>
  );
};

export default ErrorPage;
import React from 'react';
import imageProjectCard from '../../images/plasticProject.png';
import { useI18n } from '../../i18n/I18nContext';
import '../../pages/plasticPage/plasticPage.css';

export interface PlasticProjectCardProps {
  name: string;
  summary?: string;
  startDate?: string;
  endDate?: string;
  country: string;
  plastics: string[];
  product: string;
  financing: string;
  businessModel: string;
  wasteCollected: number;
  // The project's own picture; the default picture is shown when missing.
  image?: string;
  // Small: name and summary only. Detailed: also years, country, plastics, product, financing, business model, waste.
  variant: 'small' | 'detailed';
  onClick?: () => void;
}

// Shown when a project has no picture of its own (cards and the project page).
export const defaultProjectImage = imageProjectCard;

// "2020–2024", "2024" for a single year, or "2022–ongoing" without an end date.
export const formatYears = (startDate: string, endDate: string | undefined, ongoing: string): string => {
  const startYear = startDate.slice(0, 4);
  if (!endDate) return `${startYear}–${ongoing}`;
  const endYear = endDate.slice(0, 4);
  return startYear === endYear ? startYear : `${startYear}–${endYear}`;
};

// Light green style shared by the "upload project" buttons.
export const uploadButtonSx = {
  backgroundColor: 'var(--tertiaryGreen)',
  color: 'var(--mainGreen)',
  border: '1px solid var(--mainGreen)',
  borderRadius: '8px',
  fontWeight: 700,
  textTransform: 'none',
  px: 2,
  '&:hover': { backgroundColor: 'var(--secondaryGreen)' },
} as const;

// One project card, used by the project list and by the live preview in the upload form.
const PlasticProjectCard: React.FC<PlasticProjectCardProps> = (props) => {
  const { t } = useI18n();
  const { name, summary, startDate, endDate, country, plastics, image, variant, onClick } = props;

  return (
    <div className="plasticCard" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="plasticCardOutline">
        <img className="plasticCardImage" src={image || imageProjectCard} alt={name} />
        <div className="plasticCardBody">
          <div className="plasticCardTitle">{name}</div>
          <div className="plasticCardDescription plasticCardDescriptionClamped">{summary}</div>

          {variant === 'detailed' && (
            <>
              <div className="plasticCardTags">
                <b>{t.plastic.years} </b>
                {startDate ? formatYears(startDate, endDate, t.plastic.ongoing) : ''}
              </div>
              <div className="plasticCardTags">
                <b>{t.plastic.country} </b>
                {country}
              </div>
              <div className="plasticCardTags">
                <b>{t.plastic.plastics} </b>
                {plastics.map((plastic) => (
                  <span key={plastic} className="plasticTag">
                    {plastic}
                  </span>
                ))}
              </div>
              <div className="plasticCardTags">
                <b>{t.plastic.product}</b> {props.product}
              </div>
              <div className="plasticCardTags">
                <b>{t.plastic.financing}</b> {props.financing}
              </div>
              <div className="plasticCardTags">
                <b>{t.plastic.businessModel}</b> {props.businessModel}
              </div>
              {props.wasteCollected > 0 && (
                <div className="plasticCardTags">
                  <b>{t.plastic.wasteCollected}</b> {t.common.tons(props.wasteCollected)}
                </div>
              )}
            </>
          )}

          <div className="plasticCardLink">{t.plastic.viewProject}</div>
        </div>
      </div>
    </div>
  );
};

export default PlasticProjectCard;

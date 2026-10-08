import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Language, useI18n } from '../../i18n/I18nContext';

// NO | EN switch in the header; the choice is remembered in the browser.
const LanguageSwitch: React.FC = () => {
  const { lang, setLang, t } = useI18n();

  return (
    <ToggleButtonGroup
      value={lang}
      exclusive
      size="small"
      aria-label={t.language.label}
      onChange={(_, value: Language | null) => value && setLang(value)}
      sx={{
        mr: 1.5,
        '& .MuiToggleButton-root': { color: '#3D7844', borderColor: '#3D7844', px: 1.2, py: 0.4, fontWeight: 600 },
        '& .MuiToggleButton-root.Mui-selected': { backgroundColor: '#3D7844', color: '#fff' },
        '& .MuiToggleButton-root.Mui-selected:hover': { backgroundColor: '#2f5f35' },
      }}
    >
      <ToggleButton value="nb" aria-label={t.language.nb} title={t.language.nb}>
        NO
      </ToggleButton>
      <ToggleButton value="en" aria-label={t.language.en} title={t.language.en}>
        EN
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LanguageSwitch;

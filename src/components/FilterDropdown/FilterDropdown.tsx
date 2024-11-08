import React from 'react';
import './filterDropdown.css';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SetStateAction } from 'react';
import { studyFields, locations, sortByEnum } from '../../models/allowedValues';

interface calanderDateProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  studyField?: boolean;
  location?: boolean;
  sortBy?: boolean;
}

const FilterDropdown = ({
  value,
  setValue,
  studyField = false,
  location = false,
  sortBy = false,
}: calanderDateProps) => {
  const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
    setValue(event.target.value);
  };
  function getDropDown() {
    if (studyField) {
      const keys = Object.keys(studyFields);
      return keys.map((key) => (
        <MenuItem key={key} value={key}>
          {studyFields[key as keyof typeof studyFields]}
        </MenuItem>
      ));
    } else if (sortBy) {
      const keys = Object.keys(sortByEnum);
      return keys.map((key) => (
        <MenuItem key={key} value={key}>
          {sortByEnum[key as keyof typeof sortByEnum]}
        </MenuItem>
      ));
    } else if (location) {
      const keys = Object.keys(locations);
      return keys.map((key) => (
        <MenuItem key={key} value={key}>
          {locations[key as keyof typeof locations]}
        </MenuItem>
      ));
    }
  }
  return (
    <FormControl style={{ width: '200px' }}>
      <InputLabel>{sortBy === true ? 'Sort by' : 'Filter'}</InputLabel>
      <Select label={sortBy === true ? 'Sort by' : 'Filter'} value={value} onChange={handleChange}>
        {getDropDown()}
      </Select>
    </FormControl>
  );
};
export default FilterDropdown;

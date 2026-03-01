import React, { Component } from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

interface PlasticFilterDropdownProps {
  value: string;
  setValue: (value: string) => void;
  country?: boolean;
  plastic?: boolean;
  machine?: boolean;
}

interface FilterOption {
  value: string;
  label: string;
}

class PlasticFilterDropdown extends Component<PlasticFilterDropdownProps> {
  constructor(props: PlasticFilterDropdownProps) {
    super(props);
  }

  private handleChange = (event: SelectChangeEvent<string>): void => {
    this.props.setValue(event.target.value);
  };

  private getOptions(): FilterOption[] {
    const { country, plastic, machine } = this.props;

    if (country) {
      return [
        { value: 'country', label: 'All countries' },
        { value: 'Kenya', label: 'Kenya' },
        { value: 'Tanzania', label: 'Tanzania' },
        { value: 'Uganda', label: 'Uganda' },
        { value: 'Rwanda', label: 'Rwanda' },
        { value: 'Norway', label: 'Norway' },
      ];
    }

    if (plastic) {
      return [
        { value: 'plastic', label: 'All plastics' },
        { value: 'HDPE', label: 'HDPE' },
        { value: 'LDPE', label: 'LDPE' },
        { value: 'PP', label: 'PP' },
        { value: 'PET', label: 'PET' },
        { value: 'PS', label: 'PS' },
        { value: 'PVC', label: 'PVC' },
      ];
    }

    if (machine) {
      return [
        { value: 'machine', label: 'All machines' },
        { value: 'Shredder', label: 'Shredder' },
        { value: 'Extruder', label: 'Extruder' },
        { value: 'Compression Press', label: 'Compression Press' },
        { value: 'Molder', label: 'Injection Molder' },
      ];
    }

    return [];
  }

  private getLabel(): string {
    const { country, plastic, machine } = this.props;

    if (country) return 'Country';
    if (plastic) return 'Plastic Type';
    if (machine) return 'Machine';

    return '';
  }

  render(): JSX.Element {
    const options = this.getOptions();
    const label = this.getLabel();

    return (
      <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
        <InputLabel>{label}</InputLabel>
        <Select value={this.props.value} onChange={this.handleChange} label={label}>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default PlasticFilterDropdown;
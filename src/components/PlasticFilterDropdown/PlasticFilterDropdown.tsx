import { Component } from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

interface PlasticFilterDropdownProps {
  value: string;
  setValue: (value: string) => void;
  country?: boolean;
  plastic?: boolean;
  machine?: boolean;
  // Values to offer, e.g. built from the loaded data. Overrides the built-in lists.
  options?: string[];
  // Translated texts: the field label and the "all" entry.
  label?: string;
  allLabel?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

class PlasticFilterDropdown extends Component<PlasticFilterDropdownProps> {
  private handleChange = (event: SelectChangeEvent<string>): void => {
    this.props.setValue(event.target.value);
  };

  private getAllLabel(): string {
    const { country, plastic, allLabel } = this.props;
    if (allLabel) return allLabel;
    if (country) return 'All countries';
    if (plastic) return 'All plastics';
    return 'All machines';
  }

  private getOptions(): FilterOption[] {
    const { country, plastic, machine, options } = this.props;

    if (options) {
      const allValue = country ? 'country' : plastic ? 'plastic' : 'machine';
      return [
        { value: allValue, label: this.getAllLabel() },
        ...options.map((option) => ({ value: option, label: option })),
      ];
    }

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
    const { country, plastic, machine, label } = this.props;
    if (label) return label;

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

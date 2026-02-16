export interface Plastic {
  plastic_id: string;
  plastic_name: string;
  plastic_description: string;
}

export interface Project {
  project_id: string;
  project_name: string;
  start_date: string;
  end_date?: string;
  country: string;
  project_use: string;
  electricity: boolean;
  complications?: string;
  comments?: string;
  summary?: string;
}

export interface Machine {
  machine_id: string;
  machine_name: string;
  machine_function: string;
  machine_operation: string;
}

export interface ProductionLocation {
  location_id: string;
  location_description: string;
}

export interface Product {
  product_id: string;
  product_name: string;
  product_description: string;
}

export interface Partner {
  partner_id: string;
  partner_name: string;
  partner_description: string;
}

//Junction/linked/join, basically its many to many
export interface ProjectPlastic {
  project_id: string;
  plastic_id: string;
}

export interface ProjectMachine {
  project_id: string;
  machine_id: string;
}

export interface ProjectProduct {
  project_id: string;
  product_id: string;
}

export interface ProjectPartner {
  project_id: string;
  partner_id: string;
}

export interface MachineProductionLocation {
  machine_id: string;
  location_id: string;
}

export interface ProjectWithDetails extends Project {
  plastics?: Plastic[];
  machines?: Machine[];
  products?: Product[];
  partners?: Partner[];
}

export interface PlasticWithProjects extends Plastic {
  projects?: Project[];
}

//Tyoes of filters
export interface DatabaseFilters {
  searchTerm: string;
  selectedCountries: string[];
  selectedPlastics: string[];
  selectedMachines: string[];
  hasElectricity?: boolean;
  dateRange?: {
    start?: string;
    end?: string;
  };
}
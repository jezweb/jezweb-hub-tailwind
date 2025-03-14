/**
 * CountryStateCityField Component
 * 
 * This component provides a comprehensive location selection interface
 * using the @davzon/react-country-state-city package. It allows users to
 * select a country, state, and city in a hierarchical manner.
 * 
 * Features:
 * - Cascading selection of country, state, and city
 * - TailAdmin-styled interface
 * - Error handling and validation
 * - Dark mode support
 * - Accessibility features
 */

import React, { useState, useEffect } from 'react';
import { CountrySelect, StateSelect, CitySelect, CountryData, StateData, CityData } from '@davzon/react-country-state-city';
import '@davzon/react-country-state-city/dist/react-country-state-city.css';
// Import our custom overrides (must come after the library's CSS)
import '../../styles/country-state-city-overrides.css';
import Label from '../form/Label';

interface LocationData {
  country: {
    id: number;
    name: string;
  };
  state: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
}

interface CountryStateCityFieldProps {
  label?: string;
  initialData?: {
    countryId?: number;
    stateId?: number;
    cityId?: number;
  };
  onChange: (data: LocationData) => void;
  className?: string;
  error?: boolean;
  hint?: string;
  disabled?: boolean;
}

const CountryStateCityField: React.FC<CountryStateCityFieldProps> = ({
  label = 'Location',
  initialData = {},
  onChange,
  className = '',
  error = false,
  hint = '',
  disabled = false
}) => {
  const [countryId, setCountryId] = useState<number>(initialData.countryId || 0);
  const [stateId, setStateId] = useState<number>(initialData.stateId || 0);
  const [cityId, setCityId] = useState<number>(initialData.cityId || 0);
  
  const [countryName, setCountryName] = useState<string>('');
  const [stateName, setStateName] = useState<string>('');
  const [cityName, setCityName] = useState<string>('');

  // Update parent component when location data changes
  useEffect(() => {
    if (countryId) {
      onChange({
        country: { id: countryId, name: countryName },
        state: { id: stateId, name: stateName },
        city: { id: cityId, name: cityName }
      });
    }
  }, [countryId, stateId, cityId, countryName, stateName, cityName, onChange]);

  // Add a CSS class for error state
  const errorClass = error ? 'country-state-city-error' : '';

  return (
    <div className={`space-y-4 ${className} ${errorClass}`}>
      {label && (
        <Label>
          {label}
        </Label>
      )}
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="country-select">Country</Label>
          <CountrySelect
            onChange={(e: CountryData) => {
              setCountryId(e.id);
              setCountryName(e.name);
              setStateId(0);
              setStateName('');
              setCityId(0);
              setCityName('');
            }}
            placeHolder="Select Country"
            disabled={disabled}
          />
        </div>
        
        <div>
          <Label htmlFor="state-select">State/Province</Label>
          <StateSelect
            countryid={countryId}
            onChange={(e: StateData) => {
              setStateId(e.id);
              setStateName(e.name);
              setCityId(0);
              setCityName('');
            }}
            placeHolder="Select State"
            disabled={disabled || countryId === 0}
          />
        </div>
        
        <div>
          <Label htmlFor="city-select">City</Label>
          <CitySelect
            countryid={countryId}
            stateid={stateId}
            onChange={(e: CityData) => {
              setCityId(e.id);
              setCityName(e.name);
            }}
            placeHolder="Select City"
            disabled={disabled || stateId === 0}
          />
        </div>
      </div>
      
      {hint && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {hint}
        </p>
      )}
    </div>
  );
};

export default CountryStateCityField;
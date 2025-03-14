/**
 * Type declarations for @davzon/react-country-state-city
 * 
 * This file provides TypeScript type definitions for the @davzon/react-country-state-city package
 * which doesn't include its own type definitions.
 */

declare module '@davzon/react-country-state-city' {
  import { ComponentType, ReactNode } from 'react';

  export interface CountryData {
    id: number;
    name: string;
    iso2: string;
    iso3: string;
    phonecode: string;
    capital: string;
    currency: string;
    native: string;
    emoji: string;
    emojiU: string;
  }

  export interface StateData {
    id: number;
    name: string;
    country_id: number;
    country_code: string;
    state_code: string;
    latitude: string;
    longitude: string;
  }

  export interface CityData {
    id: number;
    name: string;
    state_id: number;
    state_code: string;
    country_id: number;
    country_code: string;
    latitude: string;
    longitude: string;
  }

  export interface CountrySelectProps {
    onChange: (country: CountryData) => void;
    placeHolder?: string;
    containerClassName?: string;
    inputClassName?: string;
    showFlag?: boolean;
    defaultValue?: CountryData;
    disabled?: boolean;
  }

  export interface StateSelectProps {
    countryid: number;
    onChange: (state: StateData) => void;
    placeHolder?: string;
    containerClassName?: string;
    inputClassName?: string;
    defaultValue?: StateData;
    disabled?: boolean;
  }

  export interface CitySelectProps {
    countryid: number;
    stateid: number;
    onChange: (city: CityData) => void;
    placeHolder?: string;
    containerClassName?: string;
    inputClassName?: string;
    defaultValue?: CityData;
    disabled?: boolean;
  }

  export const CountrySelect: ComponentType<CountrySelectProps>;
  export const StateSelect: ComponentType<StateSelectProps>;
  export const CitySelect: ComponentType<CitySelectProps>;
}
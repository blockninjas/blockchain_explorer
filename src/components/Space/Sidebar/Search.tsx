import * as React from 'react';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { 
  IconLookup, 
  IconDefinition,
  findIconDefinition
} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface Props {
  placeholder: string;
}

export const Search = ({ placeholder }: Props) => (
  <InputGroup size="lg" className="mb-3 border-bottom py-2">
    <InputGroupAddon addonType="prepend">
      <span className="input-group-text bg-transparent border-0">
        <FontAwesomeIcon icon={faSearchIcon} />
      </span>
    </InputGroupAddon>
    <Input type="search" className="border-0" placeholder={placeholder} />
    <InputGroupAddon addonType="append">
      <span className="input-group-text bg-transparent border-0">
        <FontAwesomeIcon icon={faListIcon} />
      </span>
    </InputGroupAddon>
  </InputGroup>
);

const faSearchLookup: IconLookup = { prefix: 'fas', iconName: 'search'};
const faSearchIcon: IconDefinition = findIconDefinition(faSearchLookup);

const faListLookup: IconLookup = { prefix: 'fas', iconName: 'list'};
const faListIcon: IconDefinition = findIconDefinition(faListLookup);
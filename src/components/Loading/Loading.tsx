import * as React from 'react';
import { 
  IconLookup, 
  IconDefinition,
  findIconDefinition
} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Loading = () => (
    <FontAwesomeIcon icon={faSpinnerIcon} size="3x" color="#1B2E47" spin pulse />
);

const faSpinnerLookup: IconLookup = { prefix: 'fas', iconName: 'spinner'};
const faSpinnerIcon: IconDefinition = findIconDefinition(faSpinnerLookup);
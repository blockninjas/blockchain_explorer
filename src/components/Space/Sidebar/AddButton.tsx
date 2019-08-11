import * as React from 'react';
import { Button } from 'reactstrap';
import { 
  IconLookup, 
  IconDefinition,
  findIconDefinition
} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface Props {
  btnText: string;
  onBtnClick?: (e: React.FormEvent<HTMLButtonElement>) => void;
}

export const AddButton = ({ btnText, onBtnClick }: Props) => (
  <Button block className="border-0" color="link" onClick={onBtnClick}>
    <FontAwesomeIcon icon={faPlusIcon} className="mr-3" size="lg" />
    <span className="text-dark">{btnText}</span>
  </Button>
);

const faPlusLookup: IconLookup = { prefix: 'fas', iconName: 'plus'};
const faPlusIcon: IconDefinition = findIconDefinition(faPlusLookup);
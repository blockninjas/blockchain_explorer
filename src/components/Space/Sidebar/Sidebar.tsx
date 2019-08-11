import * as React from 'react';
import { 
  IconLookup, 
  IconDefinition,
  findIconDefinition
} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AddButton } from './AddButton';
import { Search } from './Search';

export interface Props {
  searchPlaceholder: string;
  btnText: string;
  onBtnClick?: (e: React.FormEvent<HTMLButtonElement>) => void;
}

export const Sidebar = ({ searchPlaceholder, btnText, onBtnClick }: Props) => (
  <div className="h-100 d-flex flex-column">
    <Search placeholder={searchPlaceholder} />

    <div className="px-md-2 flex-grow-1">
      <ul className="list-group list-group-flush">
        <li className="list-group-item border-0">
          <FontAwesomeIcon icon={faFolderIcon} fixedWidth className="mr-2" />
          Coinbase
        </li>
        <li className="list-group-item border-0">
          <FontAwesomeIcon icon={faFolderIcon} fixedWidth className="mr-2" />
          BitXchange
        </li>
        <li className="list-group-item border-0">
          <FontAwesomeIcon icon={faFolderIcon} fixedWidth className="mr-2" />
          CoinTech
        </li>
      </ul>
    </div>

    <div className="border-top py-2">
      <AddButton onBtnClick={onBtnClick} btnText={btnText} />
    </div>
  </div>
);

const faFolderLookup: IconLookup = { prefix: 'fas', iconName: 'folder'};
const faFolderIcon: IconDefinition = findIconDefinition(faFolderLookup);
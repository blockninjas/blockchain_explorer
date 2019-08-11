import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader } from 'reactstrap';

interface EntryProps {
  to: string;
  subheader: string;
  name: string;
  icon: any;
  iconSecondary?: Object;
}

interface Props {
  headerText: string;
  entries: EntryProps[];
}

export const CardWithListGroup = ({ headerText, entries }: Props) => (
  <Card className="border-0">
    <CardHeader className="bg-transparent text-uppercase">{headerText}</CardHeader>
    <div className="list-group list-group-flush">
      {entries.map(entry => <ListEntry {...entry} key={entry.to} />)}
    </div>
  </Card>
);

const ListEntry = (entry: EntryProps) => (
  <NavLink to={entry.to} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
    {entry.icon && entry.icon}
    <div className="d-block w-100 px-3 py-2">
      <small className="d-block text-muted text-uppercase">{entry.subheader}</small>
      <span className="d-block">{entry.name}</span>
    </div>
    {entry.iconSecondary && entry.iconSecondary}
  </NavLink>
);
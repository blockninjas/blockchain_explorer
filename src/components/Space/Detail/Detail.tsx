import * as React from 'react';

interface Props {
  name: string;
  firstUsed?: Date;
  lastUsed?: Date;
  tag?: string,
  balance?: number;
  receivedCount?: number;
  sentCount?: number;
}

const SATOSHI_BTC_RATIO = 100000000;
const convertSatoshiToBtc = (satoshi: number): number => satoshi / SATOSHI_BTC_RATIO;

export const Detail: React.FunctionComponent<Props> = ({ name, tag = "Unknown", balance = 0, receivedCount = 0, sentCount = 0, firstUsed, lastUsed }) => (
  <>
    <DetailEntry header="INFO">
      <div className="mt-3 font-weight-bold">{tag}</div>

      <div className="mt-4 small text-truncate" title={name}>{name}</div>
    </DetailEntry>
    
    <DetailEntry header="FIRST USED">
      <div className="mt-1">{firstUsed ? firstUsed.toLocaleString() : '-'}</div>

      <small className="mt-4 d-block text-muted">LAST USED</small>
      <div className="mt-1">{lastUsed ? lastUsed.toLocaleString() : '-'}</div>
    </DetailEntry>

    <DetailEntry header="CURRENT BALANCE">
      <div className="mt-1">{convertSatoshiToBtc(balance)} BTC</div>

      <small className="mt-4 d-block text-muted">TOTAL RECEIVED</small>
      <div className="mt-1">{convertSatoshiToBtc(receivedCount)} BTC</div>

      <small className="mt-4 d-block text-muted">TOTAL SENT</small>
      <div className="mt-1">{convertSatoshiToBtc(sentCount)} BTC</div>
    </DetailEntry>

    {
    /*<DetailEntry header="NOTES">
      <div className="mt-3 font-weight-bold border-bottom">Add Note</div>
    </DetailEntry>*/
    }
  </>
);

const DetailEntry: React.FunctionComponent<{header: string}> = ({ children, header }) => (
  <div className="px-3 py-4 border-bottom">
    <small className="d-block text-muted">{header}</small>
    {children}
  </div>
);
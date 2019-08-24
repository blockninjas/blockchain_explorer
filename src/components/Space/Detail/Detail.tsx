import * as React from 'react';

interface Props {
  name: string;
  tag?: string,
  balance?: number;
  receivedCount?: number;
  sentCount?: number;
}

const SATOSHI_BTC_RATIO = 100000000;
const convertSatoshiToBtc = (satoshi: number): number => satoshi / SATOSHI_BTC_RATIO;

export const Detail: React.FunctionComponent<Props> = ({ name, tag = "Unknown", balance = 0, receivedCount = 0, sentCount = 0 }) => (
  <>
    <DetailEntry header="INFO">
      <div className="mt-3 font-weight-bold">{tag}</div>

      <div className="mt-4 small text-truncate" title={name}>{name}</div>
    </DetailEntry>
    
    <DetailEntry header="FIRST USED">
      <div className="mt-1">9. May 2018 16:14:42</div>

      <small className="mt-4 d-block text-muted">LAST USED</small>
      <div className="mt-1">9. May 2018 17:14:42</div>
    </DetailEntry>

    <DetailEntry header="TOTAL TRANSFERRED (BTC)">
      <div className="mt-1">1.233242</div>

      <small className="mt-4 d-block text-muted">CURRENT BALANCE (BTC)</small>
      <div className="mt-1">{convertSatoshiToBtc(balance)}</div>

      <small className="mt-4 d-block text-muted">COUNT</small>
      <div className="mt-1">
        <span className="mr-2 mr-lg-5">{convertSatoshiToBtc(receivedCount)} received</span>
        <span>{convertSatoshiToBtc(sentCount)} sent</span>
      </div>
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
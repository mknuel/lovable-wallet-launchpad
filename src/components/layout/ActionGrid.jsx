import React from 'react';
import { ActionCard } from './ActionCard';

export const ActionGrid = ({
  onDepositClick = () => {},
  onBorrowClick = () => {},
  onStakeClick = () => {},
  onRepayClick = () => {}
}) => {
  return (
    <section className="flex w-3/4 flex-col items-start gap-6 relative max-md:w-[calc(100%_-_32px)] max-md:max-w-[321px] max-sm:w-[calc(100%_-_24px)] max-sm:gap-4 max-sm:mx-3 max-sm:my-0">
      <div className="flex items-center gap-[7px] self-stretch relative max-sm:gap-2">
        <ActionCard
          title="Deposit"
          isHighlighted={true}
          onClick={onDepositClick}
        />
        <ActionCard
          title="Borrow"
          onClick={onBorrowClick}
        />
      </div>
      <div className="flex items-center gap-[7px] self-stretch relative max-sm:gap-2">
        <ActionCard
          title="Stake"
          onClick={onStakeClick}
        />
        <ActionCard
          title="Repay"
          onClick={onRepayClick}
        />
      </div>
    </section>
  );
};
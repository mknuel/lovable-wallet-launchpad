import React from 'react';
import { ActionCard } from './ActionCard';

export const ActionGrid = ({
  onDepositClick = () => {},
  onBorrowClick = () => {},
  onStakeClick = () => {},
  onRepayClick = () => {},
  selectedAction = 'deposit'
}) => {
  return (
		<section className="flex w-full max-w-sm flex-col items-center gap-4 relative px-4">
			<div className="flex items-center gap-2 w-full">
				<ActionCard
					title="Deposit"
					isHighlighted={selectedAction === "deposit"}
					onClick={onDepositClick}
				/>
				<ActionCard
					title="Borrow"
					isHighlighted={selectedAction === "borrow"}
					onClick={onBorrowClick}
				/>
			</div>
			<div className="flex items-center gap-2 w-full">
				<ActionCard
					title="Stake"
					isHighlighted={selectedAction === "stake"}
					onClick={onStakeClick}
					disabled={true}
				/>
				<ActionCard
					title="Repay"
					isHighlighted={selectedAction === "repay"}
					onClick={onRepayClick}
				/>
			</div>
		</section>
	);
};

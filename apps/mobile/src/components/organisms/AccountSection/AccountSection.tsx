import { useState } from "react";
import type { Account } from "shared";
import BottomSheet from "@/components/templates/BottomSheet/BottomSheet";
import UserSectionList from "@/components/organisms/UserSectionList/UserSectionList";
import UserSectionItem from "@/components/molecules/UserSectionItem/UserSectionItem";
import AccountForm from "@/components/organisms/AccountForm/AccountForm";
import { SkeletonLoader } from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import { useGetAccountsQuery } from "@/services/accountApi";

const AccountSection = () => {
  const { data: accounts = [], isLoading } = useGetAccountsQuery();
  const [selected, setSelected] = useState<Account | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  if (isLoading) return <SkeletonLoader />;

  return (
    <>
      <BottomSheet
        isVisible={isAdding}
        title="New Account"
        onClose={() => setIsAdding(false)}
      >
        <AccountForm onClose={() => setIsAdding(false)} />
      </BottomSheet>
      <BottomSheet
        isVisible={!!selected}
        title="Edit Account"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <AccountForm account={selected} onClose={() => setSelected(null)} />
        )}
      </BottomSheet>
      <UserSectionList title="Accounts" onAdd={() => setIsAdding(true)}>
        {accounts.map((account) => (
          <UserSectionItem
            key={account._id}
            label={account.name}
            subtitle={`${account.balance.toLocaleString()} ${account.currency}${account.isDefault ? " · Default" : ""}`}
            onEdit={() => setSelected(account)}
          />
        ))}
      </UserSectionList>
    </>
  );
};

export default AccountSection;

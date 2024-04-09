import { Account } from 'models/Account';

export function accountDTO(account: Account) {
    return {
        Id: account.Id,
        AccountId: account.AccountId,
    };
}

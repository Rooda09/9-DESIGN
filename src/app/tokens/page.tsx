import { requireCurrentUser } from '@/lib/auth/request';
import { TOKEN_REFILL_OPTIONS } from '@/lib/tokens/refill-options';
import { ensureTokenWallet } from '@/lib/tokens/wallet';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TokenWalletPage({ searchParams }: PageProps) {
  const user = await requireCurrentUser();
  const wallet = await ensureTokenWallet(user.id);
  const params = await searchParams;

  return (
    <main style={{ padding: 32, maxWidth: 760 }}>
      <h1>Token wallet</h1>
      <p>Current balance: <strong>{wallet.balance}</strong> tokens.</p>
      {params?.refill === 'pending' ? <p style={{ color: '#047857' }}>Refill request recorded as pending. Payment is not integrated yet.</p> : null}
      {params?.error ? <p style={{ color: '#b91c1c' }}>Choose a valid token package.</p> : null}

      <section>
        <h2>Placeholder refill</h2>
        <p>This records a pending transaction only. It does not charge a card or add spendable tokens.</p>
        <form action="/api/tokens/refill" method="post" style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
          <label>
            Package
            <select name="packageKey" defaultValue="starter" style={{ display: 'block', width: '100%' }}>
              {TOKEN_REFILL_OPTIONS.map(option => (
                <option key={option.key} value={option.key}>
                  {option.label} - {option.tokens} tokens - estimated ${option.estimatedPriceUsd}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Request placeholder refill</button>
        </form>
      </section>

      <section>
        <h2>Transaction history</h2>
        {wallet.transactions.length === 0 ? (
          <p>No token transactions yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">Date</th>
                <th align="left">Type</th>
                <th align="left">Status</th>
                <th align="right">Amount</th>
                <th align="right">Balance after</th>
              </tr>
            </thead>
            <tbody>
              {wallet.transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.createdAt.toISOString().slice(0, 10)}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.status}</td>
                  <td align="right">{transaction.amount}</td>
                  <td align="right">{transaction.balanceAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

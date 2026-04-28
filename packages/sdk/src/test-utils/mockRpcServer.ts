import { vi } from 'vitest';

export function createMockRpcServer(overrides: Record<string, unknown> = {}) {
  const mock = {
    getAccount: vi.fn(),
    simulateTransaction: vi.fn(),
    sendTransaction: vi.fn(),
    getTransaction: vi.fn(),
    getNetwork: vi.fn(),

    mockSuccess() {
      this.simulateTransaction.mockResolvedValue({ result: {} });
      this.sendTransaction.mockResolvedValue({ hash: 'tx123' });
      this.getTransaction.mockResolvedValue({ status: 'SUCCESS', ledger: 12345 });
    },

    mockPendingThenSuccess() {
      this.getTransaction
        .mockResolvedValueOnce({ status: 'PENDING' })
        .mockResolvedValueOnce({ status: 'SUCCESS', ledger: 123 });
    },

    mockFailure() {
      this.getTransaction.mockResolvedValue({ status: 'FAILED', ledger: 123 });
    },

    mockTimeout() {
      this.simulateTransaction.mockRejectedValue(new Error('timeout'));
    },

    mockMalformed() {
      this.simulateTransaction.mockResolvedValue({});
    },

    ...overrides,
  };

  return mock;
}
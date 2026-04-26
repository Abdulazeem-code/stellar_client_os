import { Client as ContractClient } from "./generated/distributor/src/index";
import {
  AssembledTransaction,
  ClientOptions as ContractClientOptions,
} from "@stellar/stellar-sdk/contract";
import {
  UserStats,
  TokenStats,
  DistributionHistory,
} from "./generated/distributor/src/index";
import { executeWithErrorHandling } from "./utils/errors";

/**
 * High-level client for interacting with the Distributor contract.
 * Provides a type-safe and DX-optimized interface for all contract methods.
 *
 * All methods now include error handling that parses Soroban simulation errors
 * and transaction result XDR to provide human-readable error messages.
 */
export class DistributorClient {
  private client: ContractClient;

  /**
   * Create a new DistributorClient.
   * @param options Configuration for the underlying contract client.
   */
  constructor(options: ContractClientOptions) {
    this.client = new ContractClient(options);
  }

  /**
   * Distribute tokens equally among a list of recipients.
   * @param params Parameters including sender, token, total amount, and recipients.
   * @throws {FundableStellarError} If distribution fails with a human-readable error message
   */
  public async distributeEqual(params: {
    sender: string;
    token: string;
    total_amount: bigint;
    recipients: string[];
  }): Promise<AssembledTransaction<null>> {
    return executeWithErrorHandling(
      () => this.client.distribute_equal(params),
      "Distribute tokens equally",
    );
  }

  /**
   * Distribute tokens among a list of recipients with specific amounts for each.
   * @param params Parameters including sender, token, recipients, and amounts.
   * @throws {FundableStellarError} If distribution fails with a human-readable error message
   */
  public async distributeWeighted(params: {
    sender: string;
    token: string;
    recipients: string[];
    amounts: bigint[];
  }): Promise<AssembledTransaction<null>> {
    return executeWithErrorHandling(
      () => this.client.distribute_weighted(params),
      "Distribute tokens with weights",
    );
  }

  /**
   * Get the administrator address for the contract.
   * @throws {FundableStellarError} If fetch fails with a human-readable error message
   */
  public async getAdmin(): Promise<AssembledTransaction<string | undefined>> {
    return executeWithErrorHandling(
      () => this.client.get_admin() as any,
      "Get administrator",
    );
  }

  /**
   * Get stats for a specific user.
   * @param user The address of the user.
   * @throws {FundableStellarError} If fetch fails with a human-readable error message
   */
  public async getUserStats(
    user: string,
  ): Promise<AssembledTransaction<UserStats | undefined>> {
    return executeWithErrorHandling(
      () => this.client.get_user_stats({ user }) as any,
      "Get user statistics",
    );
  }

  /**
   * Get stats for a specific token.
   * @param token The address of the token (contract ID).
   * @throws {FundableStellarError} If fetch fails with a human-readable error message
   */
  public async getTokenStats(
    token: string,
  ): Promise<AssembledTransaction<TokenStats | undefined>> {
    return executeWithErrorHandling(
      () => this.client.get_token_stats({ token }) as any,
      "Get token statistics",
    );
  }

  /**
   * Get the total number of distributions made through the contract.
   * @throws {FundableStellarError} If fetch fails with a human-readable error message
   */
  public async getTotalDistributions(): Promise<AssembledTransaction<bigint>> {
    return executeWithErrorHandling(
      () => this.client.get_total_distributions(),
      "Get total distributions",
    );
  }

  /**
   * Get the total amount distributed through the contract.
   * @throws {FundableStellarError} If fetch fails with a human-readable error message
   */
  public async getTotalDistributedAmount(): Promise<
    AssembledTransaction<bigint>
  > {
    return executeWithErrorHandling(
      () => this.client.get_total_distributed_amount(),
      "Get total distributed amount",
    );
  }

  /**
   * Get distribution history with pagination.
   * @param startId The ID to start from.
   * @param limit The maximum number of records to return.
   * @throws {FundableStellarError} If fetch fails with a human-readable error message
   */
  public async getDistributionHistory(
    startId: bigint,
    limit: bigint,
  ): Promise<AssembledTransaction<DistributionHistory[]>> {
    return executeWithErrorHandling(
      () => this.client.get_distribution_history({ start_id: startId, limit }),
      "Get distribution history",
    );
  }

  /**
   * Initialize the contract.
   * @throws {FundableStellarError} If initialization fails with a human-readable error message
   */
  public async initialize(params: {
    admin: string;
    protocol_fee_percent: number;
    fee_address: string;
  }): Promise<AssembledTransaction<null>> {
    return executeWithErrorHandling(
      () => this.client.initialize(params),
      "Initialize contract",
    );
  }

  /**
   * Set the protocol fee. Only the administrator can call this.
   * @throws {FundableStellarError} If operation fails with a human-readable error message
   */
  public async setProtocolFee(
    admin: string,
    newFeePercent: number,
  ): Promise<AssembledTransaction<null>> {
    return executeWithErrorHandling(
      () =>
        this.client.set_protocol_fee({ admin, new_fee_percent: newFeePercent }),
      "Set protocol fee",
    );
  }
}

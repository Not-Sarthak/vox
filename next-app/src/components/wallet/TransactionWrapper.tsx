"use client";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  TOKEN_ABI,
  TOKEN_ADDRESS,
} from "@/utils/contract";
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import type {
  TransactionError,
  TransactionResponse,
} from "@coinbase/onchainkit/transaction";
import {
  parseEther,
  type Address,
  type ContractFunctionParameters,
} from "viem";
import { base, baseSepolia } from "viem/chains";

interface TransactionWrapperProps {
  functionName: string;
  args: any[];
  onSuccess: () => void;
  onError: () => void;
  isApprovalTx?: boolean;
  approvalAmount?: number;
  text?: string;
  className?: string;
}

export default function TransactionWrapper({
  functionName,
  args,
  onSuccess,
  onError,
  isApprovalTx,
  approvalAmount,
  text,
  className,
}: TransactionWrapperProps) {
  console.log("args", args);
  const contracts = [
    ...(isApprovalTx
      ? [
          {
            address: TOKEN_ADDRESS,
            abi: TOKEN_ABI,
            functionName: "approve",
            args: [CONTRACT_ADDRESS, approvalAmount ?? parseEther("1000")],
          },
        ]
      : []),
    {
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName,
      args,
    },
  ] as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error("Transaction error:", err);
  };

  console.log("contracts");

  return (
    <div className='flex '>
      <Transaction
        capabilities={{
          paymasterService: {
            url: process.env.NEXT_PUBLIC_PAYMASTER_URL!,
          },
        }}
        contracts={contracts}
        chainId={base.id}
        onError={handleError}
        onSuccess={onSuccess}
        onStatus={(status) => {
          console.log("Transaction status", status);
        }}
      >
        <TransactionButton
          className={`mt-0 mr-auto ml-auto max-w-full text-[white] bg-black hover:bg-gray-800`}
          text={text ?? "List now"}
        />
      </Transaction>
    </div>
  );
}

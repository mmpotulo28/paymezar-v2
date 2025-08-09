import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Chip,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Tooltip,
  Alert,
} from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Banknote,
  BanknoteArrowUp,
  Landmark,
  Wallet,
  BanknoteArrowDown,
} from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

import { useAccount } from "@/context/AccountContext";
import { BANKS } from "@/lib/banks";
import { postApi } from "@/lib/helpers";

export function WithdrawDeposit() {
  const { user } = useUser();
  const {
    bankAccounts,
    refreshBankAccounts,
    loadingBankAccounts,
    balance,
    loadingBalance,
  } = useAccount();
  const [tab, setTab] = useState<"withdraw" | "deposit">("withdraw");

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // Deposit state
  const [depositAmount, setDepositAmount] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState<string | null>(null);
  const [depositError, setDepositError] = useState<string | null>(null);

  const userBalance =
    balance?.tokens?.find((t) => t.name === "ZAR")?.balance ??
    balance?.tokens?.[0]?.balance ??
    "0.00";

  const isTestnet = true; // Set to true to disable deposit/withdraw on testnet

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawLoading(true);
    setWithdrawError(null);
    setWithdrawSuccess(null);

    if (!user?.id) {
      setWithdrawError("User not found.");
      setWithdrawLoading(false);

      return;
    }
    if (
      !withdrawAmount ||
      isNaN(Number(withdrawAmount)) ||
      Number(withdrawAmount) <= 0
    ) {
      setWithdrawError("Please enter a valid amount.");
      setWithdrawLoading(false);

      return;
    }
    if (!selectedBankId) {
      setWithdrawError("Please select a bank account.");
      setWithdrawLoading(false);

      return;
    }

    const bank = bankAccounts.find((b) => b.id === selectedBankId);

    if (!bank) {
      setWithdrawError("Selected bank account not found.");
      setWithdrawLoading(false);

      return;
    }

    const result = await postApi(
      `https://seal-app-qp9cc.ondigitalocean.app/api/v1/withdraw/${encodeURIComponent(user.id)}`,
      {
        amount: Number(withdrawAmount),
        bankAccountId: bank.id,
      },
      {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
      },
      "POST",
    );

    if (!result.error) {
      setWithdrawSuccess("Withdrawal request submitted successfully!");
      setWithdrawAmount("");
      setSelectedBankId("");
      await refreshBankAccounts();
    } else {
      setWithdrawError(result.message || "Failed to submit withdrawal.");
    }
    setWithdrawLoading(false);
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositLoading(true);
    setDepositError(null);
    setDepositSuccess(null);

    if (!user?.id) {
      setDepositError("User not found.");
      setDepositLoading(false);

      return;
    }
    const isValidAmount =
      !depositAmount ||
      isNaN(Number(depositAmount)) ||
      Number(depositAmount) <= 0;

    if (isValidAmount) {
      setDepositError("Please enter a valid amount.");
      setDepositLoading(false);

      return;
    }
    if (!selectedBankId) {
      setDepositError("Please select a bank account.");
      setDepositLoading(false);

      return;
    }

    const bank = bankAccounts.find((b) => b.id === selectedBankId);

    if (!bank) {
      setDepositError("Selected bank account not found.");
      setDepositLoading(false);

      return;
    }

    const result = await postApi(
      `https://seal-app-qp9cc.ondigitalocean.app/api/v1/deposit/${encodeURIComponent(user.id)}`,
      {
        amount: Number(depositAmount),
        bankAccountId: bank.id,
      },
      {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
      },
      "POST",
    );

    if (!result.error) {
      setDepositSuccess("Deposit request submitted successfully!");
      setDepositAmount("");
      setSelectedBankId("");
      await refreshBankAccounts();
    } else {
      setDepositError(result.message || "Failed to submit deposit.");
    }
    setDepositLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg border border-default-200">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Wallet className="text-primary" size={20} />
          <span className="text-lg font-semibold">Withdraw / Deposit</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-default-500 font-medium">
            Your ZAR Balance:
          </span>
          <Chip
            className="font-mono text-base px-3 py-1"
            color="primary"
            variant="flat"
          >
            {loadingBalance ? "Loading..." : `${userBalance} ZAR`}
          </Chip>
        </div>

        {isTestnet && (
          <Alert
            color={"danger"}
            description={`Withdrawals and deposits are disabled on testnet.`}
            title={`Heads Up!`}
            variant="bordered"
          />
        )}
      </CardHeader>
      <CardBody>
        <Tabs
          className="mb-4"
          color="secondary"
          selectedKey={tab}
          variant="solid"
          onSelectionChange={(key) => setTab(key as "withdraw" | "deposit")}
        >
          <Tab key="withdraw" title="Withdraw">
            <form className="flex flex-col gap-4" onSubmit={handleWithdraw}>
              <Input
                required
                endContent={
                  <Tooltip content="Maximum: your available balance">
                    <span className="text-xs text-default-400">
                      Max: {userBalance} ZAR
                    </span>
                  </Tooltip>
                }
                label="Amount to Withdraw"
                min={1}
                startContent={<Banknote size={16} />}
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <Select
                required
                description="Choose the bank account to withdraw from"
                disabled={loadingBankAccounts || bankAccounts.length === 0}
                label="Select Bank Account"
                startContent={<Landmark size={16} />}
                value={selectedBankId}
                onChange={(e) => setSelectedBankId(e.target.value)}
              >
                {bankAccounts.map((bank) => (
                  <SelectItem
                    key={bank.id}
                    description={bank.bank}
                    startContent={
                      <Image
                        alt={bank.bank}
                        height={16}
                        src={
                          BANKS.find((b) => b.name === bank.bank)?.icon || ""
                        }
                        width={16}
                      />
                    }
                    textValue={bank.accountNumber}
                  >
                    {bank.accountHolder} - ({bank.accountNumber})
                  </SelectItem>
                ))}
              </Select>
              <Tooltip
                showArrow
                color="warning"
                content="Withdrawals are disabled on testnet"
                radius="sm"
              >
                <Button
                  className="w-full"
                  color="primary"
                  disabled={withdrawLoading || isTestnet}
                  isLoading={withdrawLoading}
                  radius="full"
                  startContent={<BanknoteArrowDown size={16} />}
                  type="submit"
                >
                  Withdraw
                </Button>
              </Tooltip>
              {withdrawSuccess && (
                <Chip
                  className="w-full justify-center"
                  color="success"
                  variant="flat"
                >
                  {withdrawSuccess}
                </Chip>
              )}
              {withdrawError && (
                <Chip
                  className="w-full justify-center"
                  color="danger"
                  variant="flat"
                >
                  {withdrawError}
                </Chip>
              )}
            </form>
          </Tab>
          <Tab key="deposit" title="Deposit">
            <form className="flex flex-col gap-4" onSubmit={handleDeposit}>
              <Input
                required
                label="Amount to Deposit"
                min={1}
                startContent={<Banknote size={16} />}
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <Select
                required
                description="Choose the bank account to deposit into"
                disabled={loadingBankAccounts || bankAccounts.length === 0}
                label="Select Bank Account"
                startContent={<Landmark size={16} />}
                value={selectedBankId}
                onChange={(e) => setSelectedBankId(e.target.value)}
              >
                {bankAccounts.map((bank) => (
                  <SelectItem
                    key={bank.id}
                    description={bank.bank}
                    textValue={bank.accountNumber}
                  >
                    {bank.accountHolder} - ({bank.accountNumber})
                  </SelectItem>
                ))}
              </Select>
              <Tooltip
                showArrow
                color="warning"
                content="Deposits are disabled on testnet"
              >
                <Button
                  className="w-full"
                  color="primary"
                  disabled={depositLoading || isTestnet}
                  isLoading={depositLoading}
                  radius="full"
                  startContent={<BanknoteArrowUp size={16} />}
                  type="submit"
                >
                  Deposit
                </Button>
              </Tooltip>
              {depositSuccess && (
                <Chip
                  className="w-full justify-center"
                  color="success"
                  variant="flat"
                >
                  {depositSuccess}
                </Chip>
              )}
              {depositError && (
                <Chip
                  className="w-full justify-center"
                  color="danger"
                  variant="flat"
                >
                  {depositError}
                </Chip>
              )}
            </form>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}

"use client";
import { Card, CardHeader, CardBody, Button, Chip } from "@heroui/react";
import { Tabs, Tab } from "@heroui/tabs";
import { Input } from "@heroui/input";
import { useCallback, useMemo, useState } from "react";
import { Download, FileText, RefreshCcw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import { useAccount } from "@/context/AccountContext";
import TransactionModal from "@/components/modals/transaction-modal";
import { iTransaction } from "@/types";
import { useUser } from "@clerk/nextjs";

import { TDocumentDefinitions } from "pdfmake/interfaces";

pdfMake.vfs = pdfFonts.vfs;

const PAYMEZAR_ADDRESS = "PayMe-Zar, 123 Crypto Lane, Cape Town, 8001, South Africa";
const PAYMEZAR_EMAIL = "support@paymezar.com";
const PAYMEZAR_PHONE = "+27 21 123 4567";

function fetchImageAsBase64(url: string): Promise<string> {
	return fetch(url)
		.then((response) => response.blob())
		.then(
			(blob) =>
				new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => {
						resolve(reader.result as string);
					};
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				}),
		);
}

const getLogoBase64 = async (): Promise<string> => {
	// Use the public path for the logo
	return await fetchImageAsBase64("/paymezar-logo.png");
};

export default function AccountTransactionsPage() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const PAGE_SIZE = 5;
	const { user } = useUser();
	const { transactions, transactionsLoading, transactionsError, fetchTransactions } =
		useAccount();
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedTx, setSelectedTx] = useState<iTransaction | null>(null);

	// Filter transactions by search and status
	const filtered = useMemo(
		() =>
			transactions.filter((tx) => {
				const matchesSearch =
					search === "" ||
					tx.id.includes(search) ||
					tx.userId.includes(search) ||
					(tx.externalId && tx.externalId.includes(search));
				const matchesStatus = !status || tx.status === status;

				return matchesSearch && matchesStatus;
			}),
		[search, status, transactions],
	);

	const totalPages = useMemo(() => Math.ceil(filtered.length / PAGE_SIZE), [filtered]);
	const paginatedTxs = useMemo(
		() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
		[filtered, page],
	);

	const handleView = useCallback((tx: iTransaction) => {
		setSelectedTx(tx);
		setModalOpen(true);
	}, []);

	const handlePageChange = useCallback((newPage: number) => {
		setPage(newPage);
	}, []);

	const handleExportTransactions = useCallback(() => {
		// Simulate export
		alert("Transactions exported!");
	}, []);

	const handleDownloadStatement = useCallback(async () => {
		const logoBase64 = await getLogoBase64();

		const docDefinition: TDocumentDefinitions = {
			info: {
				title: "PayMe-Zar Transaction Statement",
				author: "PayMe-Zar",
			},
			pageSize: "A4",
			pageOrientation: "portrait",
			pageMargins: [40, 20, 40, 20],
			watermark: {
				text: "PayMe-Zar",
				color: "#6366f1",
				opacity: 0.08,
				bold: true,
				fontSize: 60,
			},
			images: {
				logo: logoBase64,
			},
			content: [
				// Letterhead
				{
					columns: [
						{
							image: "logo",
							width: 80,
							height: 80,
						},
						[
							{
								text: "PayMe-Zar",
								style: "letterheadTitle",
								margin: [10, 0, 0, 0],
							},
							{
								text: PAYMEZAR_ADDRESS,
								style: "letterheadAddress",
								margin: [10, 2, 0, 0],
							},
							{
								text: `Email: ${PAYMEZAR_EMAIL} | Tel: ${PAYMEZAR_PHONE}`,
								style: "letterheadContact",
								margin: [10, 2, 0, 0],
							},
						],
					],
					columnGap: 20,
					margin: [0, 0, 0, 16],
				},
				{
					text: "Transaction Statement",
					style: "header",
					margin: [0, 0, 0, 12],
				},
				{
					text: `Generated: ${new Date().toLocaleString()}`,
					style: "subheader",
					margin: [0, 0, 0, 8],
				},
				{
					table: {
						headerRows: 1,
						widths: ["auto", "*", "auto", "auto", "auto", "auto"],
						body: [
							[
								{ text: "ID", style: "tableHeader" },
								{ text: "Date", style: "tableHeader" },
								{ text: "Type", style: "tableHeader" },
								{ text: "Method", style: "tableHeader" },
								{ text: "Amount", style: "tableHeader" },
								{ text: "Status", style: "tableHeader" },
							],
							...transactions.map((tx) => [
								{ text: tx.id, style: "tableCell" },
								{ text: tx.createdAt.split("T")[0], style: "tableCell" },
								{ text: tx.txType, style: "tableCell" },
								{ text: tx.method, style: "tableCell" },
								{
									text: tx.value.toLocaleString("en-ZA", {
										style: "currency",
										currency: "ZAR",
									}),
									style: "tableCell",
								},
								{ text: tx.status, style: "tableCell" },
							]),
						],
					},
					layout: "headerLineOnly",
					margin: [0, 8, 0, 8],
				},
				{
					columns: [
						{
							width: "*",
							text: "",
						},
						{
							width: "auto",
							stack: [
								{
									text: "Signed electronically by:",
									style: "signedLabel",
									margin: [0, 24, 0, 2],
								},
								{
									text: "PayMe-Zar Team",
									style: "signedName",
								},
								{
									text: "support@paymezar.com",
									style: "signedContact",
								},
							],
						},
					],
				},
				{
					text: "Thank you for using PayMe-Zar!",
					style: "footer",
					margin: [0, 16, 0, 0],
				},
			],
			styles: {
				letterheadTitle: {
					fontSize: 22,
					bold: true,
					color: "#6366f1",
				},
				letterheadAddress: {
					fontSize: 10,
					color: "#666",
				},
				letterheadContact: {
					fontSize: 10,
					color: "#666",
				},
				header: {
					fontSize: 18,
					bold: true,
					color: "#6366f1",
					alignment: "center",
				},
				subheader: {
					fontSize: 12,
					color: "#666",
					alignment: "center",
				},
				tableHeader: {
					bold: true,
					fontSize: 11,
					color: "#fff",
					fillColor: "#6366f1",
					alignment: "center",
				},
				tableCell: {
					fontSize: 10,
					color: "#222",
					alignment: "center",
				},
				signedLabel: {
					fontSize: 10,
					color: "#666",
					italics: true,
				},
				signedName: {
					fontSize: 12,
					bold: true,
					color: "#6366f1",
				},
				signedContact: {
					fontSize: 10,
					color: "#666",
				},
				footer: {
					fontSize: 12,
					italics: true,
					color: "#6366f1",
					alignment: "center",
				},
			},
			defaultStyle: {
				font: "Roboto",
			},
		};

		pdfMake.createPdf(docDefinition).download("paymezar_statement.pdf");
	}, [transactions]);

	return (
		<section className="flex flex-col items-center min-h-[70vh] py-8 gap-8 w-full">
			<Card className="w-full max-w-4xl">
				<CardHeader className="text-xl font-bold flex items-center justify-between">
					<span>Manage Transactions</span>
					<Button
						color="secondary"
						disabled={transactionsLoading}
						startContent={
							<RefreshCcw
								className={transactionsLoading ? "animate-spin" : ""}
								size={16}
							/>
						}
						type="button"
						variant="flat"
						onPress={() => fetchTransactions(user?.id || "", true)}>
						{transactionsLoading ? "Refreshing..." : "Refresh"}
					</Button>
				</CardHeader>
				<CardBody className="flex flex-col gap-4 ">
					<div className="flex flex-col sm:flex-row gap-4 flex-wrap">
						<Input
							className="flex-1 max-w-xs"
							placeholder="Search by ID, user, or external ref..."
							size="sm"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Tabs
							className="flex-1"
							selectedKey={status || "all"}
							variant="underlined"
							onSelectionChange={(key) =>
								setStatus(key === "all" ? null : String(key))
							}>
							<Tab key="all" title="All" />
							<Tab key="Complete" title="Completed" />
							<Tab key="Pending" title="Pending" />
						</Tabs>

						<div className="flex gap-2 justify-start">
							<Button
								color="primary"
								size="sm"
								startContent={<FileText size={16} />}
								variant="flat"
								onPress={handleExportTransactions}>
								Export
							</Button>
							<Button
								color="secondary"
								size="sm"
								startContent={<Download size={16} />}
								variant="flat"
								onPress={handleDownloadStatement}>
								Download Statement
							</Button>
						</div>
					</div>

					<div className="flex flex-col gap-4 w-full"></div>
					{transactionsLoading && (
						<div className="text-default-400 text-center py-4">Loading...</div>
					)}
					{transactionsError && (
						<div className="text-red-600 text-center py-4">{transactionsError}</div>
					)}
					<div className="flex flex-col gap-3 mt-2 min-h-[320px]">
						{filtered.length === 0 && !transactionsLoading && (
							<div className="text-default-400 text-center py-4">
								No transactions found.
							</div>
						)}

						<AnimatePresence mode="wait">
							<motion.div
								key={page}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.25 }}
								className="flex flex-col gap-3">
								{paginatedTxs.map((tx) => (
									<button
										key={tx.id}
										className="w-full text-left rounded-xl border border-default-200 bg-default-50 hover:bg-default-100 transition flex flex-col sm:flex-row items-start justify-center gap-2 p-4 cursor-pointer"
										type="button"
										onClick={() => handleView(tx)}>
										<div className="flex-1 flex flex-col gap-1">
											<div className="flex items-center gap-2">
												<span className="font-mono text-xs text-default-500 truncate max-w-[120px]">
													{tx.id}
												</span>
												<Chip
													color={
														tx.status === "Complete"
															? "success"
															: tx.status === "Pending"
																? "warning"
																: "default"
													}
													size="sm"
													variant="flat">
													{tx.status}
												</Chip>
											</div>
											<span className="text-xs text-default-400">
												{tx.createdAt.split("T")[0]}
											</span>
											<span className="text-xs text-default-600">
												Type: {tx.txType} | Method: {tx.method}
											</span>
											{tx.externalId && (
												<span className="text-xs text-default-400">
													External Ref: {tx.externalId}
												</span>
											)}
										</div>
										<div className="flex md:flex-col sm:flex-row md:items-end sm:items-start gap-1 min-w-[90px]">
											<span className="font-mono text-base font-bold text-primary">
												{tx.value.toLocaleString("en-ZA", {
													style: "currency",
													currency: "ZAR",
												})}
											</span>
											<span className="text-xs text-default-500">
												{tx.currency}
											</span>
										</div>
									</button>
								))}
							</motion.div>
						</AnimatePresence>
					</div>
					{/* Pagination controls */}
					{totalPages > 1 && (
						<div className="flex justify-center items-center gap-2 mt-4">
							<Button
								size="sm"
								variant="flat"
								disabled={page === 1}
								onPress={() => handlePageChange(page - 1)}>
								Prev
							</Button>
							<span className="text-xs">
								Page {page} of {totalPages}
							</span>
							<Button
								size="sm"
								variant="flat"
								disabled={page === totalPages}
								onPress={() => handlePageChange(page + 1)}>
								Next
							</Button>
						</div>
					)}
				</CardBody>
			</Card>
			<TransactionModal
				isOpen={modalOpen}
				selected={selectedTx}
				onClose={() => setModalOpen(false)}
			/>
		</section>
	);
}

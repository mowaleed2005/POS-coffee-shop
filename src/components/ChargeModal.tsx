"use client";

import { useEffect, useRef, useState } from "react";

export default function ChargeModal({ open, onClose, total, payment, onConfirm, submitting }) {
    const dialogRef = useRef(null);
    const [received, setReceived] = useState("");

    const isCash = payment === "Cash";
    const totalFixed = Number(total.toFixed(2));
    const receivedNum = Number(received);
    const change = receivedNum - totalFixed;
    const canConfirm = !submitting && (!isCash || (received !== "" && change >= 0));

    // فتح وقفل الـ dialog حسب الـ prop
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open && !dialog.open) {
            setReceived("");
            dialog.showModal();
        }
        if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    // مبالغ سريعة: المبلغ بالظبط + تقريبات لأعلى
    const quickAmounts = [
        totalFixed,
        Math.ceil(totalFixed / 5) * 5,
        Math.ceil(totalFixed / 10) * 10,
        Math.ceil(totalFixed / 50) * 50,
        Math.ceil(totalFixed / 100) * 100,
    ].filter((v, i, arr) => arr.indexOf(v) === i);

    return (
        <dialog ref={dialogRef} className="modal" onClose={onClose} onCancel={(e) => submitting && e.preventDefault()}>
            <div className="modal-box max-w-md">
                <h3 className="text-lg font-bold">Payment</h3>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-100 p-4">
                    <div>
                        <p className="text-xs text-slate-500">Total due</p>
                        <p className="text-3xl font-bold text-slate-900">${totalFixed.toFixed(2)}</p>
                    </div>
                    <span className="rounded-full bg-[#e6f4f1] px-3 py-1 text-sm font-semibold text-[#0f766e]">
                        {payment}
                    </span>
                </div>

                {isCash ? (
                    <div className="mt-5 flex flex-col gap-3">
                        <label htmlFor="received" className="text-[13px] font-semibold text-slate-900">
                            Amount received
                        </label>

                        <input
                            id="received"
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            value={received}
                            onChange={(e) => setReceived(e.target.value)}
                            placeholder="0.00"
                            autoFocus
                            className="h-12 w-full rounded-[10px] border border-slate-300 px-3.5 text-lg outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                        />

                        <div className="flex flex-wrap gap-2">
                            {quickAmounts.map((amount) => (
                                <button key={amount} type="button" onClick={() => setReceived(String(amount))} className="h-11 cursor-pointer rounded-full border border-slate-300 px-4 text-sm font-semibold hover:bg-slate-50">
                                    ${amount.toFixed(2)}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                            <span className="text-sm text-slate-600">
                                {received !== "" && change < 0 ? "Remaining" : "Change"}
                            </span>
                            <span className={`text-xl font-bold ${received !== "" && change < 0 ? "text-red-600" : "text-[#0f766e]"
                                }`}>
                                ${received === "" ? "0.00" : Math.abs(change).toFixed(2)}
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="mt-5 text-sm text-slate-600">
                        Complete the payment on the {payment === "Card" ? "card terminal" : "wallet app"}, then
                        confirm here once it is approved.
                    </p>
                )}

                <div className="modal-action mt-6 flex gap-2">
                    <button type="button" onClick={onClose} disabled={submitting} className="h-12 flex-1 cursor-pointer rounded-xl border border-slate-300 font-semibold hover:bg-slate-50 disabled:opacity-50">
                        Cancel
                    </button>

                    <button type="button" onClick={onConfirm} disabled={!canConfirm} className="h-12 flex-1 cursor-pointer rounded-xl bg-[#0f766e] font-bold text-white hover:bg-[#0d625b] disabled:opacity-50">
                        {submitting ? "Processing..." : "Confirm payment"}
                    </button>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button disabled={submitting}>close</button>
            </form>
        </dialog>
    );
}
"use client";

import { useState } from "react";
import { domain, useCart } from "@/store/Store";
import axios from "axios";
import toast from "react-hot-toast";
import ChargeModal from "./ChargeModal";

export default function SideCard() {
    const { cart, setCart } = useCart();
    const [payment, setPayment] = useState("Cash");
    const [submitting, setSubmitting] = useState(false);
    const [chargeOpen, setChargeOpen] = useState(false);

    const subtotal = cart.reduce(
        (total, item) =>
            total + Number(item.Price) * item.quantity,
        0
    );

    const discount = cart.length > 0 ? 1 : 0;

    const tax = (subtotal - discount) * 0.14;

    const total = subtotal - discount + tax;

    const updateQuantity = (product, amount) => {
        const updatedCart = cart.map((item) => item.documentId === product.documentId ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0);

        setCart(updatedCart);
    };

    const cancelOrder = () => {
        setCart([]);
    };

    const postOrder = async () => {
        if (cart.length === 0 || submitting) return;

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        setSubmitting(true);
        try {
            await axios.post(`${domain}api/orders`, {
                paymentMethod: payment.toLowerCase(),
                discount,
                items: cart.map((item) => ({
                    productId: item.documentId,
                    quantity: item.quantity,
                })),
            },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Order completed");
            setCart([]);
            setChargeOpen(false);

        } catch (err) {
            const message = axios.isAxiosError(err) ? err.response?.data?.error?.message ?? "Failed to create order" : "Failed to create order";
            toast.error(message);
            console.log(err.response?.data);
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="w-full h-full flex flex-col justify-between p-5 bg-white">

            <div className="flex flex-col gap-5 flex-1 min-h-0">

                <div className="flex justify-between items-center">
                    <h1 className="text-[18px] font-bold text-gray-900">
                        Current order
                    </h1>

                    <span className="text-sm text-gray-500">
                        Order #1042
                    </span>
                </div>

                <div className="flex flex-col overflow-y-auto min-h-0">

                    {cart.map((item) => (

                        <div key={item.documentId} className="flex justify-between items-center py-3 border-b border-gray-200 gap-2">

                            <div className="flex-1 min-w-0">

                                <h3 className="font-semibold text-sm text-gray-900 truncate">
                                    {item.name}
                                </h3>

                                <p className="text-xs text-gray-500">
                                    ${Number(item.Price).toFixed(2)} each
                                </p>

                            </div>

                            <div className="flex items-center gap-3">

                                <button onClick={() => updateQuantity(item, -1)} className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold transition-all">
                                    −
                                </button>

                                <span className="font-semibold text-sm min-w-3 text-center">
                                    {item.quantity}
                                </span>

                                <button onClick={() => updateQuantity(item, 1)} className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold transition-all">
                                    +
                                </button>

                            </div>

                            <h3 className="font-bold text-gray-900 min-w-[55px] text-right">
                                ${(Number(item.Price) * item.quantity).toFixed(2)}
                            </h3>

                        </div>

                    ))}

                    {cart.length === 0 && (
                        <div className="flex justify-center items-center flex-1 text-gray-400 text-sm">
                            Your cart is empty
                        </div>
                    )}

                </div>

            </div>

            <div className="flex flex-col gap-4 mt-5">

                <div className="flex flex-col gap-2">

                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>

                        <span>
                            ${subtotal.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Discount</span>

                        <span>
                            - ${discount.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Tax (14%)</span>

                        <span>
                            ${tax.toFixed(2)}
                        </span>
                    </div>

                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between items-center">

                    <h2 className="text-xl font-bold text-gray-900">
                        Total
                    </h2>

                    <span className="text-2xl font-bold text-gray-900">
                        ${total.toFixed(2)}
                    </span>

                </div>

                <div className="grid grid-cols-3 gap-2">

                    {["Cash", "Card", "Wallet"].map((method) => (

                        <button key={method} onClick={() => setPayment(method)} className={`h-11 rounded-xl border text-sm font-semibold transition-all ${payment === method ? "border-[#0f766e] text-[#0f766e] bg-white" : "border-gray-300 text-gray-800 hover:border-[#0f766e]"}`}>
                            {method}
                        </button>

                    ))}

                </div>

                <button disabled={cart.length === 0} onClick={() => setChargeOpen(true)} className="h-14 w-full rounded-xl bg-[#0f766e] hover:bg-[#0d625b] text-white font-bold text-lg transition-all disabled:opacity-50">
                    Charge ${total.toFixed(2)}
                </button>

                <button onClick={cancelOrder} disabled={cart.length === 0} className="h-10 w-full text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50">
                    Cancel order
                </button>

            </div>

            <ChargeModal open={chargeOpen} onClose={() => setChargeOpen(false)} total={total} payment={payment} onConfirm={postOrder} submitting={submitting} />
        </div>
    );
}
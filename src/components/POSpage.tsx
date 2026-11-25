"use client"

import POSheader from "@/components/POSheader";
import { domain, useCart } from "@/store/Store";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SideCard from "./SideCard";

export default function POSpage() {
    const [cat, setCat] = useState([]);
    const [activeCat, setActiveCat] = useState("all");
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const { cart, setCart } = useCart();

    const addToCart = (product) => {
        const findProdcut = cart.find((item) => item.documentId == product.documentId)

        if (findProdcut) {
            setCart(
                cart.map((item) => item.documentId == product.documentId ? { ...item, quantity: item.quantity + 1 } : item)
            )
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    }

    const fetchCategories = () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        axios.get(`${domain}api/categories?populate=*`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
            .then((res) => {
                setCat(res.data.data);
                // setActiveCat(res.data.data[0]?.documentId);
            })
            .catch((err) => {
                const message = err.response?.data?.error?.message || "Failed to load categories";
                toast.error(message);
            });
    };

    const fetchProducts = () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        axios.get(`${domain}api/products?populate=*`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
            .then((res) => {
                setProducts(res.data.data);
            })
            .catch((err) => {
                const message = err.response?.data?.error?.message || "Failed to load products";
                toast.error(message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((item) => {
        const matchCategory = activeCat === "all" || item.category?.documentId === activeCat;
        const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase());

        return matchCategory && matchSearch;
    });

    return (
        <div className="w-full h-dvh flex flex-col overflow-hidden bg-[#f6f7f9]">

            <POSheader />

            <div className="flex-1 min-h-0 flex">

                <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

                    <div className="p-4 flex flex-col gap-4 bg-[#f6f7f9]">

                        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} className="input input-bordered w-full h-12 bg-white rounded-xl focus:outline-none focus:border-[#0f766e]" placeholder="Search products or scan a barcode..." />

                        <div className="flex gap-3 overflow-x-auto pb-2">

                            <button onClick={() => setActiveCat("all")} className={`${activeCat === "all" ? "bg-[#0f766e] text-white" : "bg-white text-gray-700 border border-gray-200"} px-5 py-2 rounded-lg whitespace-nowrap transition-all`}>
                                All
                            </button>

                            {cat?.map((item) => (
                                <button key={item.documentId} onClick={() => setActiveCat(item.documentId)} className={`${activeCat === item.documentId ? "bg-[#0f766e] text-white" : "bg-white text-gray-700 border border-gray-200"} px-5 py-2 rounded-lg whitespace-nowrap transition-all`}>
                                    {item.name}
                                </button>
                            ))}
                        </div>

                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto p-4">

                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <span className="loading loading-spinner loading-lg text-[#0f766e]"></span>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex justify-center items-center h-40 text-gray-400">
                                No products found
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">

                                {filteredProducts.map((item) => (
                                    <div key={item.documentId} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden" >

                                        <div className="p-4 flex flex-col gap-4">

                                            <div>
                                                <h2 className="text-[15px] font-bold text-gray-800 truncate">
                                                    {item.name}
                                                </h2>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    In Stock: 120
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between">

                                                <span className="text-[#0f766e] text-[16px] font-bold">
                                                    ${Number(item.Price).toFixed(2)}
                                                </span>

                                                <button onClick={() => addToCart(item)} className="btn btn-sm bg-[#0f766e] text-white hover:bg-gray-800 border-none rounded-lg">
                                                    +
                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                </div>

                <div className="w-90 shrink-0 border-l border-gray-200 bg-white">
                    <SideCard />
                </div>

            </div>

        </div>
    );
}
"use client";

import LoginCopo from "@/components/LoginCopo";
import { domain } from "@/store/Store";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),

    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

    rememberMe: Yup.boolean()
});



export default function LoginPage() {

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        if (token) {
            router.replace("/pos")
        }
    }, [router])

    return (
        <div className='w-full min-h-dvh flex'>
            <LoginCopo />

            <div className="flex flex-1 items-center justify-center p-8">
                <Formik
                    initialValues={{ email: "", password: "", rememberMe: false }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, { setSubmitting }) => {

                        try {
                            const res = await axios.post(`${domain}api/auth/local`, {
                                identifier: values.email,
                                password: values.password
                            });

                            const token = res.data.jwt;
                            const user = res.data.user;

                            localStorage.removeItem("token");
                            localStorage.removeItem("user");

                            sessionStorage.removeItem("token");
                            sessionStorage.removeItem("user");

                            const storage = values.rememberMe ? localStorage : sessionStorage;

                            storage.setItem("token", token);
                            storage.setItem("user", JSON.stringify(user));

                            console.log(values);
                            router.replace("/pos");
                        } catch (err) {
                            const message = axios.isAxiosError(err) ? err.response?.data?.error?.message ?? "Login failed" : "Login failed";
                            toast.error(message);
                        } finally {
                            setSubmitting(false);
                        }


                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="w-full max-w-100 flex flex-col gap-4.5">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-[28px]">Welcome Back</h3>
                                <span className="text-[15px] text-black/50">Sign in to start your shift</span>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="text-[13px] font-semibold text-[#0f172a]">Email</label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@store.com"
                                    className="h-12 w-full rounded-[10px] border border-slate-300 bg-white px-3.5 text-[15px] font-normal text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                                />
                                <ErrorMessage name="email" component="p" className="text-xs font-medium text-[#DC2626]" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="password" className="text-[13px] font-semibold text-[#0f172a]">Password</label>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="h-12 w-full rounded-[10px] border border-slate-300 bg-white px-3.5 text-[15px] font-normal text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                                />
                                <ErrorMessage name="password" component="p" className="text-xs font-medium text-[#DC2626]" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-[13px] font-medium text-[#475569] cursor-pointer">
                                    <Field name="rememberMe" type="checkbox" className="size-4.5 cursor-pointer accent-[#0f766e]" />
                                    Remember Me
                                </label>

                                <Link href="/forgot-password" className="text-[13px] font-semibold text-[#0f766e]">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-13 rounded-[10px] bg-[#0f766e] text-base font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60 cursor-pointer"
                            >
                                {isSubmitting ? "Signing in..." : "Sign In"}
                            </button>

                            <p className="text-center text-sm text-[#475569]">
                                New here?{" "}
                                <Link href="/register" className="font-semibold text-[#0f766e]">
                                    Create an account
                                </Link>
                            </p>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
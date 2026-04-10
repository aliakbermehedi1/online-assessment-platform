"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Footer from "@/components/ui/Footer";
import Image from "next/image";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

export default function EmployerLoginPage() {
  const { loginEmployer, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      loginEmployer(values.email, values.password);
    },
  });

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <Image
            src="/akij-logo.png"
            alt="Akij Resource"
            width={120}
            height={32}
            className="object-contain"
          />
          <span className="font-semibold text-gray-700 text-sm">
            Akij Resource
          </span>
          <div className="w-[120px]" />
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h1>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}

            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-5"
            >
              <Input
                label="Email/ User ID"
                name="email"
                type="email"
                placeholder="Enter your email/User ID"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
              />

              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 w-5 flex items-center justify-center"
                  >
                    <i
                      className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} text-base`}
                    ></i>
                  </button>
                }
              />

              <div className="text-right -mt-2">
                <span className="text-sm text-gray-500 cursor-pointer hover:text-[#6B3FE7] transition-colors">
                  Forget Password?
                </span>
              </div>

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

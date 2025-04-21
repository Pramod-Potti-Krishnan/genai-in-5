import { useLocation } from "wouter";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Register() {
  const [_, setLocation] = useLocation();
  
  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <svg 
            className="h-12 w-auto text-primary-500"
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M11 6.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z"></path>
            <path d="M14.258 10.158a2 2 0 0 0-2.803.353L9.063 13.551a3.317 3.317 0 0 0-.728 3.39A3.3 3.3 0 0 0 11.655 19c.86 0 1.699-.344 2.314-.958l3.392-3.383"></path>
            <path d="M18.5 8a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0z"></path>
            <path d="M7 12.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z"></path>
            <path d="M9 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path>
            <path d="M14.5 19a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z"></path>
          </svg>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <RegisterForm />

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button 
            onClick={() => setLocation("/")} 
            className="font-semibold leading-6 text-primary-500 hover:text-primary-400"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

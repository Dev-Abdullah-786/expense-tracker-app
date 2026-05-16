import { AlertCircle } from "lucide-react";

const AuthError = ({ message }: { message: string }) => (
  <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm mb-5">
    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
    <span>{message}</span>
  </div>
);

export default AuthError;

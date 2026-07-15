import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NotFound = ({
  title = " 404 - Page Not Found",
  message = "The page you are looking for does not exist. Please check the URLand try again.",
}) => {
  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircleIcon className="w-6 h-6 text-red-500" />
        <AlertTitle className="text-4xl font-bold">{title}</AlertTitle>
        <AlertDescription>
          <p className="text-center text-white">{message}</p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NotFound;

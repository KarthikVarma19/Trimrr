import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = ({
  title = "Page not found",
  message = "The page you're looking for doesn't exist or may have been moved.",
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="font-serif text-7xl tracking-tight text-primary sm:text-8xl">
        404
      </span>
      <h1 className="mt-4 font-serif text-3xl tracking-tight">{title}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">{message}</p>
      <Button className="mt-8" onClick={() => navigate("/")}>
        Back to home
      </Button>
    </div>
  );
};

export default NotFound;

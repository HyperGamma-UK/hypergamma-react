import { Button } from "components/ui/button";
import { Loader2 } from "lucide-react";

export function ButtonLoading({ children = 'Please wait'}) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {children}
      </Button>
    )
  }
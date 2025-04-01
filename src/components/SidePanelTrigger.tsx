
import React from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SidePanel from './SidePanel';

const SidePanelTrigger: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 text-white z-10"
        >
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SidePanel open={open} onOpenChange={setOpen} />
    </Sheet>
  );
};

export default SidePanelTrigger;

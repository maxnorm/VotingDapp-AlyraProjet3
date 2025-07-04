import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useContract } from "@/contexts/useContract";
import { toast } from "sonner";

function AddVoterDialog() {
  const [open, setOpen] = useState(false);
  
  const [newVoterAddress, setNewVoterAddress] = useState("");
  const { addVoter, isPending, isConfirming, isSuccess, error, hash } = useContract();

  useEffect(() => {
    if (isSuccess) {
      setNewVoterAddress("");
      setOpen(false);
    }
  }, [isSuccess]);

  const handle = async () => {
    // TODO: Add error handling
    await addVoter(newVoterAddress);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          + Add Voter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Voter</DialogTitle>
          <DialogDescription>
            Enter the address of the voter you want to register
          </DialogDescription>
        </DialogHeader>
        <Input
          id="address"
          placeholder="0x..."
          value={newVoterAddress}
          onChange={(e) => setNewVoterAddress(e.target.value)}
          disabled={isPending || isConfirming}
        />
        {error && <p className="text-red-500">{error.message}</p>}
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={() => handle()} 
            disabled={isPending || isConfirming || newVoterAddress.trim() === ""}
            className="w-full bg-[var(--accent-secondary)] text-secondary"
          >
            {isPending && "Adding..."}
            {isConfirming && "Confirming..."}
            {!isPending && !isConfirming && "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddVoterDialog;
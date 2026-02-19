import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';

export default function Checkout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-24 px-4 flex items-center justify-center">
      <div className="max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-2">Checkout moved to Chat</h1>
        <p className="text-zinc-600 mb-6">
          Payment is only available from seller-issued payment requests inside private messages.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/messages')} className="flex-1 bg-black text-white hover:bg-zinc-800">
            Open Messages
          </Button>
          <Button onClick={() => navigate('/basket')} variant="outline" className="flex-1">
            Open Basket
          </Button>
        </div>
      </div>
    </div>
  );
}

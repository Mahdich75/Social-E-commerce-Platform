import { FormEvent, useMemo, useState } from 'react';
import { ChevronLeft, Menu, Search, Send, Wallet, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useCommerceChatStore } from '../store/useCommerceChatStore';
import { formatPriceToman } from '../utils/price';
import { toast } from 'sonner';

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [draft, setDraft] = useState('');
  const [sellerPrice, setSellerPrice] = useState('');
  const [sellerMode, setSellerMode] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const conversations = useCommerceChatStore((state) => state.conversations);
  const messagesByConversation = useCommerceChatStore((state) => state.messagesByConversation);
  const sendBuyerText = useCommerceChatStore((state) => state.sendBuyerText);
  const sendSellerPaymentRequest = useCommerceChatStore((state) => state.sendSellerPaymentRequest);
  const markOrderShipped = useCommerceChatStore((state) => state.markOrderShipped);
  const payFromRequest = useCommerceChatStore((state) => state.payFromRequest);

  const conversationId = searchParams.get('conversation') ?? '';
  const selectedConversation = conversations.find((chat) => chat.id === conversationId) ?? conversations[0];

  const selectedMessages = useMemo(
    () => (selectedConversation ? messagesByConversation[selectedConversation.id] ?? [] : []),
    [messagesByConversation, selectedConversation]
  );

  const openConversation = (id: string) => {
    setSearchParams({ conversation: id });
    setIsHistoryOpen(false);
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !draft.trim()) return;
    sendBuyerText(selectedConversation.id, draft);
    setDraft('');
  };

  const handleSellerRequest = () => {
    if (!selectedConversation) return;
    if (!sellerMode) {
      toast.error('Enable Seller Mode first');
      return;
    }

    const normalized = Number(sellerPrice.replace(/[,_\s]/g, ''));
    if (!Number.isFinite(normalized) || normalized <= 0) {
      toast.error('Enter a valid final price');
      return;
    }

    sendSellerPaymentRequest(selectedConversation.id, normalized);
    setSellerPrice('');
    toast.success('Payment request sent by seller');
  };

  const handlePay = (messageId: string) => {
    if (!selectedConversation) return;
    const result = payFromRequest(selectedConversation.id, messageId);
    if (!result) {
      toast.error('Payment request is invalid or already paid');
      return;
    }

    toast.success('Payment successful. Order moved to basket.');
    navigate('/basket');
  };

  const handleShip = (orderId: string) => {
    if (!selectedConversation) return;
    if (!sellerMode) {
      toast.error('Enable Seller Mode first');
      return;
    }
    markOrderShipped(selectedConversation.id, orderId);
    toast.success('Order marked as shipped');
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 bg-white border-b border-zinc-200 z-10 px-4 pt-12 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Link to="/" className="p-2 -ml-2 hover:bg-zinc-100 rounded-full transition-colors ui-pressable ui-focus-ring" aria-label="Back to feed">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors ui-pressable ui-focus-ring"
            aria-label="Open chats history"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        <div className="bg-zinc-100 rounded-full px-4 py-2.5 flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-500">Search chats</span>
        </div>
      </div>

      <div className="min-h-[calc(100vh-9.5rem)]">
        <section className="flex flex-col min-h-[calc(100vh-9.5rem)]">
          {selectedConversation ? (
            <>
              <div className="px-4 py-3 border-b border-zinc-200">
                <p className="font-semibold">Seller: {selectedConversation.sellerName}</p>
                <p className="text-xs text-zinc-500">Page owner: {selectedConversation.pageOwnerName}</p>
                <p className="text-xs text-zinc-500">Product: {selectedConversation.productName}</p>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-zinc-50">
                {selectedMessages.map((message) => {
                  const isBuyer = message.sender === 'buyer';

                  return (
                    <div key={message.id} className={`flex ${isBuyer ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                          message.type === 'system'
                            ? 'bg-zinc-200 text-zinc-700 text-xs'
                            : isBuyer
                              ? 'bg-black text-white'
                              : 'bg-white border border-zinc-200 text-zinc-900'
                        }`}
                      >
                        {message.type === 'payment_request' && message.paymentRequest ? (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold">Payment Request</p>
                            <p className="text-xs">Order ID: {message.paymentRequest.orderId}</p>
                            <p className="text-sm font-bold">Final price: {formatPriceToman(message.paymentRequest.finalPrice)}</p>
                            <p className="text-xs">Product: {selectedConversation.productName}</p>

                            {message.paymentRequest.status === 'pending' ? (
                              <button
                                onClick={() => handlePay(message.id)}
                                className="w-full mt-1 rounded-lg bg-black text-white px-3 py-2 text-sm font-semibold ui-pressable ui-focus-ring"
                              >
                                Pay in Chat
                              </button>
                            ) : (
                              <div className="space-y-1">
                                <div className="text-xs font-semibold text-green-600">Paid</div>
                                {sellerMode && (
                                  <button
                                    onClick={() => handleShip(message.paymentRequest.orderId)}
                                    className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold hover:bg-zinc-100 ui-pressable ui-focus-ring"
                                  >
                                    Mark as Shipped
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm leading-5">{message.text}</p>
                        )}

                        <p className="text-[10px] opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-zinc-200 bg-white p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-zinc-700 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sellerMode}
                      onChange={(e) => setSellerMode(e.target.checked)}
                      className="accent-black"
                    />
                    Seller Mode
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={sellerPrice}
                      onChange={(e) => setSellerPrice(e.target.value)}
                      placeholder="Final price"
                      className="h-9 w-28 rounded-lg border border-zinc-300 px-2 text-xs"
                    />
                    <button
                      onClick={handleSellerRequest}
                      className="h-9 rounded-lg border border-zinc-300 px-2.5 text-xs font-semibold flex items-center gap-1 hover:bg-zinc-100 ui-pressable ui-focus-ring"
                    >
                      <Wallet className="w-3.5 h-3.5" /> Request
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Send your price or terms..."
                    className="h-10 flex-1 rounded-full border border-zinc-300 px-4 text-sm outline-none"
                  />
                  <button type="submit" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center ui-pressable ui-focus-ring">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">No conversation selected.</div>
          )}
        </section>
      </div>

      {isHistoryOpen && (
        <div className="fixed inset-0 z-30 bg-black/35" onClick={() => setIsHistoryOpen(false)}>
          <aside
            className="absolute left-0 top-0 h-full w-[82%] max-w-[320px] bg-white border-r border-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pt-12 pb-3 border-b border-zinc-200">
              <p className="font-bold">Chat History</p>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center ui-pressable ui-focus-ring"
                aria-label="Close chat history"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-zinc-100 overflow-y-auto h-[calc(100%-4.25rem)]">
              {conversations.map((chat) => {
                const active = selectedConversation?.id === chat.id;
                return (
                  <button
                    key={chat.id}
                    onClick={() => openConversation(chat.id)}
                    className={`w-full px-4 py-3 text-left transition-colors ${active ? 'bg-zinc-100' : 'hover:bg-zinc-50'}`}
                  >
                    <p className="font-semibold text-sm">{chat.sellerName}</p>
                    <p className="text-xs text-zinc-600 line-clamp-1">{chat.productName}</p>
                    <p className="text-xs text-zinc-500 line-clamp-1 mt-1">{chat.lastMessage}</p>
                  </button>
                );
              })}
              {conversations.length === 0 && <p className="px-4 py-8 text-sm text-zinc-500">No negotiation chat yet.</p>}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

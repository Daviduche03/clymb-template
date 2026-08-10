export type OrderProps = {
  orderNumber: string;
  status: string;
  orderDate: string;
  estimatedDelivery?: string;
  items: Array<{
    id: string | number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  payment: {
    method: string;
    total: number;
  };
};

export function OrderOne({ order }: { order: OrderProps }) {
  return (
    <div className="w-full max-w-2xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-zinc-950">Order: #{order.orderNumber}</h2>
          <button
            type="button"
            className="rounded-none border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Download Invoice
          </button>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Order Status</dt>
            <dd className="mt-1 inline-block border border-zinc-300 bg-white px-2 py-0.5 text-xs font-medium uppercase tracking-[0.12em] text-zinc-900">
              {order.status}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Order Date</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">{order.orderDate}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Delivery Date</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">{order.estimatedDelivery}</dd>
          </div>
        </dl>
      </div>

      <div className="p-6">
        <div className="divide-y divide-zinc-100">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 overflow-hidden border border-zinc-200 bg-zinc-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-zinc-950">{item.name}</h4>
                  {item.description ? <p className="text-sm text-zinc-500">{item.description}</p> : null}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-zinc-950">${item.price}</p>
                <p className="text-sm text-zinc-500">Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
          <span className="text-sm text-zinc-500">{order.payment.method}</span>
          <div>
            <span className="mr-2 text-sm text-zinc-500">Total:</span>
            <span className="text-lg font-bold text-zinc-950">${order.payment.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
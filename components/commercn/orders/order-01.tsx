"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

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
		<Card className="w-full max-w-2xl border-gray-100">
			<CardHeader>
				<div className="flex items-center justify-between mb-6">
					<CardTitle className="text-xl font-semibold">
						Order: #{order.orderNumber}
					</CardTitle>
					<Button variant="outline" size="sm">
						Download Invoice
					</Button>
				</div>

				<div className="grid grid-cols-3 gap-4 bg-muted rounded-lg p-4">
					<div>
						<p className="text-sm text-muted-foreground mb-1">Order Status:</p>
						<Badge className="text-xs rounded-md">{order.status}</Badge>
					</div>
					<div>
						<p className="text-sm text-muted-foreground mb-1">Order Date:</p>
						<p className="text-sm font-medium">{order.orderDate}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground mb-1">Delivery Date:</p>
						<p className="text-sm font-medium">{order.estimatedDelivery}</p>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{/* Order Items */}
				<div className="space-y-4 mb-6">
					{order.items.map((item) => (
						<div
							key={item.id}
							className="flex items-center justify-between py-3"
						>
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-lg flex-shrink-0">
									<img
										src={item.image}
										alt={item.name}
										className="w-full h-full object-cover rounded-lg opacity-80"
									/>
								</div>
								<div>
									<h4 className="font-medium">{item.name}</h4>
									<p className="text-sm text-muted-foreground">
										{item.description}
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-semibold">${item.price}</p>
								<p className="text-sm text-gray-500">
									Quantity: {item.quantity}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Payment & Total */}
				<div className="border-t border-gray-100 pt-4">
					<div className="flex items-center justify-between">
						<div className="text-sm text-muted-foreground">
							<span>{order.payment.method}</span>
						</div>
						<div className="text-right">
							<span className="text-sm text-muted-foreground mr-2">Total:</span>
							<span className="text-lg font-bold">
								${order.payment.total}
							</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

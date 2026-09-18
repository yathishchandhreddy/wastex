/**
 * WasteX AI - Marketplace Order Service
 * Handles placing orders, retrieving user orders, and tracking order lifecycle.
 */
import type { RecycledProductOrder, RecycledProduct } from '@/src/types/recycledMarketplace';

const STORAGE_KEY = 'wastex_marketplace_orders_v1';

const INITIAL_DEMO_ORDERS: RecycledProductOrder[] = [];

class OrderService {
  private getStoredOrders(): RecycledProductOrder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
        return INITIAL_DEMO_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  }

  private saveOrders(orders: RecycledProductOrder[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      window.dispatchEvent(new Event('wastex_orders_updated'));
    } catch (e) {
      console.warn('Failed to persist order to local storage', e);
    }
  }

  public getOrders(): RecycledProductOrder[] {
    return this.getStoredOrders();
  }

  public getOrderById(orderId: string): RecycledProductOrder | undefined {
    return this.getStoredOrders().find((o) => o.id === orderId);
  }

  public placeOrder(params: {
    product: RecycledProduct;
    quantity: number;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    shippingAddress: string;
    paymentMethod?: string;
    notes?: string;
  }): RecycledProductOrder {
    const orders = this.getStoredOrders();
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: RecycledProductOrder = {
      id: orderId,
      product_id: params.product.id,
      product_name: params.product.name,
      product_image: params.product.image_url,
      category: params.product.category,
      seller_name: params.product.seller_name,
      seller_organization: params.product.seller_organization,
      buyer_name: params.buyerName,
      buyer_email: params.buyerEmail,
      buyer_phone: params.buyerPhone,
      shipping_address: params.shippingAddress,
      order_quantity: params.quantity,
      unit: params.product.unit,
      unit_price: params.product.price,
      total_price: params.product.price * params.quantity,
      currency: params.product.currency || 'INR',
      payment_method: params.paymentMethod || 'Industrial PO / 30-Day Credit',
      order_status: 'Confirmed',
      created_at: new Date().toISOString(),
      estimated_delivery: 'In 3-5 business days',
      tracking_number: `WX-TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      notes: params.notes,
    };

    const updated = [newOrder, ...orders];
    this.saveOrders(updated);
    return newOrder;
  }
}

export const orderService = new OrderService();

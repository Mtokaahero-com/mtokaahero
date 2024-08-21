import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ShoppingCart } from 'lucide-react'
import { RootState } from '@/app/store/store'
import { removeFromCart, updateQuantity } from '@/app/features/cartActions'
import Image from 'next/image'
import Link from 'next/link'

interface CartItemProps {
    item: {
        id: number
        productName: string
        productImage: string
        productPrice: number
        quantity: number
    }
    onUpdateQuantity: (id: number, quantity: number) => void
    onRemove: (id: number) => void
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => (
    <div className="flex justify-between items-center py-2">
        <div className="flex items-center">
            <Image
                src={item.productImage}
                alt={item.productName}
                width={64}
                height={64}
                className="w-16 h-16 object-cover mr-4 rounded"
            />
            <div>
                <p className="font-medium">{item.productName}</p>
                <div className="flex items-center mt-1">
                    <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 bg-gray-200 rounded-l"
                    >
                        -
                    </button>
                    <span className="px-2 py-1 bg-gray-100">{item.quantity}</span>
                    <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded-r"
                    >
                        +
                    </button>
                    <button onClick={() => onRemove(item.id)} className="ml-2 text-red-500">
                        Remove
                    </button>
                </div>
            </div>
        </div>
        <p className="font-medium">${(item.productPrice * item.quantity).toFixed(2)}</p>
    </div>
)

export default function CartComponent() {
    const [isOpen, setIsOpen] = React.useState(false)
    const dispatch = useDispatch()
    const { items, totalItems } = useSelector((state: RootState) => state.cart)

    const totalPrice = items.reduce(
        (sum: number, item: { productPrice: number; quantity: number }) => sum + item.productPrice * item.quantity,
        0,
    )
    const isCartEmpty = items.length === 0

    const handleUpdateQuantity = (productId: number, quantity: number) => {
        dispatch(updateQuantity(productId, quantity))
    }

    const handleRemoveFromCart = (productId: number) => {
        dispatch(removeFromCart(productId))
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {totalItems}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                    {items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={handleRemoveFromCart}
                        />
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Total</p>
                            <p className="font-semibold">${totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                    <Link
                        href={isCartEmpty ? '#' : '/checkout'}
                        className={`block w-full mt-6 ${isCartEmpty ? 'pointer-events-none' : ''}`}
                    >
                        <Button className="w-full" disabled={isCartEmpty}>
                            Checkout
                        </Button>
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    )
}
